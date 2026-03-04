"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { generateEventTitle } from "@/lib/utils/generate-event-title";
import { addFooterTextToAllPages } from "@/lib/utils/pdf-footer";

type ContractData = {
  artistName: string;
  artistStageName?: string;

  venueCompanyName?: string;
  venueAddress?: string;
  venueVatNumber?: string;
  venueName: string;
  venueCity: string;

  eventType?: string;
  eventDate: string;
  eventTime: string;

  transportationsCost: string;
  totalCost: string;
  upfrontPayment: string;
  paymentDate: string;

  signerName: string;
  tourManagerEmail: string;
  tourManagerName: string;
};

type Props = {
  disabled?: boolean;
};

const formatEventType = (value?: string) => {
  switch (value) {
    case "dj-set":
      return "DJ Set";
    case "live":
      return "Live";
    case "festival":
      return "Festival";
    default:
      return value ?? "";
  }
};

export async function generateFilledContractHtml(
  data: ContractData
): Promise<string> {
  const res = await fetch("/contract/contract-template.html");
  if (!res.ok) throw new Error("Failed to load contract template");

  let html = await res.text();

	  const replacements: Record<string, string> = {
	    ARTIST_NAME: data.artistName,
	    ARTIST_STAGE_NAME: data.artistStageName ?? "",

	    VENUE_NAME: data.venueName,
	    VENUE_COMPANY_NAME: data.venueCompanyName ?? data.venueName ?? "",
	    VENUE_ADDRESS: data.venueAddress ?? "",
	    VENUE_VAT: data.venueVatNumber ?? "",
	    VENUE_CITY: data.venueCity ?? "",

    EVENT_TYPE: data.eventType ?? "",
    EVENT_DATE: data.eventDate,
    EVENT_TIME: data.eventTime,

    TRANSPORTATION_COST: data.transportationsCost,
    TOTAL_COST: data.totalCost,
    UPFRONT_PAYMENT: data.upfrontPayment,
    PAYMENT_DATE: data.paymentDate,
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

export default function DocuSignButton({ disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const { watch, setValue, getValues } = useFormContext<EventFormSchema>();

  const contractId = watch("contractId");
  const contractRevisionIndex = watch("contractRevisionIndex");

  const handleClick = async () => {
    const values = getValues();
    try {
      setLoading(true);

      const CONTRACT_DATA: ContractData = {
        artistName: values.artistFullName ?? "",
        artistStageName: values.artistStageName,

        venueName: values.venueName ?? "",
        venueCompanyName: values.venueCompanyName,
        venueAddress: values.venueAddress,
        venueVatNumber: values.venueVatNumber,
        venueCity: values.venueAddress ?? "",

        eventType: formatEventType(values.eventType),
        eventDate: values.eventDate
          ? format(new Date(String(values.eventDate).replace('Z', '')), "dd/MM/yyyy", { locale: it })
          : "",
        eventTime: values.eventStartTime ?? "",

        transportationsCost: String(values.transportationsCost ?? ""),
        totalCost: String(values.totalCost ?? ""),
        upfrontPayment: String(values.depositCost ?? values.upfrontPayment ?? ""),
        paymentDate: values.paymentDate
          ? format(new Date(String(values.paymentDate).replace('Z', '')), "dd/MM/yyyy", {
              locale: it,
            })
          : "",

        signerName: "Luca Bianchi",
        tourManagerEmail: values.tourManagerEmail ?? "",
        tourManagerName: values.tourManagerName ?? "",
      };

      const { default: html2pdf } = await import("html2pdf.js");
      const filledHtml = await generateFilledContractHtml(CONTRACT_DATA);

      const previewWindow = window.open("", "_blank");
      if (!previewWindow) throw new Error("Popup blocked");
      previewWindow.document.open();
      previewWindow.document.write(filledHtml);
      previewWindow.document.close();

      const container = document.createElement("div");
      container.innerHTML = filledHtml;

      const revisionSuffix =
        typeof contractRevisionIndex === "number" && contractRevisionIndex > 0
          ? " R"
          : "";
      const footerTitle = (() => {
        const artistLabel =
          (values.artistStageName || "").trim() ||
          (values.artistFullName || "").trim();
        const venueLabel = (values.venueName || "").trim();
        if (!artistLabel || !venueLabel || !values.eventDate) {
          return `Contratto${revisionSuffix}`;
        }

        const start = new Date(
          `${values.eventDate}T${values.eventStartTime || "00:00"}`
        );
        const end = new Date(
          `${values.eventDate}T${
            values.eventEndTime || values.eventStartTime || "00:00"
          }`
        );

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
          return `Contratto${revisionSuffix}`;
        }

        return `${generateEventTitle(
          artistLabel,
          venueLabel,
          start,
          end
        )}${revisionSuffix}`;
      })();

      const safeUploadFileName = `${footerTitle.replace(/[\\/]/g, "-")}.pdf`;

      const pdfWorker: any = html2pdf()
        .set({
          margin: 10,
          html2canvas: {
            scale: 2,
            onclone: (doc: Document) => {
              const style = doc.createElement("style");
              style.innerHTML = `
                * {
                  color: #000 !important;
                  background: #fff !important;
                  border-color: #000 !important;
                  box-shadow: none !important;
                }
              `;
              doc.head.appendChild(style);
            },
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .toPdf();

      const pdf: any = await pdfWorker.get("pdf");
      addFooterTextToAllPages(pdf, footerTitle, { align: "center" });

      const pdfBlob = await pdfWorker.outputPdf("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, safeUploadFileName);
      formData.append("contractId", String(contractId));
      formData.append("name", CONTRACT_DATA.tourManagerName);
      formData.append("email", CONTRACT_DATA.tourManagerEmail);
      formData.append("anchorString", "DOCUSIGN_SIGNATURE");

      const res = await fetch("/api/contract/docusign-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const raw = await res.text();
        let message = raw;

        try {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === "object" &&
            "message" in parsed &&
            typeof (parsed as any).message === "string"
          ) {
            message = (parsed as any).message;
          }
        } catch {}

        throw new Error(message || "Errore durante l'invio a DocuSign.");
      }

      const json = await res.json();

      toast.success("DocuSign generato!");

      setValue(
        "contractDocument",
        {
          url: json.data.fileUrl,
          name: json.data.fileName,
        },
        { shouldDirty: false }
      );

      setValue("contractStatus", "sent", {
        shouldDirty: false,
      });
    } catch (err) {
      console.error("DocuSign error:", err);
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Errore durante l'invio a DocuSign."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      disabled={loading || Boolean(disabled)}
      onClick={handleClick}
    >
      {loading ? "Invio..." : "Invia a DocuSign"}
    </Button>
  );
}
