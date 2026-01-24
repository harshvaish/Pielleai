import BackButton from "@/app/_components/BackButton";
import EventStatusBadge from "@/app/(private)/_components/Badges/EventStatusBadge";
import EventConflictBadge from "@/app/(private)/_components/Badges/EventConflictBadge";
import ArtistsBadge from "@/app/(private)/_components/Badges/ArtistsBadge";
import DocumentVenuesBadge from "@/app/(private)/_components/Badges/DocumentVenuesBadge";
import { TablePagination } from "@/app/(private)/_components/form/TablePagination";
import StatusFilterButton from "@/app/(private)/eventi/_components/filters/StatusFilterButton";
import FiltersButton from "@/app/(private)/eventi/_components/filters/FiltersButton";
import DatesFilterButton from "@/app/(private)/eventi/_components/filters/DatesFilterButton";
import ConflictFilterButton from "@/app/(private)/eventi/_components/filters/ConflictFilterButton";
import ExportButton from "@/app/(private)/eventi/_components/ExportButton";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import { getEvents } from "@/lib/data/events/get-events";
import { getArtistsCached } from "@/lib/cache/artists";
import { getArtistManagersCached } from "@/lib/cache/artist-managers";
import { getVenuesCached } from "@/lib/cache/venues";
import { eventsFiltersSchema } from "@/lib/validation/filters/events-filters-schema";
import { EventsTableFilters, EventStatus } from "@/lib/types";
import { hasRole, resolveNextPath, splitCsv } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ChevronRight, FileText, Mail, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_FALLBACK } from "@/lib/constants";

type TechnicalRidePageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    conflict?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
    sort?: "asc" | "desc";
  }>;
};

type DateAndTime = {
  date: string;
  time: string;
};

function formatDateAndTime(
  availability:
    | {
        startDate: string | Date;
        endDate: string | Date;
      }
    | null
    | undefined
): DateAndTime {
  if (!availability) {
    return { date: "-", time: "-" };
  }

  const start = new Date(availability.startDate);
  const end = new Date(availability.endDate);

  const date = start.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = `${start.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${end.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return { date, time };
}

export const dynamic = "force-dynamic";

export default async function TechnicalRidePage({
  searchParams,
}: TechnicalRidePageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect("/logout");
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ["admin", "artist-manager", "venue-manager"])) {
    notFound();
  }

  const isAdmin = user.role === "admin";
  const isArtistManager = user.role === "artist-manager";
  const isVenueManager = user.role === "venue-manager";

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? "1");
  const sort = (sp?.sort as "asc" | "desc") ?? "desc";
  const baseQuery = Object.fromEntries(
    Object.entries(sp ?? {}).filter(([, v]) => v != null)
  ) as Record<string, string>;
  const allStatusQuery = { ...baseQuery };
  delete allStatusQuery.status;

  const filters: EventsTableFilters = {
    currentPage,
    status: splitCsv(sp?.status) as EventStatus[],
    conflict: sp?.conflict === "true",
    artistIds: splitCsv(sp?.artist),
    artistManagerIds: splitCsv(sp?.manager),
    venueIds: splitCsv(sp?.venue),
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
  };

  const validation = eventsFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const [{ data: events, totalPages }, artists, artistManagers, venues] =
    await Promise.all([
      getEvents(user, filters),
      getArtistsCached(isArtistManager ? profileId! : undefined),
      isAdmin ? getArtistManagersCached() : Promise.resolve([]),
      getVenuesCached(isVenueManager ? profileId! : undefined),
    ]);
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = a.availability?.startDate
      ? new Date(a.availability.startDate).getTime()
      : 0;
    const bStart = b.availability?.startDate
      ? new Date(b.availability.startDate).getTime()
      : 0;
    return sort === "desc" ? bStart - aStart : aStart - bStart;
  });

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <BackButton />
        <div className="flex items-center gap-2">
          {isAdmin && <ExportButton filters={filters} />}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-bold">Technical Ride</h1>
          <div className="flex items-center gap-2">
            <FiltersButton
              userRole={user.role}
              filters={filters}
              artists={artists}
              artistManagers={artistManagers}
              venues={venues}
              label="Mostra ricerca"
            />
            <Link
              href={{
                query: {
                  ...baseQuery,
                  sort: sort === "desc" ? "asc" : "desc",
                  page: "1",
                },
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-800"
            >
              Ordina{" "}
              <span className="text-zinc-400">
                {sort === "desc" ? "Più recente" : "Meno recente"}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-3 overflow-hidden">
          <div className="max-w-full bg-white flex items-center gap-1 p-0.5 rounded-xl overflow-auto">
            <Link
              href={{ query: { ...allStatusQuery, page: "1" } }}
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                !sp?.status
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Tutti
            </Link>
            <StatusFilterButton status="proposed" label="Proposto" />
            <StatusFilterButton status="pre-confirmed" label="Preconfermato" />
            <StatusFilterButton status="confirmed" label="Confermato" />
            <StatusFilterButton status="rejected" label="Rifiutato" />
            <StatusFilterButton status="ended" label="Finito" />
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <ConflictFilterButton />}
            <DatesFilterButton filters={filters} />
          </div>
        </div>
      </div>

      {sortedEvents.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedEvents.map((event) => {
            const { date, time } = formatDateAndTime(event.availability);
            const riderName =
              event.tecnicalRiderName || "Technical Ride.pdf";
            return (
              <div
                key={event.id}
                className="rounded-2xl border border-zinc-100 bg-white p-4"
              >
                <div className="grid gap-4 md:grid-cols-[160px_1fr_auto]">
                  <div className="flex flex-col gap-2 md:border-r md:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <EventStatusBadge status={event.status} size="sm" />
                      {event.hasConflict && (
                        <EventConflictBadge size="sm" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-zinc-800">
                      {date}
                    </div>
                    <div className="text-xs text-zinc-500">{time}</div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <ArtistsBadge
                        artists={[event.artist]}
                        userRole={user.role}
                      />
                      <DocumentVenuesBadge
                        userRole={user.role}
                        venues={[event.venue]}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Locale</span>
                        <span className="text-zinc-700">
                          Club "{event.venue.name}"
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Manager</span>
                        {event.artistManager ? (
                          <Link
                            href={`/manager-artisti/${event.artistManager.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage
                                src={
                                  event.artistManager.avatarUrl ||
                                  AVATAR_FALLBACK
                                }
                              />
                              <AvatarFallback>
                                {event.artistManager.name
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {event.artistManager.name}{" "}
                            {event.artistManager.surname}
                          </Link>
                        ) : (
                          <span className="text-zinc-700">-</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Tour manager</span>
                        <span className="text-zinc-700">
                          {event.artist.tourManagerName ||
                          event.artist.tourManagerSurname
                            ? `${event.artist.tourManagerName ?? ""} ${
                                event.artist.tourManagerSurname ?? ""
                              }`.trim()
                            : event.tourManagerEmail || "-"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Amministrazione</span>
                        <span className="text-zinc-700">
                          {event.payrollConsultantEmail || "-"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      {event.tecnicalRiderUrl ? (
                        <a
                          href={event.tecnicalRiderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-700 hover:underline"
                        >
                          Technical Ride
                        </a>
                      ) : (
                        <span>Technical Ride</span>
                      )}
                      {event.tecnicalRiderUrl ? (
                        <a
                          href={event.tecnicalRiderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline"
                        >
                          <FileText className="h-4 w-4 text-zinc-400" />
                          {riderName}
                        </a>
                      ) : (
                        <span className="text-zinc-400">Mancante</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/eventi/${event.id}/modifica`}
                      aria-label="Open event details"
                      className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                    >
                      <ChevronRight className="h-4 w-4 translate-y-[0.5px]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <section className="flex flex-col justify-center items-center bg-white rounded-2xl p-8">
          <h2 className="text-base font-bold">Nessun documento</h2>
          <div className="text-sm font-medium text-zinc-400">
            Aggiungi un evento per vedere i rider tecnici.
          </div>
        </section>
      )}

      {events.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
