"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { EventFormSchema } from "@/lib/validation/event-form-schema";

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

  totalFee: string;
  paymentDate: string;

  signerName: string;
  tourManagerEmail: string;
  tourManagerName: string;
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
    VENUE_COMPANY_NAME: data.venueCompanyName ?? "",
    VENUE_ADDRESS: data.venueAddress ?? "",
    VENUE_VAT: data.venueVatNumber ?? "",
    VENUE_CITY: data.venueCity ?? "",

    EVENT_TYPE: data.eventType ?? "",
    EVENT_DATE: data.eventDate,
    EVENT_TIME: data.eventTime,

    TOTAL_FEE: data.totalFee,
    PAYMENT_DATE: data.paymentDate,
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

export default function DocuSignButton() {
  const [loading, setLoading] = useState(false);
  const { watch, setValue, getValues } = useFormContext<EventFormSchema>();

  const contractId = watch("contractId");

  const buildEventTime = (start?: string, end?: string): string => {
    if (!start || !end) return "";
    return `${start} – ${end}`;
  };

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
          ? format(new Date(values.eventDate), "dd/MM/yyyy", { locale: it })
          : "",
        eventTime: buildEventTime(values.eventStartTime, values.eventEndTime),

        totalFee: String(values.totalCost ?? ""),
        paymentDate: values.paymentDate
          ? format(new Date(values.paymentDate), "dd/MM/yyyy", {
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

      const pdfBlob = await html2pdf()
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
        .outputPdf("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, "contract.pdf");
      formData.append("contractId", String(contractId));
      formData.append("name", CONTRACT_DATA.tourManagerName);
      formData.append("email", CONTRACT_DATA.tourManagerEmail);
      formData.append("anchorString", "DOCUSIGN_SIGNATURE");

      const res = await fetch("/api/contract/docusign-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

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
      toast.error("Errore durante l'invio a DocuSign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? "Invio..." : "Invia a DocuSign"}
    </Button>
  );
}
