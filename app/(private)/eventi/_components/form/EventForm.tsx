"use client";

import {
  ArtistManagerSelectData,
  ArtistSelectData,
  MoCoordinator,
  ProfessionalRole,
  ProfessionalSelectData,
  RecommendedArtistData,
  RecommendedArtistsDebug,
  UserRole,
  VenueSelectData,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, fetcher } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfUploadInput from "@/app/(private)/eventi/_components/form/PdfUploadInput";
import OtherTechnicalSheetUploadInput from "@/app/(private)/eventi/_components/form/OtherTechnicalSheetUploadInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import VenueSelect from "./VenueSelect";
import ArtistManagerSelect from "./ArtistManagerSelect";
import EventNotesInput from "./EventNotesInput";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ArtistSelect from "./ArtistSelect";
import QuickCreateArtistDialog from "./QuickCreateArtistDialog";
import QuickCreateArtistManagerDialog from "./QuickCreateArtistManagerDialog";
import QuickCreateVenueDialog from "./QuickCreateVenueDialog";
import { eventStatus } from "@/lib/database/schema";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import ArtistAvailabilitySelectWithCreate from "./ArtistAvailabilitySelectWithCreate";
import EventStatusBadge from "@/app/(private)/_components/Badges/EventStatusBadge";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { QUESTION_ICON, GREEN_TICK_ICON } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { createContract } from "@/lib/server-actions/contracts/create-contract";
import { editContract } from "@/lib/server-actions/contracts/update-contract";
import UploadPdf from "../create/UploadPdf";
import DocuSignButton from "../create/DocuSignButton";
import ContractStatusButton from "../update/ContractStatusButton";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ViewContractButton from "../update/ViewContractButton";
import ViewContractDetail from "../update/ViewContractDetail";
import ResendDocuSignButton from "../update/ResendDocuSignButton";
import { X } from "lucide-react";

const STATUS_OPTIONS = eventStatus.enumValues;

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: "Giornalista",
  technician: "Tecnico",
  photographer: "Fotografo",
  backstage: "Backstage",
  other: "Altro",
};

const EVENT_TYPE_LABELS = {
  "dj-set": "DJ set",
  live: "Dal vivo",
  festival: "Festival",
} as const;

type EventForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  professionals: ProfessionalSelectData[];
  event?: any;
  mode: "create" | "update";
  userRole: UserRole;
  closeDialog?: () => void;
};

type HistoryItem = {
  date: string;
  time: string;
  title: string;
  description?: string;
  updatedBy?: string;
  type: "archived" | "success";
};

export default function EventForm({
  artists,
  venues,
  moCoordinators,
  professionals,
  mode,
  event,
  userRole,
  closeDialog,
}: EventForm) {
  const {
    watch,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventFormSchema>();
  const router = useRouter();
  const [extraArtists, setExtraArtists] = useState<ArtistSelectData[]>([]);
  const [extraVenues, setExtraVenues] = useState<VenueSelectData[]>([]);
  const [extraArtistManagers, setExtraArtistManagers] = useState<ArtistManagerSelectData[]>([]);
  const [professionalsQuery, setProfessionalsQuery] = useState("");
  const [selectedProfessionalRole, setSelectedProfessionalRole] = useState<
    ProfessionalRole | undefined
  >(undefined);
  const canCreateArtist = userRole === "admin" || userRole === "artist-manager";
  const canCreateArtistManager = userRole === "admin";
  const canCreateVenue = userRole === "admin" || userRole === "venue-manager";
  const canManageProfessionals = userRole === "admin";
  const canEditHostedEvent = userRole === "admin";
  // Hosted Event Checkbox
  const hostedEvent = watch("hostedEvent");

  const artistOptions = useMemo(() => {
    const merged = [...artists, ...extraArtists];
    const byId = new Map<number, ArtistSelectData>();
    for (const artist of merged) {
      byId.set(artist.id, artist);
    }
    return Array.from(byId.values());
  }, [artists, extraArtists]);

  const venueOptions = useMemo(() => {
    const merged = [...venues, ...extraVenues];
    const byId = new Map<number, VenueSelectData>();
    for (const venue of merged) {
      byId.set(venue.id, venue);
    }
    return Array.from(byId.values());
  }, [venues, extraVenues]);

  const selectedVenueId = watch("venueId");
  const selectedVenue = venueOptions.find((venue) => venue.id == selectedVenueId);
  const selectedArtistId = watch("artistId");
  const selectedProfessionalIds = watch("professionalIds") || [];
  const selectedAvailability = watch("availability");
  const selectedArtist = useMemo(
    () => artistOptions.find((artist) => artist.id === selectedArtistId),
    [artistOptions, selectedArtistId]
  );
  const contractId = watch("contractId");
  const hasContract = Boolean(contractId);
  const contractDocument = watch("contractDocument");
  const moCost = watch("moCost");
  const bookingPercentage = watch("bookingPercentage");
  const moArtistAdvancedExpenses = watch("moArtistAdvancedExpenses");
  const venueManagerCost = watch("venueManagerCost");
  const totalCost = watch("totalCost");
  const transportationsCost = watch("transportationsCost");
  const hotelCost = watch("hotelCost");
  const restaurantCost = watch("restaurantCost");
  const formValues = watch();
  const contractStatus = useWatch({
    control,
    name: "contractStatus",
  });
  const eventTypeLabel = useMemo(() => {
    const value = formValues.eventType;
    if (!value) return "";
    return EVENT_TYPE_LABELS[value as keyof typeof EVENT_TYPE_LABELS] ?? "";
  }, [formValues.eventType]);
  const isResendable =
    contractStatus === "sent" ||
    contractStatus === "queued" ||
    contractStatus === "viewed" ||
    contractStatus === "declined";
  const lastArtistIdRef = useRef<number | undefined>(undefined);
  const searchParams = useSearchParams();
  const debugEnabled = searchParams?.get("debug") === "1";

  const normalizedBudget =
    typeof moCost === "number" && Number.isFinite(moCost) ? moCost : undefined;

  const recommendedFetchUrl = useMemo(() => {
    if (mode !== "create") return null;
    if (!selectedVenueId) return null;
    if (!selectedAvailability?.startDate || !selectedAvailability?.endDate) return null;
    if (normalizedBudget === undefined) return null;

    const params = new URLSearchParams();
    params.set("venueId", String(selectedVenueId));
    params.set("sd", new Date(selectedAvailability.startDate).toISOString());
    params.set("ed", new Date(selectedAvailability.endDate).toISOString());
    params.set("budget", String(normalizedBudget));
    params.set("limit", "6");
    if (debugEnabled) {
      params.set("debug", "1");
    }
    return `/api/artists/recommended?${params.toString()}`;
  }, [
    mode,
    selectedVenueId,
    selectedAvailability?.startDate,
    selectedAvailability?.endDate,
    normalizedBudget,
    debugEnabled,
  ]);

  const { data: recommendedResponse, isLoading: isRecommendedLoading } = useSWR(
    recommendedFetchUrl,
    fetcher
  );

  const recommendedArtists = (recommendedResponse?.success
    ? recommendedResponse.data
    : []) as RecommendedArtistData[];
  const recommendedDebug = (recommendedResponse?.debug ?? undefined) as
    | RecommendedArtistsDebug
    | undefined;
  const isRecommendationReady = Boolean(
    selectedVenueId && selectedAvailability?.startDate && selectedAvailability?.endDate
  );
  const hasBudget = normalizedBudget !== undefined;

  const selectedProfessionals = useMemo(() => {
    const byId = new Map<number, ProfessionalSelectData>();
    for (const professional of professionals) {
      byId.set(professional.id, professional);
    }

    return selectedProfessionalIds
      .map((id: number) => byId.get(id))
      .filter((professional): professional is ProfessionalSelectData => Boolean(professional));
  }, [professionals, selectedProfessionalIds]);

  const filteredProfessionals = useMemo(() => {
    if (!selectedProfessionalRole) return [];
    const filteredByRole = professionals.filter(
      (professional) => professional.role === selectedProfessionalRole,
    );
    const query = professionalsQuery.trim().toLowerCase();
    if (!query) return filteredByRole;
    return filteredByRole.filter((professional) =>
      professional.fullName.toLowerCase().includes(query),
    );
  }, [professionals, professionalsQuery, selectedProfessionalRole]);

  const toggleProfessional = (professionalId: number) => {
    const next = selectedProfessionalIds.includes(professionalId)
      ? selectedProfessionalIds.filter((id: number) => id !== professionalId)
      : [...selectedProfessionalIds, professionalId];

    setValue("professionalIds", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    register("professionalIds");
  }, [register]);

  useEffect(() => {
    setProfessionalsQuery("");
  }, [selectedProfessionalRole]);

  // Calculate artistNetCost
  const artistNetCost = useMemo(() => {
    if (moCost && bookingPercentage !== undefined) {
      return moCost - moCost * (bookingPercentage / 100);
    }
    return undefined;
  }, [moCost, bookingPercentage]);

  // Calculate booking percentage in euros
  const bookingPercentageAmount = useMemo(() => {
    if (moCost && bookingPercentage !== undefined) {
      return moCost * (bookingPercentage / 100);
    }
    return undefined;
  }, [moCost, bookingPercentage]);

  // Calculate artistUpfrontCost (Saldo)
  const artistUpfrontCost = useMemo(() => {
    if (moCost !== undefined) {
      const expenses = moArtistAdvancedExpenses ?? 0;
      const booking = bookingPercentageAmount ?? 0;
      const venueCost = venueManagerCost ?? 0;
      return moCost - expenses - booking - venueCost;
    }
    return undefined;
  }, [
    moCost,
    moArtistAdvancedExpenses,
    bookingPercentageAmount,
    venueManagerCost,
  ]);

  // Calculate cashBalanceCost (Saldo totale)
  const cashBalanceCost = useMemo(() => {
    const total = totalCost ?? 0;
    const transportations = transportationsCost ?? 0;
    const hotel = hotelCost ?? 0;
    const restaurant = restaurantCost ?? 0;

    // Only calculate if at least one value is present
    if (
      totalCost !== undefined ||
      transportationsCost !== undefined ||
      hotelCost !== undefined ||
      restaurantCost !== undefined
    ) {
      return total + transportations + hotel + restaurant;
    }
    return undefined;
  }, [totalCost, transportationsCost, hotelCost, restaurantCost]);

  useEffect(() => {
    setValue("artistNetCost", artistNetCost);
  }, [artistNetCost, setValue]);

  useEffect(() => {
    setValue("artistUpfrontCost", artistUpfrontCost);
  }, [artistUpfrontCost, setValue]);

  useEffect(() => {
    setValue("cashBalanceCost", cashBalanceCost);
  }, [cashBalanceCost, setValue]);

  useEffect(() => {
    if (!selectedArtistId || !selectedArtist) {
      lastArtistIdRef.current = selectedArtistId;
      return;
    }

    const isArtistChange = lastArtistIdRef.current !== selectedArtistId;
    const shouldHydrate =
      mode === "create"
        ? isArtistChange
        : lastArtistIdRef.current !== undefined && isArtistChange;

    if (!shouldHydrate) {
      lastArtistIdRef.current = selectedArtistId;
      return;
    }

    const artistFullName = `${selectedArtist.name} ${selectedArtist.surname}`.trim();
    const tourManagerFullName = [
      selectedArtist.tourManagerName,
      selectedArtist.tourManagerSurname,
    ]
      .filter(Boolean)
      .join(" ");

    setValue("artistFullName", artistFullName);
    setValue("artistStageName", selectedArtist.stageName ?? "");
    setValue("tourManagerName", tourManagerFullName);
    setValue("tourManagerEmail", selectedArtist.tourManagerEmail ?? "");

    lastArtistIdRef.current = selectedArtistId;
  }, [mode, selectedArtist, selectedArtistId, setValue]);

  const ccEmails = [
    "Tour manager",
    "Amministrazione",
    "team@agency.com",
    "finance@agency.com",
    "admin@agency.com",
  ];

  function isSectionComplete(values: Record<string, any>, fields: string[]) {
    return fields.every((f) => {
      const val = values[f];

      return val !== undefined && val !== null && val !== "" && val !== false;
    });
  }
  const isArtistComplete = isSectionComplete(formValues, [
    "artistFullName",
    "artistStageName",
    "tourManagerEmail",
  ]);

  const isVenueComplete = isSectionComplete(formValues, [
    "venueName",
    "venueCompanyName",
    "venueVatNumber",
    "venueAddress",
  ]);

  const isEventComplete = isSectionComplete(formValues, [
    "eventDate",
    "eventType",
    "eventStartTime",
    "eventEndTime",
    "transportationsCost",
    "totalCost",
    "upfrontPayment",
    "paymentDate",
  ]);

  const isDetailsComplete =
    isArtistComplete && isVenueComplete && isEventComplete;
  const [isPending, startTransition] = useTransition();

  const historyData: HistoryItem[] = Array.isArray(
    event?.contract?.latestHistory
  )
    ? event?.contract?.latestHistory.map((h: any) => {
      const createdAt = new Date(h.createdAt);
      return {
        date: createdAt.toLocaleDateString("it-IT"),
        time: createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        updatedBy: h?.changedByUserId,
        title: h.fromStatus
          ? `Stato modificato da "${h.fromStatus}" a "${h.toStatus}"`
          : "Contratti creati",
        description: h.note ?? "Nessuna descrizione disponibile.",
        type: h.toStatus === "voided" ? "archived" : "success",
      };
    })
    : [];
  const isVoided = contractStatus === "voided";

  const buildPerformanceTime = (
    startTime?: string,
    endTime?: string
  ): string => {
    if (!startTime || !endTime) return "";
    return `${startTime} - ${endTime}`;
  };
  const buildCcEmails = (values: any): string[] => {
    if (!Array.isArray(values.ccEmails)) return [];

    return (
      (values.ccEmails as (boolean | string)[])
        .map((checked, index) => (checked ? ccEmails[index] : null))
        .filter((email): email is string => Boolean(email)) ?? []
    );
  };

  const handleUpsertContract = async () => {
    const values = getValues();
    if (!values.eventId) {
      toast.error("ID evento obbligatorio.");
      return;
    }

    const payloadBase = {
      artistId: values.artistId,
      venueId: values.venueId,
      eventId: values.eventId,
      eventType: values.eventType,
      artistName: values.artistFullName,
      artistStageName: values.artistStageName,
      venueName: values.venueName,
      venueCompanyName: values.venueCompanyName,
      venueVatNumber: values.venueVatNumber,
      venueAddress: values.venueAddress,
      transfortCost: values.transportationsCost,
      totalCost: values.totalCost,
      upfrontPayment: values.upfrontPayment,
      eventDate: new Date(`${values.eventDate}T00:00:00`).toISOString(),
      perfomanceTime: buildPerformanceTime(
        values.eventStartTime,
        values.eventEndTime
      ),
      paymentDate: values.paymentDate,
      contractDate: new Date().toISOString().split("T")[0],
      ccEmails: buildCcEmails(values),
    };
    const payload = {
      ...payloadBase,
      ...(values.contractDocument?.url && values.contractDocument?.name
        ? {
          fileUrl: values.contractDocument.url,
          fileName: values.contractDocument.name,
        }
        : {}),
    };

    startTransition(async () => {
      const response =
        hasContract && typeof contractId === "number"
          ? await editContract({
            ...payload,
            contractId,
            // status: "draft",
          })
          : await createContract({
            ...payload,
            // status: "draft",
          });
      if (response.success) {
        setValue("contractId", response.data.id);
        setValue("contractStatus", "draft", {
          shouldDirty: false,
          shouldTouch: false,
        });
        // closeDialog?.();
        toast.success(
          hasContract ? "Contratto rigenerato!" : "Contratto generato!"
        );
        startTransition(async () => router.refresh());
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <>
      {mode === "create" && (
        <section className="bg-white rounded-2xl p-4 border border-zinc-100 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold">Artisti consigliati</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/artisti">Vedi tutti gli artisti</Link>
            </Button>
          </div>

          {!isRecommendationReady && (
            <div className="text-sm text-zinc-500 mt-3">
              Seleziona locale e data per vedere i consigliati.
            </div>
          )}

          {isRecommendationReady && !hasBudget && (
            <div className="text-sm text-zinc-500 mt-3">
              Inserisci un budget per applicare il filtro cachet.
            </div>
          )}

          {isRecommendationReady && hasBudget && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {isRecommendedLoading && (
                <div className="text-sm text-zinc-500">Caricamento consigliati...</div>
              )}

              {!isRecommendedLoading && recommendedArtists.length === 0 && (
                <div className="text-sm text-zinc-500">
                  Nessun artista corrisponde ai filtri per questa data.
                </div>
              )}

              {!isRecommendedLoading &&
                recommendedArtists.map((artist) => {
                  const isSelected = artist.id === selectedArtistId;
                  return (
                    <div
                      key={artist.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={artist.avatarUrl} />
                          <AvatarFallback>
                            {artist.stageName.substring(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{artist.stageName}</div>
                          <div className="text-xs text-zinc-500 truncate">{artist.bio}</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "secondary" : "outline"}
                        onClick={() => {
                          setValue("artistId", artist.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                          setValue("artistManagerProfileId", undefined);
                        }}
                        disabled={isSelected}
                      >
                        {isSelected ? "Selezionato" : "Seleziona"}
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}

          {debugEnabled && recommendedDebug && (
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
              <div className="text-xs font-semibold text-zinc-700 mb-2">
                Debug filtri consigliati
              </div>
              <div className="grid gap-1">
                <div>Artisti attivi: {recommendedDebug.totalActive}</div>
                <div>
                  Capienza match ({recommendedDebug.venueType}): {recommendedDebug.capacityMatch}
                </div>
                <div>Disponibili (dopo conflitti): {recommendedDebug.availabilityOk}</div>
                <div>Blocchi indisponibilità: {recommendedDebug.blockedAvailabilityCount}</div>
                <div>Conflitti eventi: {recommendedDebug.eventConflictCount}</div>
                <div>Candidati pre-budget: {recommendedDebug.candidatesBeforeBudget}</div>
                <div>Cachet disponibili: {recommendedDebug.cachetKnownCount}</div>
                <div>Cachet mancanti: {recommendedDebug.missingCachetCount}</div>
                <div>
                  Budget ok{" "}
                  {recommendedDebug.budget !== null ? `(${recommendedDebug.budget}€)` : ""}:{" "}
                  {recommendedDebug.budgetOk}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm font-semibold">Artista</div>
            {canCreateArtist && (
              <QuickCreateArtistDialog
                onCreated={(artist) => {
                  setExtraArtists((prev) =>
                    prev.some((item) => item.id === artist.id) ? prev : [...prev, artist]
                  );
                  setValue("artistId", artist.id, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setValue("artistManagerProfileId", undefined);
                  setValue("availability", { startDate: null, endDate: null } as any);
                }}
              />
            )}
          </div>
          <Controller
            control={control}
            name="artistId"
            render={({ field }) => (
              <ArtistSelect
                artists={artistOptions}
                value={field.value}
                setValue={field.onChange}
                hasError={!!errors.artistId}
              />
            )}
          />
          {errors.artistId && (
            <p className="text-xs text-destructive mt-2">
              {errors.artistId.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-semibold mb-2">Data</div>
          {<ArtistAvailabilitySelectWithCreate />}
          {errors.availability && (
            <p className="text-xs text-destructive mt-2">
              Seleziona una disponibilità valida.
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-semibold mb-2">Stato</div>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "min-w-40",
                    errors.status && "border-destructive text-destructive"
                  )}
                  size="sm"
                >
                  <EventStatusBadge status={field.value} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      <EventStatusBadge status={status} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-xs text-destructive mt-2">
              {errors.status.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col md:col-span-3">
          <div className="text-sm font-semibold mb-2">Tipologia evento</div>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.eventType && "border-destructive text-destructive",
                  )}
                  size="sm"
                >
                  <SelectValue placeholder="Seleziona" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.eventType && (
            <p className="text-xs text-destructive mt-2">
              {errors.eventType.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Hosted Event Checkbox */}
      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id="hostedEvent"
          checked={!!hostedEvent}
          disabled={!canEditHostedEvent}
          onCheckedChange={(checked) => setValue("hostedEvent", !!checked, { shouldDirty: true })}
        />
        <label htmlFor="hostedEvent" className="text-sm select-none">
          Evento ospitato
        </label>
        {!canEditHostedEvent && (
          <span className="ml-2 text-xs text-muted-foreground">(sola lettura)</span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm font-semibold">Locale</div>
            {canCreateVenue && (
              <QuickCreateVenueDialog
                userRole={userRole}
                onCreated={(venue) => {
                  setExtraVenues((prev) =>
                    prev.some((item) => item.id === venue.id) ? prev : [...prev, venue]
                  );
                  setValue("venueId", venue.id, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              />
            )}
          </div>
          <VenueSelect venues={venueOptions} />
          {errors.venueId && (
            <p className="text-xs text-destructive mt-2">
              {errors.venueId.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-semibold mb-2">Indirizzo del locale</div>

          <div className="h-10 flex items-center text-sm">
            {selectedVenue?.address ? (
              <span className="truncate">{selectedVenue?.address}</span>
            ) : (
              <span className="text-zinc-400">Seleziona un locale</span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="a" className="mt-4 bg-zinc-50 p-1 rounded-2xl border">
        <TabsList className="w-full justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto">
          <TabsTrigger value="a">Contatti</TabsTrigger>
          <TabsTrigger value="b">Finanze</TabsTrigger>
          <TabsTrigger value="c">Scheda di lavoro</TabsTrigger>
          {mode == "update" && <TabsTrigger value="e">Contratto</TabsTrigger>}
          <TabsTrigger value="d">Checklist</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="flex flex-col gap-4 p-2">
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-sm font-semibold">Manager artista</div>
              {canCreateArtistManager && (
                <QuickCreateArtistManagerDialog
                  onCreated={(manager) => {
                    setExtraArtistManagers((prev) =>
                      prev.some((item) => item.profileId === manager.profileId)
                        ? prev
                        : [...prev, manager]
                    );
                    setValue("artistManagerProfileId", manager.profileId, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              )}
            </div>
            <ArtistManagerSelect extraManagers={extraArtistManagers} />
            {errors.artistManagerProfileId && (
              <p className="text-xs text-destructive mt-2">
                {errors.artistManagerProfileId.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">Email Tour Manager</div>
            <Input
              type="email"
              {...register("tourManagerEmail")}
              placeholder="Inserisci l'email del tour manager"
              className={
                errors.tourManagerEmail
                  ? "border-destructive text-destructive"
                  : ""
              }
            />
            {errors.tourManagerEmail && (
              <p className="text-xs text-destructive mt-2">
                {errors.tourManagerEmail.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">Ingaggi: consulente del lavoro</div>
            <Input
              type="email"
              {...register("payrollConsultantEmail")}
              placeholder="Inserisci l'email del consulente ingaggi"
              className={
                errors.payrollConsultantEmail
                  ? "border-destructive text-destructive"
                  : ""
              }
            />
            {errors.payrollConsultantEmail && (
              <p className="text-xs text-destructive mt-2">
                {errors.payrollConsultantEmail.message as string}
              </p>
            )}
          </div>

          {canManageProfessionals && (
            <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4">
              <div className="text-sm font-semibold">Professionisti associati</div>
              <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase text-zinc-500">Categoria</span>
                  <Select
                    value={selectedProfessionalRole}
                    onValueChange={(value) => setSelectedProfessionalRole(value as ProfessionalRole)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase text-zinc-500">Cerca</span>
                  <Input
                    placeholder="Cerca professionisti"
                    value={professionalsQuery}
                    onChange={(e) => setProfessionalsQuery(e.target.value)}
                    disabled={!selectedProfessionalRole}
                  />
                </div>
              </div>

              {selectedProfessionals.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProfessionals.map((professional) => (
                    <Badge key={professional.id} variant="secondary">
                      <span className="truncate max-w-[220px]">{professional.fullName}</span>
                      <button
                        type="button"
                        aria-label={`Rimuovi ${professional.fullName}`}
                        className="ml-1 rounded-md p-0.5 hover:bg-black/5"
                        onClick={() => toggleProfessional(professional.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}

              {selectedProfessionalRole ? (
                <>
                  <div className="max-h-52 overflow-y-auto space-y-2">
                    {filteredProfessionals.length ? (
                      filteredProfessionals.map((professional) => (
                        <label
                          key={professional.id}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedProfessionalIds.includes(professional.id)}
                            onCheckedChange={() => toggleProfessional(professional.id)}
                          />
                          <span>{professional.fullName}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-xs text-zinc-400">
                        Nessun professionista trovato.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs text-zinc-500">
                  Seleziona una categoria per vedere i professionisti.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="b" className="flex flex-col gap-4 p-2">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Cachet lordo</div>
              <Input
                {...register("moCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il costo cachet lordo"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.moCost ? "border-destructive text-destructive" : ""
                }
              />
              {errors.moCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.moCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Nome promoter</div>

              <div className="h-10 flex items-center text-sm">
                {selectedVenue?.manager?.name ? (
                  <span className="truncate">
                    {selectedVenue?.manager?.name}{" "}
                    {selectedVenue?.manager?.surname}
                  </span>
                ) : (
                  <span className="text-zinc-400">Seleziona un locale</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Acconto</div>
              <Input
                {...register("depositCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il costo acconto"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.depositCost
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.depositCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.depositCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Fee promoter</div>
              <Input
                {...register("venueManagerCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il costo fee promoter"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.venueManagerCost
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.venueManagerCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.venueManagerCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">
              Numero fattura acconto
            </div>
            <Input
              {...register("depositInvoiceNumber")}
              placeholder="Inserisci il numero fattura acconto"
              className={
                errors.depositInvoiceNumber
                  ? "border-destructive text-destructive"
                  : ""
              }
            />
            {errors.depositInvoiceNumber && (
              <p className="text-xs text-destructive mt-2">
                {errors.depositInvoiceNumber.message as string}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                Percentuale booking
              </div>
              <Input
                {...register("bookingPercentage", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci la percentuale booking"
                type="number"
                min={0}
                max={100}
                step={0.01}
                className={
                  errors.bookingPercentage
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.bookingPercentage && (
                <p className="text-xs text-destructive mt-2">
                  {errors.bookingPercentage.message as string}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                Percentuale booking in €
              </div>
              <div className="h-10 flex items-center text-sm">
                {bookingPercentageAmount ? (
                  <span className="truncate">
                    {bookingPercentageAmount.toFixed(2)}{" "}
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Inserisci cachet lordo e percentuale booking
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">
              Spese anticipate per l&apos;artista
            </div>
            <Input
              {...register("moArtistAdvancedExpenses", {
                setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
              })}
              placeholder="Inserisci le spese anticipate per l'artista"
              type="number"
              min={0}
              step={0.01}
              className={
                errors.moArtistAdvancedExpenses
                  ? "border-destructive text-destructive"
                  : ""
              }
            />
            {errors.moArtistAdvancedExpenses && (
              <p className="text-xs text-destructive mt-2">
                {errors.moArtistAdvancedExpenses.message as string}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Netto artista</div>
              <div className="h-10 flex items-center text-sm">
                {artistNetCost ? (
                  <span className="truncate">
                    {artistNetCost?.toFixed(2) ?? ""}
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Inserisci cachet lordo e percentuale booking
                  </span>
                )}
              </div>
              {errors.artistNetCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.artistNetCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Saldo</div>
              <div className="h-10 flex items-center text-sm">
                {artistUpfrontCost !== undefined ? (
                  <span className="truncate">
                    {artistUpfrontCost.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Inserisci cachet lordo, spese anticipate e fee promoter
                  </span>
                )}
              </div>
              {errors.artistUpfrontCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.artistUpfrontCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                {" "}
                Data pagamento saldo{" "}
              </div>
              <Input
                type="date"
                {...register("paymentDate")}
                className="h-10"
              />
            </div>
          </div>

          <Separator className="bg-zinc-200" />

          <EventNotesInput />
        </TabsContent>

        <TabsContent value="c" className="flex flex-col gap-4 p-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Hotel</div>
              <Input
                {...register("hotel")}
                placeholder="Inserisci il nome dell'hotel"
                className={
                  errors.hotel ? "border-destructive text-destructive" : ""
                }
              />
              {errors.hotel && (
                <p className="text-xs text-destructive mt-2">
                  {errors.hotel.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Ristorante</div>
              <Input
                {...register("restaurant")}
                placeholder="Inserisci il nome del ristorante"
                className={
                  errors.restaurant ? "border-destructive text-destructive" : ""
                }
              />
              {errors.restaurant && (
                <p className="text-xs text-destructive mt-2">
                  {errors.restaurant.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Referente serata</div>
              <Input
                {...register("eveningContact")}
                placeholder="Inserisci il nome del referente serata"
                className={
                  errors.eveningContact
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.eveningContact && (
                <p className="text-xs text-destructive mt-2">
                  {errors.eveningContact.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                Coordinatore Milano Ovest
              </div>

              <Controller
                control={control}
                name="moCoordinatorId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(parseInt(v))}
                  >
                    <SelectTrigger
                      id="moCoordinatorId"
                      className={cn(
                        "w-full",
                        errors.moCoordinatorId &&
                        "border-destructive text-destructive"
                      )}
                      size="sm"
                    >
                      {moCoordinators.find((mc) => mc.id == field.value)
                        ?.name || "Seleziona coordinatore"}
                    </SelectTrigger>
                    <SelectContent>
                      {moCoordinators.map((mc) => (
                        <SelectItem key={mc.id} value={mc.id?.toString()}>
                          {mc.name} {mc.surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.moCoordinatorId && (
                <p className="text-xs text-destructive mt-2">
                  {errors.moCoordinatorId.message as string}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-zinc-200" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Saldo hotel</div>
              <Input
                {...register("hotelCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il saldo hotel"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.hotelCost ? "border-destructive text-destructive" : ""
                }
              />
              {errors.hotelCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.hotelCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Saldo ristorante</div>
              <Input
                {...register("restaurantCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il saldo ristorante"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.restaurantCost
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.restaurantCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.restaurantCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Saldo cachet</div>
              <Input
                {...register("totalCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci il saldo cachet"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.totalCost ? "border-destructive text-destructive" : ""
                }
              />
              {errors.totalCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.totalCost.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                Spese di trasporto
              </div>
              <Input
                {...register("transportationsCost", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                placeholder="Inserisci le spese di trasporto"
                type="number"
                min={0}
                step={0.01}
                className={
                  errors.transportationsCost
                    ? "border-destructive text-destructive"
                    : ""
                }
              />
              {errors.transportationsCost && (
                <p className="text-xs text-destructive mt-2">
                  {errors.transportationsCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">Saldo totale</div>
            <div className="h-10 flex items-center text-sm">
              {cashBalanceCost !== undefined ? (
                <span className="truncate">{cashBalanceCost.toFixed(2)}</span>
              ) : (
                <span className="text-zinc-400">
                  Inserisci i valori necessari
                </span>
              )}
            </div>
            {errors.cashBalanceCost && (
              <p className="text-xs text-destructive mt-2">
                {errors.cashBalanceCost.message as string}
              </p>
            )}
          </div>

          <Separator className="bg-zinc-200" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-2">
                  Inizio sound-check
                </div>
                <Input
                  {...register("soundCheckStart")}
                  type="time"
                  className={cn(
                    "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                    errors.soundCheckStart
                      ? "border-destructive text-destructive"
                      : ""
                  )}
                />
                {errors.soundCheckStart && (
                  <p className="text-xs text-destructive mt-2">
                    {errors.soundCheckStart.message as string}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-2">
                  Fine sound-check
                </div>
                <Input
                  {...register("soundCheckEnd")}
                  type="time"
                  className={cn(
                    "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                    errors.soundCheckEnd
                      ? "border-destructive text-destructive"
                      : ""
                  )}
                />
                {errors.soundCheckEnd && (
                  <p className="text-xs text-destructive mt-2">
                    {errors.soundCheckEnd.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">Rider tecnico</div>
              <PdfUploadInput />
              {errors.tecnicalRiderDocument && (
                <p className="text-xs text-destructive mt-2">
                  {errors.tecnicalRiderDocument.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold mb-2">
                Altri documenti degli eventi
              </div>
              <OtherTechnicalSheetUploadInput />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="e" className="flex flex-col gap-6 p-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              {!isDetailsComplete ? (
                /* 🔒 MISSING DATA */
                <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-medium text-amber-600 max-w-min whitespace-nowrap">
                  Info mancanti{" "}
                  <div className="w-3 h-3 flex items-center justify-center bg-amber-600 rounded-full">
                    <span className="text-[8px] text-white">?</span>
                  </div>
                </div>
              ) : (
                <ContractStatusButton
                  contractId={contractId ?? 0}
                  status={contractStatus ?? "draft"}
                />
              )}
              {historyData.length > 0 && (
                <span className="text-xs text-zinc-500">
                  Stato aggiornato il {historyData[0]?.date} da{" "}
                  {historyData[0]?.updatedBy}
                </span>
              )}
            </div>
            {contractStatus === "voided" ? (
              hasContract && contractDocument?.url ? <ViewContractButton /> : null
            ) : (
              <div className="flex items-center gap-2">
                {hasContract && (
                  <ViewContractDetail
                    event={event}
                    isDetailsComplete={isDetailsComplete}
                  />
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending || !isDetailsComplete}
                  onClick={handleUpsertContract}
                >
                  {isPending
                    ? hasContract
                      ? "Rigenero..."
                      : "Genero..."
                    : hasContract
                      ? "Rigenera"
                      : "Genera"}
                </Button>

                {isResendable && contractId ? (
                  <ResendDocuSignButton contractId={contractId} />
                ) : (
                  <DocuSignButton
                    event={event}
                    isDetailsComplete={isDetailsComplete}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">File del contratto</div>
            <UploadPdf />
            {errors.contractDocument && (
              <p className="text-xs text-destructive mt-2">
                {errors.contractDocument.message as string}
              </p>
            )}
          </div>

          {/* ACCORDION: DETAILS, CCS, HISTORY */}
          <Accordion
            type="single"
            collapsible
            className="w-full border-y border-zinc-100 rounded-none"
          >
            <AccordionItem value="details">
              <AccordionTrigger className="px-3 hover:no-underline">
                Dettagli
              </AccordionTrigger>

              <AccordionContent className="px-0">
                <Accordion type="multiple" className="border-none">
                  <AccordionItem value="artist">
                    <AccordionTrigger className="px-3 hover:no-underline bg-zinc-50">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            isSectionComplete(watch(), [
                              "artistFullName",
                              "artistStageName",
                              "tourManagerEmail",
                            ])
                              ? GREEN_TICK_ICON
                              : QUESTION_ICON
                          }
                          width={16}
                          height={16}
                          className="shrink-0"
                        />

                        <span className="text-sm font-medium">Artista</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3">
                      <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-600">
                              Nome artista{" "}
                            </label>
                            <Input
                              {...register("artistFullName")}
                              placeholder="Inserisci il nome completo"
                              readOnly={isVoided}
                              className={cn(
                                "h-10",
                                isVoided && "bg-zinc-100 text-zinc-500"
                              )}
                            />
                            {errors.artistFullName && (
                              <p className="text-xs text-destructive">
                                {errors.artistFullName.message as string}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-600">
                              Nome d'arte{" "}
                            </label>
                            <Input
                              {...register("artistStageName")}
                              placeholder="Inserisci il nome d'arte"
                              readOnly={isVoided}
                              className={cn(
                                "h-10",
                                isVoided && "bg-zinc-100 text-zinc-500"
                              )}
                            />
                            {errors.artistStageName && (
                              <p className="text-xs text-destructive">
                                {errors.artistStageName.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-600">
                              Tour manager{" "}
                            </label>
                            <Input
                              type="email"
                              {...register("tourManagerEmail", {
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message:
                                    "Formato non valido. (Es. info@eaglebooking.it)",
                                },
                              })}
                              placeholder="Inserisci l'email del tour manager"
                              className={cn(
                                errors.tourManagerEmail &&
                                "border-destructive text-destructive",
                                isVoided && "bg-zinc-100 text-zinc-500"
                              )}
                            />
                            {errors.tourManagerEmail && (
                              <p className="text-xs text-destructive">
                                {errors.tourManagerEmail.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="venue">
                    <AccordionTrigger className="px-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            isVenueComplete ? GREEN_TICK_ICON : QUESTION_ICON
                          }
                          width={isVenueComplete ? 16 : 19}
                          height={isVenueComplete ? 16 : 19}
                        />
                        <span className="text-sm font-medium">Locale</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 py-2 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Nome locale{" "}
                          </label>
                          <Input
                            {...register("venueName")}
                            placeholder="Nome locale"
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Ragione sociale locale{" "}
                          </label>
                          <Input
                            {...register("venueCompanyName")}
                            placeholder="Ragione sociale locale"
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            PIVA locale{" "}
                          </label>
                          <Input
                            {...register("venueVatNumber")}
                            placeholder="P.IVA locale"
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Indirizzo locale{" "}
                          </label>
                          <Input
                            {...register("venueAddress")}
                            placeholder="Indirizzo locale"
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="event">
                    <AccordionTrigger className="px-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            isEventComplete ? GREEN_TICK_ICON : QUESTION_ICON
                          }
                          width={isEventComplete ? 16 : 19}
                          height={isEventComplete ? 16 : 19}
                        />
                        <span className="text-sm font-medium">Evento</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 py-4 space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-600">
                          Tipologia evento{" "}
                        </label>
                        <Input
                          value={eventTypeLabel}
                          placeholder="Seleziona"
                          readOnly
                          className="h-10 bg-zinc-100 text-zinc-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Data evento{" "}
                          </label>
                          <Input
                            type="date"
                            {...register("eventDate")}
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Orario performance{" "}
                          </label>
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              {...register("eventStartTime")}
                              readOnly={isVoided}
                              className={cn(
                                "h-10",
                                isVoided && "bg-zinc-100 text-zinc-500"
                              )}
                            />
                            <Input
                              type="time"
                              {...register("eventEndTime")}
                              readOnly={isVoided}
                              className={cn(
                                "h-10",
                                isVoided && "bg-zinc-100 text-zinc-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Costi di trasporto (€){" "}
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("transportationsCost", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Totale cachet (€){" "}
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("totalCost", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Pagamento anticipo (€){" "}
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("upfrontPayment", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            readOnly={isVoided}
                            className={cn(
                              "h-10",
                              isVoided && "bg-zinc-100 text-zinc-500"
                            )}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm text-zinc-600">
                            Data pagamento saldo{" "}
                          </label>
                          <Input
                            type="date"
                            {...register("paymentDate")}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            {/* CCs */}
            <AccordionItem value="ccs">
              <AccordionTrigger className="px-3 hover:no-underline">
                CC dell'email{" "}
              </AccordionTrigger>
              <AccordionContent className="px-3 flex flex-col gap-3">
                {ccEmails.map((email, idx) => (
                  <div key={idx} className="flex flex-col">
                    <Controller
                      control={control}
                      name={`ccEmails.${idx}` as any}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm cursor-pointer text-zinc-600">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          {email}
                        </label>
                      )}
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* HISTORY */}
            <AccordionItem value="history">
              <AccordionTrigger className="px-3 hover:no-underline">
                <span className="text-sm font-medium">
                  Storico dei cambiamenti
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-4">
                {historyData.length === 0 ? (
                  <div className="text-sm text-zinc-400 text-center">
                    Nessuna cronologia disponibile
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {historyData.map((item, index) => {
                      const isLast = index === historyData.length - 1;

                      return (
                        <div
                          key={index}
                          className="grid grid-cols-[60px_1fr] gap-4 relative"
                        >
                          <div className="flex flex-col items-center text-center leading-tight">
                            <span className="text-xs font-medium text-zinc-600">
                              {item.date}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {item.time}
                            </span>
                          </div>

                          <div className="relative pl-6">
                            {!isLast && (
                              <div className="absolute left-[6px] top-4 bottom-[-2px] w-[0.5px] bg-green-600/70"></div>
                            )}
                            <div className="absolute left-0 top-1">
                              {item.type === "archived" ? (
                                <div className="w-3 h-3 border border-zinc-700 rounded-full bg-white"></div>
                              ) : (
                                <img
                                  src={GREEN_TICK_ICON}
                                  width={12}
                                  height={12}
                                  alt="Success"
                                  className="object-contain"
                                />
                              )}
                            </div>

                            <div className="text-sm font-medium text-zinc-800">
                              {item.title}
                            </div>

                            <div className="text-xs text-zinc-500 leading-relaxed mt-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="d" className="flex flex-col gap-4 p-2">
          <div className="text-sm font-semibold">Trattativa pre-evento</div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="contractSigning"
              render={({ field }) => (
                <label
                  htmlFor="contractSigning"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.contractSigning && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="contractSigning"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Firma del contratto
                </label>
              )}
            />
            {errors.contractSigning && (
              <p className="text-xs text-destructive">
                {errors.contractSigning.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="depositInvoiceIssuing"
              render={({ field }) => (
                <label
                  htmlFor="depositInvoiceIssuing"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.depositInvoiceIssuing && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="depositInvoiceIssuing"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Emissione fattura acconto
                </label>
              )}
            />
            {errors.depositInvoiceIssuing && (
              <p className="text-xs text-destructive">
                {errors.depositInvoiceIssuing.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="depositReceiptVerification"
              render={({ field }) => (
                <label
                  htmlFor="depositReceiptVerification"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.depositReceiptVerification && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="depositReceiptVerification"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Verifica ricezione acconto
                </label>
              )}
            />
            {errors.depositReceiptVerification && (
              <p className="text-xs text-destructive">
                {errors.depositReceiptVerification.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="techSheetSubmission"
              render={({ field }) => (
                <label
                  htmlFor="techSheetSubmission"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.techSheetSubmission && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="techSheetSubmission"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Recupero e invio scheda tecnica
                </label>
              )}
            />
            {errors.techSheetSubmission && (
              <p className="text-xs text-destructive">
                {errors.techSheetSubmission.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="artistEngagement"
              render={({ field }) => (
                <label
                  htmlFor="artistEngagement"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.artistEngagement && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="artistEngagement"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Incarico artista
                </label>
              )}
            />
            {errors.artistEngagement && (
              <p className="text-xs text-destructive">
                {errors.artistEngagement.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="professionalsEngagement"
              render={({ field }) => (
                <label
                  htmlFor="professionalsEngagement"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.professionalsEngagement && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="professionalsEngagement"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Incarico professionisti
                </label>
              )}
            />
            {errors.professionalsEngagement && (
              <p className="text-xs text-destructive">
                {errors.professionalsEngagement.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="accompanyingPersonsEngagement"
              render={({ field }) => (
                <label
                  htmlFor="accompanyingPersonsEngagement"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.accompanyingPersonsEngagement && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="accompanyingPersonsEngagement"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Ingaggio accompagnatori
                </label>
              )}
            />
            {errors.accompanyingPersonsEngagement && (
              <p className="text-xs text-destructive">
                {errors.accompanyingPersonsEngagement.message as string}
              </p>
            )}
          </div>

          <div className="text-sm font-semibold">Giorno dell&apos;evento</div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="performance"
              render={({ field }) => (
                <label
                  htmlFor="performance"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.performance && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="performance"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Esibizione
                </label>
              )}
            />
            {errors.performance && (
              <p className="text-xs text-destructive">
                {errors.performance.message as string}
              </p>
            )}
          </div>

          <div className="text-sm font-semibold">Post evento</div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="postDateFeedback"
              render={({ field }) => (
                <label
                  htmlFor="postDateFeedback"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.postDateFeedback && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="postDateFeedback"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Feedback post-evento
                </label>
              )}
            />
            {errors.postDateFeedback && (
              <p className="text-xs text-destructive">
                {errors.postDateFeedback.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="bordereau"
              render={({ field }) => (
                <label
                  htmlFor="bordereau"
                  className={cn(
                    "flex items-center gap-2 text-sm cursor-pointer",
                    field.value && "text-zinc-400",
                    errors.bordereau && "text-destructive"
                  )}
                >
                  <Checkbox
                    id="bordereau"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Borderò a carico del locale
                </label>
              )}
            />
            {errors.bordereau && (
              <p className="text-xs text-destructive">
                {errors.bordereau.message as string}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
