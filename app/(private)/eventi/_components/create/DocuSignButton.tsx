"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import html2pdf from "html2pdf.js";
import { it } from 'date-fns/locale';
import { format } from 'date-fns';

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
  signerEmail: string;
};


export async function generateFilledContractHtml(
  data: ContractData
): Promise<string> {
  const res = await fetch("/contract/contract-template.html");
  if (!res.ok) {
    throw new Error("Failed to load contract template");
  }

  let html = await res.text();

  const replacements: Record<string, string> = {
    // Artist
    ARTIST_NAME: data.artistName,
    ARTIST_STAGE_NAME: data.artistStageName ?? "",
  
    // Venue / Organizer
    VENUE_NAME: data.venueName,
    VENUE_COMPANY_NAME: data.venueCompanyName ?? "",
    VENUE_ADDRESS: data.venueAddress ?? "",
    VENUE_VAT: data.venueVatNumber ?? "",
    VENUE_CITY: data.venueCity ?? "",
  
    // Event
    EVENT_TYPE: data.eventType ?? "",
    EVENT_DATE: data.eventDate,
    EVENT_TIME: data.eventTime,
  
    // Financial (if later used in other pages)
    TOTAL_FEE: data.totalFee,
    PAYMENT_DATE: data.paymentDate,
  };
  

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}
  
type EventType = {
  id: string;

  artist: {
    name: string;
    surname: string;
    stageName?: string;
  };

  venue?: {
    name: string;
    company?: string;
    address?: string;
    vatCode?: string;
  };

  availability?: {
    startDate?: Date | string;
    endDate?: Date | string;
  };

  eventType?: string;

  contract: {
    id: string;
  };
};


export default function DocuSignButton({ event }: { event: EventType }) {
  const [loading, setLoading] = useState(false);
console.log(event, "event-----------------------------");

const getTime = (
  start?: Date | string,
  end?: Date | string
): string => {
  if (start) {
    return format(new Date(start), "HH:mm", { locale: it });
  }
  if (end) {
    return format(new Date(end), "HH:mm", { locale: it });
  }
  return "";
};

const CONTRACT_DATA: ContractData = {
  artistName: `${event.artist.name} ${event.artist.surname}`,
  artistStageName: event.artist.stageName,

  venueCompanyName: event.venue?.company,
  venueAddress: event.venue?.address,
  venueVatNumber: event.venue?.vatCode,

  venueName: event.venue?.name ?? "",
  venueCity: event.venue?.address ?? "",

  eventType: event.eventType,
  eventDate: event.availability?.startDate
    ? format(new Date(event.availability.startDate), "yyyy-MM-dd")
    : "",
  eventTime: getTime(
    event.availability?.startDate,
    event.availability?.endDate
  ),

  totalFee: "€5,000",
  paymentDate: "25/12/2025",

  signerName: "Luca Bianchi",
  signerEmail: "luca.bianchi@example.com",
};

// const handleClick = () => {
//     const encoded = encodeURIComponent(JSON.stringify(DUMMY_CONTRACT_DATA));
//     window.open(`/contract/contract-template.html?data=${encoded}`, '_blank');
//   };

const handleClick = async () => {
  console.log("👉 DocuSign click started");

  try {
    setLoading(true);

    /* 1️⃣ Generate filled HTML */
    console.log("1️⃣ Generating HTML");
    const filledHtml = await generateFilledContractHtml(CONTRACT_DATA);

    /* 2️⃣ Preview (safe, no DOM access) */
    console.log("2️⃣ Opening preview tab");
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) throw new Error("Popup blocked");

    previewWindow.document.open();
    previewWindow.document.write(filledHtml);
    previewWindow.document.close();

    /* 3️⃣ HTML → PDF (CRITICAL FIX HERE) */
    console.log("3️⃣ Converting HTML to PDF");

    const container = document.createElement("div");
    container.innerHTML = filledHtml;

    const pdfBlob = await html2pdf()
      .set({
        margin: 10,
        html2canvas: {
          scale: 2,

          // 🔥 THIS is the ONLY real fix for lab()/oklch()
          onclone: (clonedDoc: Document) => {
            const style = clonedDoc.createElement("style");
            style.innerHTML = `
              * {
                color: #000 !important;
                background: #fff !important;
                background-color: #fff !important;
                border-color: #000 !important;
                box-shadow: none !important;
                text-shadow: none !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .outputPdf("blob");

    console.log("✅ PDF generated", pdfBlob.size);

    /* 4️⃣ Prepare FormData */
    console.log("4️⃣ Preparing FormData");
    const formData = new FormData();
    formData.append("file", pdfBlob, "contract.pdf");
    formData.append("contractId", String(event.contract.id));
    formData.append("name", CONTRACT_DATA.signerName);
    formData.append("email", CONTRACT_DATA.signerEmail);

    // page-based signing
    formData.append("pageNumber", String(5));
    formData.append("x", String(450));
    formData.append("y", String(650));

    /* 5️⃣ API call */
    console.log("5️⃣ Calling DocuSign API");
    const res = await fetch("/api/contract/docusign-document", {
      method: "POST",
      body: formData,
    });

    console.log("API status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
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
