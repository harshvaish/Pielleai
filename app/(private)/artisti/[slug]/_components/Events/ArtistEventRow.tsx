"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EventStatusBadge from "@/app/(private)/_components/Badges/EventStatusBadge";
import { Badge } from "@/components/ui/badge";
import { ArtistEventListItem } from "@/lib/types";
import { useRouter } from "next/navigation";

type ArtistEventRowProps = {
  event: ArtistEventListItem;
  startLabel: string;
  endLabel: string;
  eventLabel: string;
  isOngoing: boolean;
};

export default function ArtistEventRow({
  event,
  startLabel,
  endLabel,
  eventLabel,
  isOngoing,
}: ArtistEventRowProps) {
  const router = useRouter();

  const openDetails = () => {
    router.push(`/eventi/${event.id}`);
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={openDetails}
      onKeyDown={(eventKey) => {
        if (eventKey.key === "Enter" || eventKey.key === " ") {
          eventKey.preventDefault();
          openDetails();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Apri evento ${eventLabel}`}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{startLabel}</span>
          {isOngoing && <Badge variant="emerald">In corso</Badge>}
        </div>
      </TableCell>
      <TableCell>{endLabel}</TableCell>
      <TableCell className="font-medium">{eventLabel}</TableCell>
      <TableCell>{event.venue.name}</TableCell>
      <TableCell>{event.venue.city || "-"}</TableCell>
      <TableCell>
        <EventStatusBadge status={event.status} size="sm" />
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="secondary"
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            openDetails();
          }}
        >
          Dettagli
        </Button>
      </TableCell>
    </TableRow>
  );
}
