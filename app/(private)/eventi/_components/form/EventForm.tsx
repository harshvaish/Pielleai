"use client";

import { ArtistSelectData, MoCoordinator, VenueSelectData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfUploadInput from "@/app/(private)/eventi/_components/form/PdfUploadInput";
import { Checkbox } from "@/components/ui/checkbox";
import VenueSelect from "./VenueSelect";
import ArtistManagerSelect from "./ArtistManagerSelect";
import EventNotesInput from "./EventNotesInput";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ArtistSelect from "./ArtistSelect";
import { eventStatus } from "@/lib/database/schema";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import ArtistAvailabilitySelectWithCreate from "./ArtistAvailabilitySelectWithCreate";
import EventStatusBadge from "@/app/(private)/_components/Badges/EventStatusBadge";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  QUESTION_ICON,
  CIRCLE_RIGHT_ICON,
  GREEN_TICK_ICON,
} from "@/lib/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { createContract } from "@/lib/server-actions/contracts/create-contract";
import { editContract } from "@/lib/server-actions/contracts/update-contract";
import UploadPdf from "../create/UploadPdf";
import DocuSignButton from "../create/DocuSignButton";
import ContractStatusButton from "../update/ContractStatusButton";

type EventForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  event?: any; // Replace 'any' with the correct type or import the 'DomainEvent' type if available
  mode: "create" | "update";
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
  mode,
  event,
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

  const selectedVenueId = watch("venueId");
  const selectedVenue = venues.find((venue) => venue.id == selectedVenueId);
  const contractId = watch("contractId");
  const hasContract = Boolean(contractId);
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

  // Update the form value when calculation changes
  useEffect(() => {
    setValue("artistNetCost", artistNetCost);
  }, [artistNetCost, setValue]);

  useEffect(() => {
    setValue("artistUpfrontCost", artistUpfrontCost);
  }, [artistUpfrontCost, setValue]);

  useEffect(() => {
    setValue("cashBalanceCost", cashBalanceCost);
  }, [cashBalanceCost, setValue]);

  const ccEmails = [
    "Tour Manager",
    "Admin",
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
            ? `Status changed from "${h.fromStatus}" to "${h.toStatus}"`
            : "Contract created",
          description: h.note ?? "No description available",
          type: h.toStatus === "voided" ? "archived" : "success",
        };
      })
    : [];
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
      toast.error("Event ID is required.");
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
    startTransition(async () => {
      const response = hasContract && typeof contractId === "number"
      ? await editContract({
          ...payloadBase,
          contractId,
          status: "draft",
        })
      : await createContract({
          ...payloadBase,
          status: "draft",
        });
          if (response.success) {
        setValue("contractId", response.data.id);
        setValue("contractStatus", "draft", {
          shouldDirty: false,
          shouldTouch: false,
        });

        toast.success(
          hasContract ? "Contract regenerated!" : "Contract created!"
        );
        //closeDialog?.();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <div className="text-sm font-semibold mb-2">Artista</div>
          <Controller
            control={control}
            name="artistId"
            render={({ field }) => (
              <ArtistSelect
                artists={artists}
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
                  {eventStatus.enumValues.map((status) => (
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="text-sm font-semibold mb-2">Location</div>
          <VenueSelect venues={venues} />
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

      <Tabs defaultValue="a" className="bg-zinc-50 p-1 rounded-2xl border">
        <TabsList className="w-full justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto">
          <TabsTrigger value="a">Contatti</TabsTrigger>
          <TabsTrigger value="b">Financial</TabsTrigger>
          <TabsTrigger value="c">Scheda tecnica</TabsTrigger>
          <TabsTrigger value="d">Attività</TabsTrigger>
          {mode == "update" && <TabsTrigger value="e">Contract</TabsTrigger>}
        </TabsList>        
        <TabsContent value="e" className="flex flex-col gap-6 p-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              {!isDetailsComplete ? (
                /* 🔒 MISSING DATA */
                <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-medium text-amber-600">
                  Missing data
                  <img
                    src={QUESTION_ICON}
                    alt="missing"
                    width={14}
                    height={14}
                    className="opacity-80"
                  />
                </div>
              ) : (
                <ContractStatusButton
                  contractId={contractId}
                  status={contractStatus}
                />
              )}

              <span className="text-xs text-zinc-500">
                Status changed on {historyData[0]?.date} by{" "}
                {historyData[0]?.updatedBy}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending || !isDetailsComplete}
                onClick={handleUpsertContract}
              >
                {isPending
                  ? hasContract
                    ? "Regenerating..."
                    : "Generating..."
                  : hasContract
                    ? "Regenerate"
                    : "Generate"}
              </Button>

              <DocuSignButton
                event={event}
                isDetailsComplete={isDetailsComplete}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Contract file</div>
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
                Details
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
                            ])
                              ? GREEN_TICK_ICON
                              : QUESTION_ICON
                          }
                          width={16}
                          height={16}
                          className="shrink-0"
                        />

                        <span className="text-sm font-medium">Artist</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3">
                      <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-600">
                              Artist full name
                            </label>
                            <Input
                              {...register("artistFullName")}
                              placeholder="Enter full name"
                              className="h-10"
                            />
                            {errors.artistFullName && (
                              <p className="text-xs text-destructive">
                                {errors.artistFullName.message as string}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-600">
                              Artist stage name
                            </label>
                            <Input
                              {...register("artistStageName")}
                              placeholder="Enter stage name"
                              className="h-10"
                            />
                            {errors.artistStageName && (
                              <p className="text-xs text-destructive">
                                {errors.artistStageName.message as string}
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
                            isSectionComplete(watch(), [
                              "venueName",
                              "venueCompanyName",
                              "venueVatNumber",
                              "venueAddress",
                            ])
                              ? GREEN_TICK_ICON
                              : QUESTION_ICON
                          }
                          width={16}
                          height={16}
                        />

                        <span className="text-sm font-medium">Locale</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 py-2 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Venue name
                          </label>
                          <Input
                            {...register("venueName")}
                            placeholder="Venue name"
                            className="h-10"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Venue Company name
                          </label>
                          <Input
                            {...register("venueCompanyName")}
                            placeholder="Venue Company name"
                            className="h-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Venue VAT number
                          </label>
                          <Input
                            {...register("venueVatNumber")}
                            placeholder="Venue VAT number"
                            className="h-10"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Venue address
                          </label>
                          <Input
                            {...register("venueAddress")}
                            placeholder="Venue address"
                            className="h-10"
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
                            isSectionComplete(watch(), [
                              "eventDate",
                              "eventType",
                              "eventStartTime",
                              "eventEndTime",
                              "transportationsCost",
                              "totalCost",
                              "upfrontPayment",
                              "paymentDate",
                            ])
                              ? GREEN_TICK_ICON
                              : QUESTION_ICON
                          }
                          width={16}
                          height={16}
                        />
                        <span className="text-sm font-medium">Event</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 py-4 space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-600">
                          Event type
                        </label>
                        <Controller
                          control={control}
                          name="eventType"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-10 w-full">
                                {field.value ?? "Select"}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dj-set">DJ Set</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="festival">
                                  Festival
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Event date
                          </label>
                          <Input
                            type="date"
                            {...register("eventDate")}
                            className="h-10"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Performance time
                          </label>
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              {...register("eventStartTime")}
                              className="h-10"
                            />
                            <Input
                              type="time"
                              {...register("eventEndTime")}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Transport costs EUR
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("transportationsCost", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            className="h-10"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Total cachet EUR
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("totalCost", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Upfront payment EUR
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register("upfrontPayment", {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseFloat(v),
                            })}
                            className="h-10"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-600">
                            Payment date
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
                CCs of the email
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
                <span className="text-sm font-medium">History of changes</span>
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
      </Tabs>
    </>
  );
}
