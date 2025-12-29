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

type Props = {
  payload: any;
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

export default function DocuSignButton({ payload }: Props) {
  const [loading, setLoading] = useState(false);
  const { watch, setValue } = useFormContext<EventFormSchema>();
  const contractId = watch("contractId");
  const getEventTime = (
    start?: string,
    end?: string
  ): string => {
    if (!start || !end) return "";
    return `${format(new Date(start), "HH:mm", { locale: it })} – ${format(
      new Date(end),
      "HH:mm",
      { locale: it }
    )}`;
  };
  const CONTRACT_DATA: ContractData = {
    artistName: `${payload.artist.name} ${payload.artist.surname}`,
    artistStageName: payload.artist.stageName,

    venueName: payload.venue?.name ?? "",
    venueCompanyName: payload.venue?.company,
    venueAddress: payload.venue?.address,
    venueVatNumber: payload.venue?.vatCode,
    venueCity: payload.venue?.address ?? "",

    eventType: payload.event?.eventType,
    eventDate: payload.availability?.startDate
      ? format(new Date(payload.availability.startDate), "yyyy-MM-dd")
      : "",
    eventTime: getEventTime(
      payload.availability?.startDate,
      payload.availability?.endDate
    ),

    totalFee: payload.event?.totalFee ?? "€5,000",
    paymentDate: payload.event?.paymentDate
      ? format(new Date(payload.event.paymentDate), "dd/MM/yyyy")
      : "",

    signerName: "Luca Bianchi",
    tourManagerEmail: payload.artist?.tourManagerEmail ?? "",
    tourManagerName: payload.artist?.tourManagerName ?? "",

  };

  const handleClick = async () => {
    try {
      setLoading(true);

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

      formData.append("pageNumber", "5");
      formData.append("x", "450");
      formData.append("y", "650");
      const res = await fetch("/api/contract/docusign-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      } else {
        toast.success("DocuSign generato!");
      }

      const json = await res.json();
      setValue(
        "contractDocument",
        {
          url: json?.data?.fileUrl,
          name: json?.data?.fileName,
        },
        {
          shouldDirty: false,
          shouldTouch: false,
        }
      );
      setValue("contractStatus", "sent" as const, {
        shouldDirty: false,
        shouldTouch: false,
      });
    } catch (err) {
      console.error("DocuSign error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      //disabled={!payload?.contract || loading}
      onClick={handleClick}
    >
      {loading ? "Invio..." : "Invia a DocuSign"}
    </Button>
  );
}
