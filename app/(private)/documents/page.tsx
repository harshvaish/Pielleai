import { TablePagination } from "../_components/form/TablePagination";
import StatusFilterButton, {
  ContractFilterStatus,
} from "./_components/filters/StatusFilterButton";
import { hasRole, resolveNextPath, splitCsv } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import getSession from "@/lib/data/auth/get-session";
import { getUserProfileIdCached } from "@/lib/cache/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MapPin,
  Repeat,
} from "lucide-react";
import DatesFilterButton from "./_components/filters/DatesFilterButton";
import { getContracts } from "@/lib/data/contracts/get-contracts";

type EventsPageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
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
  artistIds?: string[];
  artistManagerIds?: string[];
  venueIds?: string[];
  sort: "asc" | "desc";
};

type ContractCardStatus = ContractFilterStatus | "missing-info" | "cancelled";
type ActionVariant = "default" | "secondary" | "outline" | "ghost";

export type ContractCard = {
  id: number;
  status: ContractCardStatus;
  statusLabel: string;
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
    avatarUrl: string | null;
    slug: string;
    status: string;
    tourManagerEmail: string | null;
    tourManagerName: string | null;
    tourManagerSurname: string | null;
    tourManagerPhone: string | null;
  };

  venue: {
    id: number;
    name: string;
    address: string;
    company: string | null;
    vatCode: string | null;
    avatarUrl: string | null;
    slug: string;
    status: string;
  };

  event: {
    id: number;
    availabilityId: number;
    status: string;
    eventType: string | null;
    paymentDate: string | null;
    depositCost: string | null;
    transportCost: string | null;
    totalFee: string | null;
    tourManagerEmail: string | null;
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
  { dot: string; badgeBorder: string; badgeBg: string }
> = {
  "missing-info": {
    dot: "bg-amber-500",
    badgeBorder: "border-amber-200",
    badgeBg: "bg-amber-50 text-amber-700",
  },
  "to-sign": {
    dot: "bg-sky-500",
    badgeBorder: "border-sky-200",
    badgeBg: "bg-sky-50 text-sky-700",
  },
  signed: {
    dot: "bg-emerald-500",
    badgeBorder: "border-emerald-200",
    badgeBg: "bg-emerald-50 text-emerald-700",
  },
  refused: {
    dot: "bg-rose-500",
    badgeBorder: "border-rose-200",
    badgeBg: "bg-rose-50 text-rose-700",
  },
  error: {
    dot: "bg-red-500",
    badgeBorder: "border-red-200",
    badgeBg: "bg-red-50 text-red-700",
  },
  cancelled: {
    dot: "bg-pink-500",
    badgeBorder: "border-pink-200",
    badgeBg: "bg-pink-50 text-pink-700",
  },
  archived: {
    dot: "bg-zinc-400",
    badgeBorder: "border-zinc-200",
    badgeBg: "bg-zinc-50 text-zinc-600",
  },
  all: {
    dot: "bg-zinc-400",
    badgeBorder: "border-zinc-200",
    badgeBg: "bg-zinc-50 text-zinc-600",
  },
};

/* -------------------------------------------------------
   BACKEND → UI STATUS MAPPER (FIX #1)
--------------------------------------------------------*/

function mapStatus(status: BackendContractStatus): ContractCardStatus {
  switch (status) {
    case "draft":
      return "to-sign";
    case "signed":
      return "signed";
    case "declined":
      return "refused";
    case "voided":
      return "archived";
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


/* -------------------------------------------------------
   BACKEND → UI CARD MAPPER (FIX #2)
--------------------------------------------------------*/
function mapContract(c: any): ContractCard {
  const uiStatus = mapStatus(c.status as BackendContractStatus);
  const { date, time } = formatDateAndTime(c.availability);

  return {
    id: c.id,

    status: uiStatus,
    statusLabel: uiStatus,

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
      avatarUrl: c.artist.avatarUrl ?? null,
      slug: c.artist.slug,
      status: c.artist.status,
      tourManagerEmail: c.artist.tourManagerEmail ?? null,
      tourManagerName: c.artist.tourManagerName ?? null,
      tourManagerSurname: c.artist.tourManagerSurname ?? null,
      tourManagerPhone: c.artist.tourManagerPhone ?? null,
    },
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
      availabilityId: c.event.availabilityId,
      status: c.event.status,
      eventType: c.event.eventType ?? null,
      paymentDate: c.event.paymentDate ?? null,
      depositCost: c.event.depositCost ?? null,
      transportCost: c.event.transportCost ?? null,
      totalFee: c.event.totalFee ?? null,
      tourManagerEmail: c.event.tourManagerEmail ?? null,
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

  const sp = await searchParams;
  const selectedStatus = (sp?.status as ContractFilterStatus) ?? "all";
  const currentPage = Number(sp?.page ?? "1");
  const sort = (sp?.sort as "asc" | "desc") ?? "desc";

  const filters: ContractsTableFilters = {
    currentPage: currentPage,
    status: splitCsv(sp?.status) as ContractFilterStatus[],
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
    sort: sort,
  };

  function getApiStatusFromUi(
    uiStatus: ContractFilterStatus
  ): BackendContractStatus[] {
    switch (uiStatus) {
      case "to-sign":
        return ["draft"];
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
  const api = await getContracts(user, {
    currentPage,
    startDate: sp?.start ?? "",
    endDate: sp?.end ?? "",
    status: getApiStatusFromUi(selectedStatus),
    sort,
  });

  let contracts: ContractCard[] = api.data.map(mapContract);
  if (selectedStatus !== "all") {
    contracts = contracts.filter((c) => c.status === selectedStatus);
  }

  const totalPages = api.totalPages;

  return (
    <div className="h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Contracts</h1>

        <Button variant="outline" size="sm">
          <Download className="size-4" /> Export
        </Button>
      </div>

      {/* Filters */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 overflow-hidden">
        <div className="max-w-full bg-white flex items-center gap-1 p-1 rounded-2xl overflow-auto">
          <StatusFilterButton status="all" label="All" />
          <StatusFilterButton status="to-sign" label="To sign" />
          <StatusFilterButton status="signed" label="Signed" />
          <StatusFilterButton status="refused" label="Refused" />
          <StatusFilterButton status="error" label="Error" />
          <StatusFilterButton status="archived" label="Archived" />
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
          <Button variant="ghost" size="sm">
            Filtri <ChevronDown className="size-4" />
          </Button>
          <DatesFilterButton filters={filters} />
        </div>
      </div>

      {/* List */}
      {contracts.length > 0 ? (
        <div className="max-h-full flex flex-col gap-3 overflow-auto">
          {contracts.map((contract) => {
            const s = STATUS_STYLES[contract.status];
            const cardHref = `/documents/${contract.id}?data=${encodeURIComponent(
              JSON.stringify(contract)
            )}`;

            return (
              <div
                key={contract.id}
                className="relative bg-white border border-zinc-100 rounded-2xl"
              >
                {/* CARD CONTENT */}
                <div className="grid grid-cols-[minmax(160px,200px)_1fr_auto] gap-4 md:gap-6 items-center p-4">
                  {/* Status Badge */}
                  <div className="flex flex-col gap-3">
                    <Badge
                      variant="outline"
                      className={`w-max gap-2 px-3 py-1.5 text-xs font-semibold border ${s.badgeBorder} ${s.badgeBg}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                      {contract.status}
                    </Badge>
                    <div className="text-xs text-zinc-500">
                      Status changed on {contract.statusDate}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-700">
                      <span className="font-semibold text-black">
                        {contract.stageName}
                      </span>
                      <span className="text-zinc-500">
                        {contract.artistName}
                      </span>

                      <span className="flex items-center gap-1 text-zinc-500">
                        <MapPin className="size-4 text-zinc-400" />
                        {contract.venueName}
                      </span>

                      <span className="flex items-center gap-1 text-zinc-500">
                        <CalendarDays className="size-4 text-zinc-400" />
                        {contract.date}
                      </span>

                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="size-4 text-zinc-400" />
                        {contract.time}
                      </span>
                    </div>

                    {/* FILE LINK (opens new tab, no JS) */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 relative z-10">
                      <span className="flex items-center gap-2">
                        <FileText className="size-4 text-zinc-400" />
                        Contract
                      </span>

                      {contract.fileUrl && (
                        <a
                          href={contract.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-700 underline"
                        >
                          {contract.fileName}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="size-4" />
                </div>

                {/* FULL CARD CLICK AREA */}
                <a
                  href={cardHref}
                  className="absolute inset-0"
                  aria-label="Open contract details"
                />
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

      {contracts.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
