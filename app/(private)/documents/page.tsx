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

type ContractCard = {
  id: string;
  status: ContractCardStatus;
  statusLabel: string;
  statusDate: string;
  artistHandle: string;
  artistName: string;
  venueName: string;
  date: string;
  time: string;
  resend?: boolean;
  actionLabel: string;
  actionVariant: ActionVariant;
  href: string;
  payload: {
    artistId: number;
    venueId: number;
    eventId: number;
    contractDate: string;
    fileUrl: string;
    fileName: string;
    recipientEmail: string;
    ccEmails: string[];
    status: ContractCardStatus;
    note: string;
  };
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

/* -------------------------------------------------------
   BACKEND → UI CARD MAPPER (FIX #2)
--------------------------------------------------------*/

function mapContract(c: any): ContractCard {
  const uiStatus = mapStatus(c.status as BackendContractStatus);

  return {
    id: String(c.id),
    status: uiStatus,
    statusLabel: uiStatus,
    statusDate: new Date(c.createdAt).toLocaleDateString("it-IT"),

    artistHandle: `@${c.artist.stageName}`,
    artistName: `${c.artist.name} ${c.artist.surname}`,
    venueName: c.venue.name,

    date: new Date(c.contractDate).toLocaleDateString("it-IT"),
    time: "—",

    actionLabel: "Modifica",
    actionVariant: "outline",
    href: `/documents/${c.id}`,

    payload: {
      artistId: c.artist.id,
      venueId: c.venue.id,
      eventId: c.event.id,
      contractDate: c.contractDate,
      fileUrl: c.fileUrl,
      fileName: c.fileName,
      recipientEmail: c.recipientEmail,
      ccEmails: c.ccs ?? [],
      status: uiStatus, // ✅ FIX: UI status, not backend status
      note:
        c.history?.[0]?.note ??
        "Initial contract created by admin before artist signature.",
    },
  };
}

/* -------------------------------------------------------
   PAGE
--------------------------------------------------------*/

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
        return["declined"]
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
  
  /* -------------------------------------------------------
     RENDER
  --------------------------------------------------------*/

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
              Ordina <span className="text-zinc-400">{sort === "desc" ? "Più recente" : "Meno recente"}</span>
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
            
            return (
              <Link href={{
                pathname: `/documents/${contract.id}`,
                query: {
                  data: encodeURIComponent(JSON.stringify(contract.payload)),
                },        
              }}  key={contract.id}
>

              <div
                className="grid grid-cols-[minmax(160px,200px)_1fr_auto] gap-4 md:gap-6 items-center bg-white border border-zinc-100 rounded-2xl p-4"
              >
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
                      {contract.artistHandle}
                    </span>
                    <span className="text-zinc-500">{contract.artistName}</span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <MapPin className="size-4 text-zinc-400" />{" "}
                      {contract.venueName}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <CalendarDays className="size-4 text-zinc-400" />{" "}
                      {contract.date}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="size-4 text-zinc-400" /> {contract.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600">
                    <span className="flex items-center gap-2">
                      <FileText className="size-4 text-zinc-400" /> Contract
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 underline">
                      Contract.pdf
                    </span>
                  </div>
                </div>

                {/* Actions */}
                  <ChevronRight className="size-4" />
              </div>
              </Link>

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
          currentPage={1}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
