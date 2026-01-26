import { TablePagination } from "@/app/(private)/_components/form/TablePagination";
import BackButton from "@/app/_components/BackButton";
import StatusFilterButton, {
  ContractFilterStatus,
} from "@/app/(private)/documents/_components/filters/StatusFilterButton";
import DatesFilterButton from "@/app/(private)/documents/_components/filters/DatesFilterButton";
import FiltersButton from "@/app/(private)/documents/_components/filters/FiltersButton";
import ExportButton from "@/app/(private)/documents/_components/ExportButton";
import ResendDocuSignButton from "@/app/(private)/documents/_components/ResendDocuSignButton";
import DocumentVenuesBadge from "@/app/(private)/_components/Badges/DocumentVenuesBadge";
import ArtistsBadge from "@/app/(private)/_components/Badges/ArtistsBadge";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import { getContracts } from "@/lib/data/contracts/get-contracts";
import { getArtistsCached } from "@/lib/cache/artists";
import { getArtistManagersCached } from "@/lib/cache/artist-managers";
import { getVenuesCached } from "@/lib/cache/venues";
import { hasRole, resolveNextPath, splitCsv } from "@/lib/utils";
import { getContractPreviewUrl } from "@/lib/utils/contract-preview";
import { AVATAR_FALLBACK } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  Briefcase,
  User,
  PartyPopper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JSX } from "react";

type ContractsPageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
    sort?: "asc" | "desc";
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

type BackendContractStatus =
  | "draft"
  | "queued"
  | "sent"
  | "viewed"
  | "signed"
  | "voided"
  | "declined"
  | "all";

export type ContractCard = {
  id: number;
  status: ContractCardStatus;
  backendStatus: BackendContractStatus;
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
    title: string | null;
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
  availability: {
    startDate: string;
    endDate: string;
  } | null
): { date: string; time: string } {
  if (!availability) {
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

export default async function ContractsPage({
  searchParams,
}: ContractsPageProps) {
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
  const isVenueManager = user.role === "venue-manager";

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
  const [api, artists, artistManagers, venues] = await Promise.all([
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
    getArtistsCached(isArtistManager ? profileId! : undefined),
    isAdmin ? getArtistManagersCached() : Promise.resolve([]),
    getVenuesCached(isVenueManager ? profileId! : undefined),
  ]);

  const apiData = Array.isArray(api.data) ? api.data : [];
  let contracts: ContractCard[] = apiData.map(mapContract);
  if (selectedStatus !== "all") {
    contracts = contracts.filter((c) => c.status === selectedStatus);
  }

  const totalPages = api.totalPages;
  const hasContracts = contracts.length > 0;

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
    <div className="h-full grid grid-rows-[min-content_min-content_min-content_1fr_min-content] gap-2">
      <div className="flex items-center justify-between gap-3">
        <BackButton />
        {isAdmin && <ExportButton filters={filters} />}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Contratti</h1>
      </div>

      <div className="w-full flex flex-col lg:flex-row justify-between items-end lg:items-center gap-3 overflow-hidden">
        <div className="max-w-full bg-white flex items-center gap-1 p-0.5 rounded-xl overflow-auto">
          <StatusFilterButton status="all" label="Tutti" />
          <StatusFilterButton status="to-sign" label="Da firmare" />
          <StatusFilterButton status="signed" label="Firmato" />
          <StatusFilterButton status="refused" label="Rifiutato" />
          <StatusFilterButton status="error" label="Errore" />
          <StatusFilterButton status="archived" label="Archiviato" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={{
                query: {
                  ...Object.fromEntries(
                    Object.entries(sp ?? {}).filter(([, v]) => v != null)
                  ),
                  sort: sort === "desc" ? "asc" : "desc",
                  page: "1",
                },
              }}
            >
              Ordina{" "}
              <span className="text-zinc-400">
                {sort === "desc" ? "Più recente" : "Meno recente"}
              </span>
              <ChevronDown className="size-4 ml-1" />
            </Link>
          </Button>
          <FiltersButton
            userRole={user.role}
            filters={filters}
            artists={artists}
            artistManagers={artistManagers}
            venues={venues}
          />
          <DatesFilterButton filters={filters} />
        </div>
      </div>

      {hasContracts ? (
        <div className="max-h-full flex flex-col gap-3 overflow-auto">
          {contracts.map((contract) => {
            const s = STATUS_STYLES[contract.status];
            const cardHref = `/documents/${contract.id}`;
            return (
              <div
                key={contract.id}
                className="relative bg-white border border-zinc-100 rounded-2xl"
              >
                <div className="grid grid-cols-[180px_1fr_auto] items-start gap-6 p-4">
                  <div className="flex flex-col gap-1.5 border-r">
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

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="flex flex-col leading-tight">
                        <ArtistsBadge
                          artists={[contract.artist]}
                          userRole={user.role}
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <DocumentVenuesBadge
                          userRole={user.role}
                          venues={[contract.venue]}
                        />
                        <div className="flex items-center gap-4 text-xs py-0.5 text-zinc-500">
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
                        <span className="text-zinc-400">Amministrazione</span>
                        <span className="text-zinc-700">
                          {contract.event.payrollConsultantEmail || "-"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 py-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span>Contratto</span>
                      <span>
                        {contract.fileUrl ? (
                          <span className="flex items-center bg-white border border-zinc-300 rounded-lg px-2 py-1.5">
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
                          "Mancante"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-full items-center">
                    {(contract.backendStatus === "declined" ||
                      contract.backendStatus === "sent" ||
                      contract.backendStatus === "queued" ||
                      contract.backendStatus === "viewed") && (
                      <ResendDocuSignButton contractId={contract.id} />
                    )}
                    <a
                      href={cardHref}
                      aria-label="Open contract details"
                      className="inline-flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 text-zinc-400 translate-y-[0.5px]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <section className="flex flex-col justify-center items-center bg-white rounded-2xl p-8">
          <h2 className="text-base font-bold">There is no contracts yet</h2>
          <div className="text-sm text-zinc-400">
            As soon as contracts are generated, you will see them here.
          </div>
        </section>
      )}

      {hasContracts && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
