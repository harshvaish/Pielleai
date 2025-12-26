"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { it } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";

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

  totalFee: string;
  paymentDate: string;
  tourManagerEmail: string;
  artistManagerFullName: string;
};

type EventType = {
  id: string;
  totalCost: string;
  depositCost: string;
  transportCost: string;
  paymentDate: string;
  artistManagerFullName: string;
  tourManagerEmail: string;
  artist: {
    name: string;
    surname: string;
    stageName?: string;
    tourManagerEmail?: string;
  };
  artistManager: {
    name: string;
    surname: string;
  };
  tourManagerName?: string;

  venue?: {
    name: string;
    company?: string;
    address?: string;
    vatCode?: string;
    city?: string;
  };

  availability?: {
    startDate?: Date | string;
    endDate?: Date | string;
  };

  eventType?: string;

  event?: {
    totalCost?: string;
    depositCost?: string;
    paymentDate?: string;
    transportCost?: string;
  };

  contract: {
    id: string;
  };
};

/* --------------------------------
   HTML TEMPLATE FILLER
-------------------------------- */

export async function generateFilledContractHtml(
  data: ContractData
): Promise<string> {
  const res = await fetch("/contract/contract-template.html");
  if (!res.ok) {
    throw new Error("Failed to load contract template");
  }

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

/* --------------------------------
   COMPONENT
-------------------------------- */

export default function DocuSignButton({ event }: { event: EventType }) {
  const [loading, setLoading] = useState(false);
  console.log(event, "event-----------------------------");

  const getTimeRange = (start?: Date | string, end?: Date | string): string => {
    if (!start || !end) return "";
    return `${format(new Date(start), "HH:mm", { locale: it })} – ${format(
      new Date(end),
      "HH:mm",
      { locale: it }
    )}`;
  };

  const CONTRACT_DATA: ContractData = {
    artistName: `${event.artist.name} ${event.artist.surname}`,
    artistStageName: event.artist.stageName,

    venueName: event.venue?.name ?? "",
    venueCompanyName: event.venue?.company,
    venueAddress: event.venue?.address,
    venueVatNumber: event.venue?.vatCode,
    venueCity: event.venue?.city ?? "",

    eventType: event.eventType,
    eventDate: event.availability?.startDate
      ? format(new Date(event.availability.startDate), "yyyy-MM-dd")
      : "",
    eventTime: getTimeRange(
      event.availability?.startDate,
      event.availability?.endDate
    ),
    totalCost: event?.totalCost ?? "0",
    upfrontPayment: event?.depositCost ?? "0",
    transportationsCost: event?.transportCost ?? "0",
    paymentDate: event?.paymentDate
      ? format(new Date(event?.paymentDate), "dd/MM/yyyy")
      : "",

    totalFee: event.event?.totalCost ?? "€0",
    artistManagerFullName: `${event?.artistManager?.name} ${event?.artistManager?.surname}`,
    tourManagerEmail: event?.tourManagerEmail ?? "",
  };

  const handleClick = async () => {
    try {
      if (!event?.tourManagerEmail) {
        toast.error("Tour Manager is required.");
        return;
      }

      setLoading(true);
      const { default: html2pdf } = await import("html2pdf.js");

      const filledHtml = await generateFilledContractHtml(CONTRACT_DATA);

      const preview = window.open("", "_blank");
      if (!preview) throw new Error("Popup blocked");
      preview.document.write(filledHtml);
      preview.document.close();

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
      formData.append("contractId", event.contract.id);
      formData.append("name", CONTRACT_DATA.artistManagerFullName);
      formData.append("email", event?.tourManagerEmail);
      formData.append("pageNumber", "5");
      formData.append("x", "450");
      formData.append("y", "650");

      const res = await fetch("/api/contract/docusign-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("API status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      } else {
        toast.success("Docusign generated!");
      }

      const json = await res.json();
      console.log("✅ DocuSign response:", json);
    } catch (err) {
      console.error("❌ FINAL ERROR:", err);
      //alert("Errore durante invio a DocuSign");
    } finally {
      setLoading(false);
      console.log("🏁 DocuSign flow finished");
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      disabled={!event?.contract || loading}
      onClick={handleClick}
    >
      {loading ? "Sending..." : "Send to DocuSign"}
    </Button>
  );
}
