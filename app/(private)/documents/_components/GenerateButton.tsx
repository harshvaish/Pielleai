"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { editContract } from "@/lib/server-actions/contracts/update-contract";

type Props = {
  payload: any;
};

export default function GenerateButton({ payload }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const buildPerformanceTime = (
    startDate?: string,
    endDate?: string
  ): string => {
    if (!startDate || !endDate) return "";
    return `${format(new Date(startDate), "HH:mm")} - ${format(
      new Date(endDate),
      "HH:mm"
    )}`;
  };
  // const hasFile = Boolean(payload?.fileUrl);

  const handleGenerate = () => {
    if (!payload?.event?.id) {
      toast.error("Event ID is missing.");
      return;
    }

    const contractPayload = {
      // IDs
      artistId: payload.artist.id,
      venueId: payload.venue.id,
      eventId: payload.event.id,
      contractId: payload.id,

      // Artist
      artistName: `${payload.artist.name} ${payload.artist.surname}`,
      artistStageName: payload.artist.stageName,

      // Venue
      venueName: payload.venue.name,
      venueCompanyName: payload.venue.company,
      venueVatNumber: payload.venue.vatCode,
      venueAddress: payload.venue.address,

      // Event
      eventType: payload.event.eventType,
      eventDate: format(new Date(payload.availability.startDate), "yyyy-MM-dd"),
      perfomanceTime: buildPerformanceTime(
        payload.availability.startDate,
        payload.availability.endDate
      ),

      // Financials
      transfortCost: payload.event.transportCost ?? "",
      totalCost: payload.event.totalFee ?? "",
      upfrontPayment: payload.event.depositCost ?? "",
      paymentDate: payload.event.paymentDate
        ? format(new Date(payload.event.paymentDate), "yyyy-MM-dd")
        : "",

      // Meta
      contractDate: new Date().toISOString().split("T")[0],
      status: "draft" as
        | "draft"
        | "sent"
        | "queued"
        | "viewed"
        | "signed"
        | "declined"
        | "voided",
    };

    startTransition(async () => {
      const response = await editContract(contractPayload);

      if (response.success) {
        toast.success("Contract regenerated!");
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={handleGenerate}
    >
      {isPending ? "Regenerating..." : "Regenerate"}
    </Button>
  );
}
