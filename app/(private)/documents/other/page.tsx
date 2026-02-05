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
import { getOtherDocuments } from "@/lib/data/documents/get-other-documents";
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
import { PAGINATED_TABLE_ROWS_X_PAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type OtherDocumentsPageProps = {
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
        startDate: Date | string | null;
        endDate: Date | string | null;
      }
    | null
    | undefined
): DateAndTime {
  if (!availability || !availability.startDate || !availability.endDate) {
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

export default async function OtherDocumentsPage({
  searchParams,
}: OtherDocumentsPageProps) {
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

  const [otherDocuments, artists, artistManagers, venues] = await Promise.all([
    getOtherDocuments(500),
    getArtistsCached(isArtistManager ? profileId! : undefined),
    isAdmin ? getArtistManagersCached() : Promise.resolve([]),
    getVenuesCached(isVenueManager ? profileId! : undefined),
  ]);

  let filteredDocuments = otherDocuments;
  if (filters.status?.length) {
    const allowed = new Set(filters.status);
    filteredDocuments = filteredDocuments.filter((doc) =>
      allowed.has(doc.event.status as EventStatus)
    );
  }

  if (filters.conflict) {
    filteredDocuments = filteredDocuments.filter((doc) => doc.event.hasConflict);
  }

  if (filters.artistIds?.length) {
    const ids = new Set(filters.artistIds.map(Number));
    filteredDocuments = filteredDocuments.filter((doc) =>
      ids.has(doc.event.artist.id)
    );
  }

  if (filters.artistManagerIds?.length) {
    const ids = new Set(filters.artistManagerIds.map(Number));
    filteredDocuments = filteredDocuments.filter((doc) =>
      doc.event.artistManager ? ids.has(doc.event.artistManager.id) : false
    );
  }

  if (filters.venueIds?.length) {
    const ids = new Set(filters.venueIds.map(Number));
    filteredDocuments = filteredDocuments.filter((doc) =>
      ids.has(doc.event.venue.id)
    );
  }

  if (filters.startDate || filters.endDate) {
    const start = filters.startDate ? filters.startDate.getTime() : null;
    const end = filters.endDate ? filters.endDate.getTime() : null;
    filteredDocuments = filteredDocuments.filter((doc) => {
      const startDate = doc.event.availability?.startDate
        ? new Date(doc.event.availability.startDate).getTime()
        : null;
      if (!startDate) return false;
      if (start !== null && startDate < start) return false;
      if (end !== null && startDate > end) return false;
      return true;
    });
  }

  filteredDocuments = [...filteredDocuments].sort((a, b) => {
    const aStart = a.event.availability?.startDate
      ? new Date(a.event.availability.startDate).getTime()
      : 0;
    const bStart = b.event.availability?.startDate
      ? new Date(b.event.availability.startDate).getTime()
      : 0;
    return sort === "desc" ? bStart - aStart : aStart - bStart;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / PAGINATED_TABLE_ROWS_X_PAGE)
  );
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGINATED_TABLE_ROWS_X_PAGE,
    currentPage * PAGINATED_TABLE_ROWS_X_PAGE
  );

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
          <h1 className="text-xl md:text-2xl font-bold">Altri documenti degli eventi</h1>
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

      {paginatedDocuments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {paginatedDocuments.map((doc) => {
            const { date, time } = formatDateAndTime(doc.event.availability);
            return (
              <div
                key={doc.url}
                className="rounded-2xl border border-zinc-100 bg-white p-4"
              >
                <div className="grid gap-4 md:grid-cols-[160px_1fr_auto]">
                  <div className="flex flex-col gap-2 md:border-r md:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <EventStatusBadge status={doc.event.status as any} size="sm" />
                      {doc.event.hasConflict && <EventConflictBadge size="sm" />}
                    </div>
                    <div className="text-sm font-semibold text-zinc-800">
                      {date}
                    </div>
                    <div className="text-xs text-zinc-500">{time}</div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-zinc-800">
                      {doc.event.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <ArtistsBadge artists={[doc.event.artist]} userRole={user.role} />
                      <DocumentVenuesBadge userRole={user.role} venues={[doc.event.venue]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Locale</span>
                        <span className="text-zinc-700">Club "{doc.event.venue.name}"</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Manager</span>
                        {doc.event.artistManager ? (
                          <Link
                            href={`/manager-artisti/${doc.event.artistManager.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage
                                src={doc.event.artistManager.avatarUrl || AVATAR_FALLBACK}
                              />
                              <AvatarFallback>
                                {doc.event.artistManager.name
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {doc.event.artistManager.name} {doc.event.artistManager.surname}
                          </Link>
                        ) : (
                          <span className="text-zinc-700">-</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Tour manager</span>
                        <span className="text-zinc-700">
                          {doc.event.artist.tourManagerName ||
                          doc.event.artist.tourManagerSurname
                            ? `${doc.event.artist.tourManagerName ?? ""} ${
                                doc.event.artist.tourManagerSurname ?? ""
                              }`.trim()
                            : doc.event.tourManagerEmail || "-"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Amministrazione</span>
                        <span className="text-zinc-700">
                          {doc.event.payrollConsultantEmail || "-"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-700 hover:underline"
                      >
                        Documenti
                      </a>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline"
                      >
                        <FileText className="h-4 w-4 text-zinc-400" />
                        {doc.name}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/eventi/${doc.event.id}/modifica`}
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
            Carica un documento per vederlo qui.
          </div>
        </section>
      )}

      {filteredDocuments.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
