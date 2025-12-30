"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { editContract } from "@/lib/server-actions/contracts/update-contract";
import { useFormContext } from "react-hook-form";

type Props = {
  payload: any;
};

export default function GenerateButton({ payload }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { getValues } = useFormContext();

  const buildPerformanceTime = (
    startTime?: string,
    endTime?: string
  ): string => {
    if (!startTime || !endTime) return "";
    return `${startTime} - ${endTime}`;
  };

  const handleGenerate = () => {
    const values = getValues();
    console.log(values, "values");

    if (!values?.contractId) {
      toast.error("Event ID is missing.");
      return;
    }

    const contractPayload = {
      // IDs
      artistId: payload.artist.id,
      venueId: payload.venue.id,
      eventId: payload.event.id,
      contractId: values.contractId,

      // Artist
      artistName: values.artistFullName,
      artistStageName: values.artistStageName,

      // Venue
      venueName: values.venueName,
      venueCompanyName: values.venueCompanyName,
      venueVatNumber: values.venueVatNumber,
      venueAddress: values.venueAddress,

      // Event
      eventType: values.eventType,
      eventDate: values.eventDate,
      perfomanceTime: buildPerformanceTime(
        values.eventStartTime,
        values.eventEndTime
      ),

      // Financials
      transportCost: values.transportationsCost ?? 0,
      totalCost: values.totalCost ?? "",
      upfrontPayment: values.upfrontPayment ?? "",

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
        toast.success("Contratto generato!");
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
      {isPending ? "Rigenero..." : "Rigenera"}
    </Button>
  );
}
