"use client";

import EventDateTimeSelect from "./EventDateTimeSelect";

type ArtistAvailabilitySelectWithCreateProps = {
  highlightMissing?: boolean;
};

export default function ArtistAvailabilitySelectWithCreate({
  highlightMissing,
}: ArtistAvailabilitySelectWithCreateProps) {
  return <EventDateTimeSelect highlightMissing={highlightMissing} />;
}
