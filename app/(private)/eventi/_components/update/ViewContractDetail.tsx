"use client";

import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { it } from "date-fns/locale";
import { format } from "date-fns";
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
  eventStartDate: string;
  eventEndDate: string;
  eventStartTime: string;
  eventEndTime: string;

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
  transportationsCost: string;
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
    transportationsCost?: string;
  };

  contract: {
    id: string;
  };
};

/* --------------------------------
   HTML TEMPLATE FILLER
-------------------------------- */

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
  if (!res.ok) {
    throw new Error("Failed to load contract template");
  }

  let html = await res.text();

  html = html.replace(
    "<head>",
    `<head><base href="${window.location.origin}/">`
  );
  
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
    EVENT_START_DATE: data.eventStartDate,
    EVENT_END_DATE: data.eventEndDate,
    EVENT_START_TIME: data.eventStartTime,
    EVENT_END_TIME: data.eventEndTime,

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

export default function ViewContractDetail({
  event,
  isDetailsComplete,
}: {
  event: EventType;
  isDetailsComplete: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(false);

  const { watch, setValue } = useFormContext<EventFormSchema>();

  const contractId = watch("contractId");

  const formatDate = (value?: Date | string): string => {
    if (!value) return "";
    const dateStr = typeof value === 'string' ? value.replace('Z', '') : value;
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: it });
  };

  const formatTime = (value?: Date | string): string => {
    if (!value) return "";
    const dateStr = typeof value === 'string' ? value.replace('Z', '') : value;
    return format(new Date(dateStr), "HH:mm", { locale: it });
  };

  const startDateValue = event.availability?.startDate;
  const endDateValue = event.availability?.endDate;
  const startDate = formatDate(startDateValue);
  const endDate = formatDate(endDateValue);
  const isMultiDay = Boolean(startDate && endDate && startDate !== endDate);

  const CONTRACT_DATA: ContractData = {
    artistName: `${event.artist.name} ${event.artist.surname}`,
    artistStageName: event.artist.stageName,

    venueName: event.venue?.name ?? "",
    venueCompanyName: event.venue?.company,
    venueAddress: event.venue?.address,
    venueVatNumber: event.venue?.vatCode,
    venueCity: event.venue?.city ?? "",

    eventType: formatEventType(event.eventType),
    eventDate: isMultiDay ? `${startDate} - ${endDate}` : startDate,
    eventStartDate: startDate,
    eventEndDate: endDate || startDate,
    eventStartTime: formatTime(startDateValue),
    eventEndTime: formatTime(endDateValue) || formatTime(startDateValue),
    totalCost: event?.totalCost ?? "0",
    upfrontPayment: event?.depositCost ?? "0",
    transportationsCost: event?.transportationsCost ?? "0",
    paymentDate: event?.paymentDate
      ? format(new Date(String(event?.paymentDate).replace('Z', '')), "dd/MM/yyyy")
      : "",

    totalFee: event.event?.totalCost ?? "€0",
    artistManagerFullName: `${event?.artistManager?.name} ${event?.artistManager?.surname}`,
    tourManagerEmail: event?.tourManagerEmail ?? "",
  };

  const handleClick = async () => {
    startTransition(async () => {
      try {
        // if (!event?.tourManagerEmail) {
        //   toast.error("Il Tour Manager è obbligatorio.");
        //   return;
        // }
  
        setLoading(true);  
        const html = await generateFilledContractHtml(CONTRACT_DATA);

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
  
        window.open(url, "_blank", "noopener,noreferrer");
      
      } catch (err) {
        console.error("❌ FINAL ERROR:", err);
        toast.error("Errore durante la generazione DocuSign.");
      } finally {
        setLoading(false);
      }
    });
  };
  
  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      disabled={!isDetailsComplete}
      onClick={handleClick}
    >
      Visualizza contratto
      </Button>
  );
}
