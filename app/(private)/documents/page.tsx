import type { ContractFilterStatus } from "./_components/filters/StatusFilterButton";
import { hasRole, resolveNextPath, splitCsv } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  Briefcase,
  User,
  X,
  Check,
  PartyPopper,
} from "lucide-react";
import { getContracts } from "@/lib/data/contracts/get-contracts";
import { getPaginatedArtists } from "@/lib/data/artists/get-paginated-artists";
import ContractsExportButton from "./_components/ExportButton";
import { JSX } from "react";
import ResendDocuSignButton from "./_components/ResendDocuSignButton";
import DocumentVenuesBadge from "../_components/Badges/DocumentVenuesBadge";
import ArtistsBadge from "../_components/Badges/ArtistsBadge";
import ManagersBadge from "../_components/Badges/ManagersBadge";
import EventStatusBadge from "../_components/Badges/EventStatusBadge";
import ExportButton from "../_components/ExportButton";
import { AVATAR_FALLBACK } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistsTableFilters } from "@/lib/types";
import { generateEventTitle } from "@/lib/utils/generate-event-title";
import { getOtherDocuments } from "@/lib/data/documents/get-other-documents";
import { getEventOptions } from "@/lib/data/events/get-event-options";
import UploadDocumentDialog from "./_components/UploadDocumentDialog";
import UploadArtistDocumentDialog from "./_components/UploadArtistDocumentDialog";
import { getArtistsCached } from "@/lib/cache/artists";
import { getArtistOtherDocuments } from "@/lib/data/documents/get-artist-other-documents";
import { getContractPreviewUrl } from "@/lib/utils/contract-preview";

type EventsPageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
    sort?: "asc" | "desc";
    tab?: string;
  }>;
};

type ContractsTableFilters = {
  currentPage: number;
  status: ContractFilterStatus[];
  startDate: Date | null;
  endDate: Date | null;
  conflict?: boolean;
  artistIds: string[];
  artistManagerIds: string[];
  venueIds: string[];
  sort: "asc" | "desc";
};

type ContractCardStatus =
  | ContractFilterStatus
  | "missing-info"
  | "cancelled"
  | "sent";
type ActionVariant = "default" | "secondary" | "outline" | "ghost";

export type ContractCard = {
  id: number;
  status: ContractCardStatus;
  backendStatus: BackendContractStatus; // Added this line
  venueName: string;
  artistName: string;
  date: string;
  statusDate: string;
  stageName: string;
  contractDate: string;
  createdAt: string;
  fileUrl: string | null;
  fileName: string | null;
  recipientEmail: string | null;
  actionVariant: ActionVariant;
  time: string;
  availability: {
    id: number;
    artistId: number;
    startDate: string;
    endDate: string;
    status: string;
  } | null;

  artist: {
    id: number;
    name: string;
    surname: string;
    stageName: string;
    avatarUrl: string;
    slug: string;
    status: "active" | "waiting-for-approval" | "disabled" | "banned";
    tourManagerEmail: string | undefined;
    tourManagerName: string | undefined;
    tourManagerSurname: string | undefined;
    tourManagerPhone: string | undefined;
  };

  artistManager: {
    id: string;
    profileId: number;
    avatarUrl: string | null;
    name: string;
    surname: string;
    status: string;
  } | null;

  venue: {
    id: number;
    name: string;
    address: string;
    company: string | null;
    vatCode: string | null;
    avatarUrl: string | null;
    slug: string;
    status: "active" | "waiting-for-approval" | "disabled" | "banned";
  };

  event: {
    id: number;
    title?: string | null;
    availabilityId: number;
    status: string;
    eventType: string | null;
    paymentDate: string | null;
    depositCost: string | null;
    transportCost: string | null;
    totalFee: string | null;
    tourManagerEmail: string | null;
    tourManagerName: string | null;
    payrollConsultantEmail: string | null;
    tecnicalRiderUrl: string | null;
    tecnicalRiderName: string | null;
  };

  ccs: string[];

  history: {
    id: number;
    fromStatus: BackendContractStatus | null;
    toStatus: BackendContractStatus | null;
    fileUrl: string | null;
    fileName: string | null;
    note: string | null;
    changedByUserId: string | null;
    createdAt: string;
  }[];
};

/* -------------------------------------------------------
   BACKEND STATUS UNION (IMPORTANT)
--------------------------------------------------------*/

type BackendContractStatus =
  | "draft"
  | "queued"
  | "sent"
  | "viewed"
  | "signed"
  | "voided"
  | "declined"
  | "all";

/* -------------------------------------------------------
   STATUS STYLE MAP
--------------------------------------------------------*/

const STATUS_STYLES: Record<
  ContractCardStatus,
  { icon: JSX.Element; badgeBorder: string; badgeBg: string }
> = {
  "missing-info": {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-amber-600 rounded-full">
        <span className="text-[8px] text-white">?</span>
      </div>
    ),
    badgeBorder: "border-amber-200",
    badgeBg: "bg-amber-50 text-amber-700",
  },
  "to-sign": {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-sky-600 rounded-full gap-1">
        <ChevronRight className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-sky-200",
    badgeBg: "bg-sky-50 text-sky-600",
  },
  signed: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-lime-600 rounded-full">
        <Check className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-lime-200",
    badgeBg: "bg-emerald-50 text-lime-700",
  },
  sent: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-sky-600 rounded-full gap-1">
        <ChevronRight className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-sky-200",
    badgeBg: "bg-sky-50 text-sky-600",
  },

  refused: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-red-600 rounded-full">
        <X className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-rose-200",
    badgeBg: "bg-rose-50 text-rose-700",
  },
  error: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-red-600 rounded-full">
        <X className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-red-200",
    badgeBg: "bg-red-50 text-red-700",
  },
  cancelled: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-blue-600 rounded-full">
        <ChevronRight className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-pink-200",
    badgeBg: "bg-pink-50 text-pink-700",
  },
  archived: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-white rounded-full">
        <PartyPopper className="size-3 text-zinc-700" />
      </div>
    ),
    badgeBorder: "border-zinc-200",
    badgeBg: "bg-zinc-50 text-zinc-600",
  },
  all: {
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-blue-600 rounded-full">
        <ChevronRight className="size-2 text-white" />
      </div>
    ),
    badgeBorder: "border-zinc-200",
    badgeBg: "bg-zinc-50 text-zinc-600",
  },
};

/* -------------------------------------------------------
   BACKEND → UI STATUS MAPPER (FIX #1)
--------------------------------------------------------*/

function mapStatus(
  backendStatus: BackendContractStatus,
  hasMissing: boolean
): ContractCardStatus {
  if (backendStatus === "draft") {
    return hasMissing ? "missing-info" : "to-sign";
  }
  switch (backendStatus) {
    case "signed":
      return "signed";
    case "declined":
      return "refused";
    case "voided":
      return "archived";
    case "sent":
      return "to-sign";
    default:
      return "all";
  }
}

function formatDateAndTime(
  availability:
    | {
        startDate: string | null;
        endDate: string | null;
      }
    | null
): { date: string; time: string } {
  if (!availability || !availability.startDate || !availability.endDate) {
    return { date: "—", time: "—" };
  }

  const start = new Date(availability.startDate);
  const end = new Date(availability.endDate);

  const date = start.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
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

function hasMissingDetails(c: any): boolean {
  const artistOk = c.artist?.name && c.artist?.surname && c.artist?.stageName;

  const venueOk =
    c.venue?.name && c.venue?.company && c.venue?.vatCode && c.venue?.address;

  const eventOk =
    c.availability?.startDate &&
    c.availability?.endDate &&
    c.event?.depositCost &&
    c.event?.totalFee;

  return !(artistOk && venueOk && eventOk);
}

/* -------------------------------------------------------
   BACKEND → UI CARD MAPPER (FIX #2)
--------------------------------------------------------*/
function mapContract(c: any): ContractCard {
  const { date, time } = formatDateAndTime(c.availability);

  const backendStatus = c.status as BackendContractStatus;
  const artistManager =
    c.artistManager && c.artistManager.id ? c.artistManager : null;
  return {
    id: c.id,

    backendStatus,
    status: mapStatus(backendStatus, hasMissingDetails(c)),

    venueName: c.venue.name,
    artistName: `${c.artist.name} ${c.artist.surname}`,
    stageName: `@${c.artist.stageName}`,

    date,
    time,

    statusDate: new Date(c.createdAt).toLocaleDateString("it-IT"),
    contractDate: c.contractDate,
    createdAt: c.createdAt,

    fileUrl: c.fileUrl ?? null,
    fileName: c.fileName ?? null,
    recipientEmail: c.recipientEmail ?? null,

    actionVariant: "outline",

    artist: {
      id: c.artist.id,
      name: c.artist.name,
      surname: c.artist.surname,
      stageName: c.artist.stageName,
      avatarUrl: c.artist.avatarUrl || AVATAR_FALLBACK,
      slug: c.artist.slug,
      status: c.artist.status,
      tourManagerEmail: c.artist.tourManagerEmail ?? undefined,
      tourManagerName: c.artist.tourManagerName ?? undefined,
      tourManagerSurname: c.artist.tourManagerSurname ?? undefined,
      tourManagerPhone: c.artist.tourManagerPhone ?? undefined,
    },
    artistManager,
    availability: c.availability
      ? {
          id: c.availability.id,
          artistId: c.availability.artistId,
          startDate: c.availability.startDate,
          endDate: c.availability.endDate,
          status: c.availability.status,
        }
      : null,

    venue: {
      id: c.venue.id,
      name: c.venue.name,
      address: c.venue.address,
      company: c.venue.company ?? null,
      vatCode: c.venue.vatCode ?? null,
      avatarUrl: c.venue.avatarUrl ?? null,
      slug: c.venue.slug,
      status: c.venue.status,
    },

    event: {
      id: c.event.id,
      title: c.event.title ?? null,
      availabilityId: c.event.availabilityId,
      status: c.event.status,
      eventType: c.event.eventType ?? null,
      paymentDate: c.event.paymentDate ?? null,
      depositCost: c.event.depositCost ?? null,
      transportCost: c.event.transportCost ?? null,
      totalFee: c.event.totalFee ?? null,
      tourManagerEmail: c.event.tourManagerEmail ?? null,
      tourManagerName: c.event?.tourManagerName ?? null,
      payrollConsultantEmail: c.event.payrollConsultantEmail ?? null,
      tecnicalRiderUrl: c.event.tecnicalRiderUrl ?? null,
      tecnicalRiderName: c.event.tecnicalRiderName ?? null,
    },

    ccs: c.ccs ?? [],

    history: (c.history ?? []).map((h: any) => ({
      id: h.id,
      fromStatus: h.fromStatus ?? null,
      toStatus: h.toStatus ?? null,
      fileUrl: h.fileUrl ?? null,
      fileName: h.fileName ?? null,
      note: h.note ?? null,
      changedByUserId: h.changedByUserId ?? null,
      createdAt: h.createdAt,
    })),
  };
}

function getContractDisplayName(contract: ContractCard): string {
  const title = contract.event.title?.trim();
  return title || contract.fileName || "Contratto.pdf";
}

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { session, user } = await getSession();
  if (!session || !user || user.banned) redirect("/logout");
  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ["admin", "artist-manager", "venue-manager"])) {
    notFound();
  }
  const isAdmin = user.role === "admin";
  const isArtistManager = user.role === "artist-manager";

  const sp = await searchParams;
  const statusParam = sp?.status === "declined" ? "refused" : sp?.status;
  const selectedStatus = (statusParam as ContractFilterStatus) ?? "all";
  const currentPage = Number(sp?.page ?? "1");
  const sort = (sp?.sort as "asc" | "desc") ?? "desc";

  const filters: ContractsTableFilters = {
    currentPage: currentPage,
    status: splitCsv(statusParam) as ContractFilterStatus[],
    artistIds: splitCsv(sp?.artist),
    artistManagerIds: splitCsv(sp?.manager),
    venueIds: splitCsv(sp?.venue),
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
    sort: sort,
  };

  function getApiStatusFromUi(
    uiStatus: ContractFilterStatus
  ): BackendContractStatus[] {
    switch (uiStatus) {
      case "to-sign":
        return ["sent"];
      case "signed":
        return ["signed"];
      case "refused":
        return ["declined"];
      case "error":
      case "archived":
        return ["voided"];
      case "all":
      default:
        return ["all"];
    }
  }
  const managersFilter = isAdmin
    ? []
    : isArtistManager
      ? [profileId!.toString()]
      : [];
  const artistFilters: ArtistsTableFilters = {
    currentPage: 1,
    fullName: null,
    email: null,
    phone: null,
    managerIds: managersFilter,
    zoneIds: [],
  };

  const [api, artistsResult, otherDocuments, eventOptions, artistsOptions, artistOtherDocuments] =
    await Promise.all([
    getContracts(user, {
      currentPage,
      startDate: sp?.start ?? "",
      endDate: sp?.end ?? "",
      status: getApiStatusFromUi(selectedStatus),
      artistIds: filters.artistIds,
      artistManagerIds: filters.artistManagerIds,
      venueIds: filters.venueIds,
      sort,
    }),
    getPaginatedArtists(artistFilters),
    getOtherDocuments(),
    isAdmin ? getEventOptions() : Promise.resolve([]),
    isAdmin ? getArtistsCached() : Promise.resolve([]),
    getArtistOtherDocuments(),
  ]);
  const artists = artistsResult.data;

  const apiData = Array.isArray(api.data) ? api.data : [];
  let contracts: ContractCard[] = apiData.map(mapContract);
  if (selectedStatus !== "all") {
    contracts = contracts.filter((c) => c.status === selectedStatus);
  }

  const totalPages = api.totalPages;
  const hasContracts = contracts.length > 0;
  const activeTab = sp?.tab === "artisti" ? "artisti" : "eventi";
  const baseQuery = Object.fromEntries(
    Object.entries(sp ?? {}).filter(([, v]) => v != null)
  );
  const previewContracts = contracts.slice(0, 3);
  const previewOtherDocuments = otherDocuments;
  const previewArtists = artists.slice(0, 3);
  const previewArtistOtherDocuments = artistOtherDocuments.slice(0, 3);
  const buildEventTitle = (contract: ContractCard) => {
    const existingTitle = contract.event.title?.trim();
    if (existingTitle) return existingTitle;
    if (!contract.availability) return `Evento #${contract.event.id}`;
    const artistLabel =
      contract.artist.stageName?.trim() ||
      `${contract.artist.name} ${contract.artist.surname}`.trim();
    return generateEventTitle(
      artistLabel,
      contract.venue.name,
      new Date(contract.availability.startDate),
      new Date(contract.availability.endDate),
    );
  };

  function getBackendStatusLabel(status: string) {
    switch (status) {
      case "voided":
        return "Archiviato";
      case "sent":
        return "Da firmare";
      case "viewed":
        return "Viewed";
      case "signed":
        return "Firmato";
      case "declined":
        return "Rifiutato";
      case "draft":
        return "Draft";
      case "missing-info":
        return "Missing-info";

      default:
        return status;
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl md:text-2xl font-bold">Documenti</h1>
          <div className="w-fit rounded-xl bg-zinc-100 p-1">
            <div className="flex items-center gap-1">
              <Link
                href={{ query: { ...baseQuery, tab: "eventi" } }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  activeTab === "eventi"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Eventi
              </Link>
              <Link
                href={{ query: { ...baseQuery, tab: "artisti", page: "1" } }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  activeTab === "artisti"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Artisti
              </Link>
            </div>
          </div>
        </div>
        {isAdmin && activeTab === "eventi" && (
          <div className="flex items-center gap-2">
            <UploadDocumentDialog events={eventOptions} />
            <ContractsExportButton filters={filters} />
          </div>
        )}
        {isAdmin && activeTab === "artisti" && (
          <div className="flex items-center gap-2">
            <UploadArtistDocumentDialog artists={artistsOptions} />
            <ExportButton
              endpoint="/api/artists/export"
              filename="export-artisti.csv"
            />
          </div>
        )}
      </div>

      {activeTab === "eventi" ? (
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">Contratti</h2>
              <Link
                href="/documents/contracts"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {hasContracts ? (
              <div className="divide-y divide-zinc-100">
                {contracts.map((contract) => {
                  const s = STATUS_STYLES[contract.status];
                  const cardHref = `/documents/${contract.id}`;
                  return (
                    <div
                      key={contract.id}
                      className="grid gap-4 px-4 py-4 md:grid-cols-[170px_1fr_auto]"
                    >
                      <div className="flex flex-col gap-2 md:border-r md:pr-4">
                        <span
                          className={`w-fit inline-flex gap-1.5 items-center rounded-md px-2 py-1.5 text-xs font-medium border ${s.badgeBorder} ${s.badgeBg}`}
                        >
                          {contract.status === "missing-info"
                            ? "Info mancanti"
                            : getBackendStatusLabel(contract.backendStatus)}
                          <span>{s.icon}</span>
                        </span>
                        <span className="text-xs text-zinc-500">
                          Stato aggiornato
                        </span>
                        <span className="text-xs text-zinc-500">
                          il {contract.statusDate}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="text-sm font-semibold text-zinc-800">
                          {buildEventTitle(contract)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <ArtistsBadge
                            artists={[contract.artist]}
                            userRole={user.role}
                          />
                          <div className="flex flex-col gap-1.5">
                            <DocumentVenuesBadge
                              userRole={user.role}
                              venues={[contract.venue]}
                            />
                            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4 text-zinc-400" />
                                {contract.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-zinc-400" />
                                {contract.time}
                              </span>
                            </div>
                          </div>
                        </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Locale</span>
                          <span className="text-zinc-700">
                            Club "{contract.venue.name}"
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Manager</span>
                        {contract.artistManager ? (
                          <Link
                            href={`/manager-artisti/${contract.artistManager.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage
                                src={
                                  contract.artistManager.avatarUrl ||
                                  AVATAR_FALLBACK
                                }
                              />
                              <AvatarFallback>
                                {contract.artistManager.name
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {contract.artistManager.name}{" "}
                            {contract.artistManager.surname}
                          </Link>
                        ) : (
                          <span className="text-zinc-700">-</span>
                        )}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Tour manager</span>
                          <span className="text-zinc-700">
                            {contract.artist.tourManagerName ||
                            contract.artist.tourManagerSurname
                              ? `${contract.artist.tourManagerName ?? ""} ${
                                  contract.artist.tourManagerSurname ?? ""
                                }`.trim()
                              : contract.event.tourManagerEmail || "-"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">
                            Amministrazione
                          </span>
                          <span className="text-zinc-700">
                            {contract.event.payrollConsultantEmail || "-"}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span>Contratto</span>
                          {contract.fileUrl ? (
                            <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5">
                              <FileText className="h-4 w-4 text-zinc-400" />
                            <a
                              href={getContractPreviewUrl(
                                contract.fileUrl,
                                getContractDisplayName(contract),
                              ) || contract.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-700 hover:underline"
                            >
                                {getContractDisplayName(contract)}
                              </a>
                            </span>
                          ) : (
                            <span className="text-zinc-400">Mancante</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        {(contract.backendStatus === "declined" ||
                          contract.backendStatus === "sent" ||
                          contract.backendStatus === "queued" ||
                          contract.backendStatus === "viewed") && (
                          <ResendDocuSignButton contractId={contract.id} />
                        )}
                        <Link
                          href={cardHref}
                          aria-label="Open contract details"
                          className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                        >
                          <ChevronRight className="h-4 w-4 translate-y-[0.5px]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun contratto disponibile.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">
                Technical Ride
              </h2>
              <Link
                href="/documents/technical-ride"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewContracts.length ? (
              <div className="divide-y divide-zinc-100">
                {previewContracts.map((contract) => (
                  <div
                    key={`tech-${contract.id}`}
                    className="grid gap-4 px-4 py-4 md:grid-cols-[170px_1fr_auto]"
                  >
                    <div className="flex flex-col gap-2 md:border-r md:pr-4">
                      <EventStatusBadge
                        status={contract.event.status as any}
                        size="sm"
                      />
                      <span className="text-sm font-semibold text-zinc-800">
                        {contract.date}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {contract.time}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="text-sm font-semibold text-zinc-800">
                        {buildEventTitle(contract)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <ArtistsBadge
                          artists={[contract.artist]}
                          userRole={user.role}
                        />
                        <DocumentVenuesBadge
                          userRole={user.role}
                          venues={[contract.venue]}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Locale</span>
                          <span className="text-zinc-700">
                            Club "{contract.venue.name}"
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Manager</span>
                        {contract.artistManager ? (
                          <Link
                            href={`/manager-artisti/${contract.artistManager.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage
                                src={
                                  contract.artistManager.avatarUrl ||
                                  AVATAR_FALLBACK
                                }
                              />
                              <AvatarFallback>
                                {contract.artistManager.name
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {contract.artistManager.name}{" "}
                            {contract.artistManager.surname}
                          </Link>
                        ) : (
                          <span className="text-zinc-700">-</span>
                        )}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Tour manager</span>
                          <span className="text-zinc-700">
                            {contract.artist.tourManagerName ||
                            contract.artist.tourManagerSurname
                              ? `${contract.artist.tourManagerName ?? ""} ${
                                  contract.artist.tourManagerSurname ?? ""
                                }`.trim()
                              : contract.event.tourManagerEmail || "-"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">
                            Amministrazione
                          </span>
                          <span className="text-zinc-700">
                            {contract.event.payrollConsultantEmail || "-"}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        {contract.event.tecnicalRiderUrl ? (
                          <a
                            href={contract.event.tecnicalRiderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-700 hover:underline"
                          >
                            Technical Ride
                          </a>
                        ) : (
                          <span>Technical Ride</span>
                        )}
                        {contract.event.tecnicalRiderUrl ? (
                          <a
                            href={contract.event.tecnicalRiderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline"
                          >
                            <FileText className="h-4 w-4 text-zinc-400" />
                            {contract.event.tecnicalRiderName ||
                              "Technical Ride.pdf"}
                          </a>
                        ) : (
                          <span className="text-zinc-400">Mancante</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/eventi/${contract.event.id}/modifica`}
                        aria-label="Open event details"
                        className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                      >
                        <ChevronRight className="h-4 w-4 translate-y-[0.5px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">Other</h2>
              <Link
                href="/documents/other"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewOtherDocuments.length ? (
              <div className="divide-y divide-zinc-100">
                {previewOtherDocuments.map((doc) => {
                  const { date, time } = formatDateAndTime(
                    doc.event.availability
                  );
                  return (
                    <div
                      key={`other-${doc.url}`}
                      className="grid gap-4 px-4 py-4 md:grid-cols-[160px_1fr_auto]"
                    >
                      <div className="flex flex-col gap-2 md:border-r md:pr-4">
                        <EventStatusBadge
                          status={doc.event.status as any}
                          size="sm"
                        />
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
                          <ArtistsBadge
                            artists={[doc.event.artist]}
                            userRole={user.role}
                          />
                          <DocumentVenuesBadge
                            userRole={user.role}
                            venues={[doc.event.venue]}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-zinc-400" />
                            <span className="text-zinc-400">Locale</span>
                            <span className="text-zinc-700">
                              Club "{doc.event.venue.name}"
                            </span>
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
                                    src={
                                      doc.event.artistManager.avatarUrl ||
                                      AVATAR_FALLBACK
                                    }
                                  />
                                  <AvatarFallback>
                                    {doc.event.artistManager.name
                                      .substring(0, 1)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {doc.event.artistManager.name}{" "}
                                {doc.event.artistManager.surname}
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
                            <span className="text-zinc-400">
                              Amministrazione
                            </span>
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
                            Other
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
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>

        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">
                Fiscal Codes
              </h2>
              <Link
                href="/documents/fiscal-codes"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewArtists.length ? (
              <div className="divide-y divide-zinc-100">
                {previewArtists.map((artist) => {
                  return (
                    <div
                      key={`fiscal-${artist.id}`}
                      className="flex flex-col gap-3 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={artist.avatarUrl || AVATAR_FALLBACK}
                            />
                            <AvatarFallback>
                              {artist.stageName.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link
                              href={`/artisti/${artist.slug}`}
                              className="text-xs font-semibold text-zinc-800"
                            >
                              @{artist.stageName}
                            </Link>
                            <div className="text-[10px] text-zinc-500">
                              {artist.name} {artist.surname}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/artisti/${artist.slug}`}
                          aria-label="Open artist details"
                          className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Manager</span>
                          <ManagersBadge
                            userRole={user.role}
                            managers={artist.managers}
                            pathSegment="manager-artisti"
                          />
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Tour manager</span>
                          <span className="text-zinc-700">
                            {artist.tourManagerName ||
                            artist.tourManagerSurname
                              ? `${artist.tourManagerName ?? ""} ${
                                  artist.tourManagerSurname ?? ""
                                }`.trim()
                              : artist.tourManagerEmail || "-"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">
                            Amministrazione
                          </span>
                          <span className="text-zinc-700">
                            {artist.email || "-"}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span>Codice Fiscale</span>
                      {artist.taxCodeFileUrl ? (
                        <a
                          href={artist.taxCodeFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 text-zinc-400" />
                          {artist.taxCodeFileName ?? "Codice Fiscale.pdf"}
                        </a>
                      ) : (
                        <span className="text-zinc-400">Mancante</span>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">ID Card</h2>
              <Link
                href="/documents/id-card"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewArtists.length ? (
              <div className="divide-y divide-zinc-100">
                {previewArtists.map((artist) => {
                  return (
                    <div
                      key={`id-${artist.id}`}
                      className="flex flex-col gap-3 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={artist.avatarUrl || AVATAR_FALLBACK}
                            />
                            <AvatarFallback>
                              {artist.stageName.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link
                              href={`/artisti/${artist.slug}`}
                              className="text-xs font-semibold text-zinc-800"
                            >
                              @{artist.stageName}
                            </Link>
                            <div className="text-[10px] text-zinc-500">
                              {artist.name} {artist.surname}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/artisti/${artist.slug}`}
                          aria-label="Open artist details"
                          className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Manager</span>
                          <ManagersBadge
                            userRole={user.role}
                            managers={artist.managers}
                            pathSegment="manager-artisti"
                          />
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Tour manager</span>
                          <span className="text-zinc-700">
                            {artist.tourManagerName ||
                            artist.tourManagerSurname
                              ? `${artist.tourManagerName ?? ""} ${
                                  artist.tourManagerSurname ?? ""
                                }`.trim()
                              : artist.tourManagerEmail || "-"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">
                            Amministrazione
                          </span>
                          <span className="text-zinc-700">
                            {artist.email || "-"}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span>ID Card</span>
                      {artist.idCardFileUrl ? (
                        <a
                          href={artist.idCardFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 text-zinc-400" />
                          {artist.idCardFileName ?? "ID Card.pdf"}
                        </a>
                      ) : (
                        <span className="text-zinc-400">Mancante</span>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">Passport</h2>
              <Link
                href="/documents/passport"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewArtists.length ? (
              <div className="divide-y divide-zinc-100">
                {previewArtists.map((artist) => {
                  return (
                    <div
                      key={`passport-${artist.id}`}
                      className="flex flex-col gap-3 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={artist.avatarUrl || AVATAR_FALLBACK}
                            />
                            <AvatarFallback>
                              {artist.stageName.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link
                              href={`/artisti/${artist.slug}`}
                              className="text-xs font-semibold text-zinc-800"
                            >
                              @{artist.stageName}
                            </Link>
                            <div className="text-[10px] text-zinc-500">
                              {artist.name} {artist.surname}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/artisti/${artist.slug}`}
                          aria-label="Open artist details"
                          className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Manager</span>
                          <ManagersBadge
                            userRole={user.role}
                            managers={artist.managers}
                            pathSegment="manager-artisti"
                          />
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">Tour manager</span>
                          <span className="text-zinc-700">
                            {artist.tourManagerName ||
                            artist.tourManagerSurname
                              ? `${artist.tourManagerName ?? ""} ${
                                  artist.tourManagerSurname ?? ""
                                }`.trim()
                              : artist.tourManagerEmail || "-"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-400">
                            Amministrazione
                          </span>
                          <span className="text-zinc-700">
                            {artist.email || "-"}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span>Passport</span>
                      {artist.passportFileUrl ? (
                        <a
                          href={artist.passportFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 text-zinc-400" />
                          {artist.passportFileName ?? "Passport.pdf"}
                        </a>
                      ) : (
                        <span className="text-zinc-400">Mancante</span>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-800">Other</h2>
              <Link
                href="/documents/artist-other"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
              >
                Vedi tutto <ChevronRight className="size-4" />
              </Link>
            </div>
            {previewArtistOtherDocuments.length ? (
              <div className="divide-y divide-zinc-100">
                {previewArtistOtherDocuments.map((doc) => (
                  <div
                    key={`other-artist-${doc.url}`}
                    className="flex flex-col gap-3 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={doc.artist.avatarUrl || AVATAR_FALLBACK}
                          />
                          <AvatarFallback>
                            {doc.artist.stageName.substring(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link
                            href={`/artisti/${doc.artist.slug}`}
                            className="text-xs font-semibold text-zinc-800"
                          >
                            @{doc.artist.stageName}
                          </Link>
                          <div className="text-[10px] text-zinc-500">
                            {doc.artist.name} {doc.artist.surname}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/artisti/${doc.artist.slug}`}
                        aria-label="Open artist details"
                        className="inline-flex items-center text-zinc-400 hover:text-zinc-600"
                      >
                        <ChevronRight className="size-4" />
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Manager</span>
                        <ManagersBadge
                          userRole={user.role}
                          managers={doc.artist.managers}
                          pathSegment="manager-artisti"
                        />
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Email</span>
                        <span className="text-zinc-700">
                          {doc.artist.email || "-"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span>Documento</span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600 hover:underline"
                      >
                        <FileText className="h-4 w-4 text-zinc-400" />
                        {doc.name}
                      </a>
                      {doc.uploadedAt && (
                        <span className="text-zinc-400">· {doc.uploadedAt}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-zinc-500">
                Nessun documento disponibile.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
