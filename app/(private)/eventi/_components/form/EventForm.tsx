"use client";

import { ArtistSelectData, MoCoordinator, VenueSelectData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfUploadInput from "@/app/(private)/eventi/_components/form/PdfUploadInput";
import { Checkbox } from "@/components/ui/checkbox";
import VenueSelect from "./VenueSelect";
import ArtistManagerSelect from "./ArtistManagerSelect";
import EventNotesInput from "./EventNotesInput";
import { Controller, useFormContext } from "react-hook-form";
import ArtistSelect from "./ArtistSelect";
import { eventStatus } from "@/lib/database/schema";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import ArtistAvailabilitySelectWithCreate from "./ArtistAvailabilitySelectWithCreate";
import EventStatusBadge from "@/app/(private)/_components/Badges/EventStatusBadge";
import { useEffect, useMemo, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  QUESTION_ICON,
  UPLOAD_ICON,
  FILE_ICON,
  DOWNLOAD_ICON,
  DELETE_ICON,
  CIRCLE_RIGHT_ICON,
  GREEN_TICK_ICON,
} from "@/lib/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import createContract from "@/lib/data/contracts/create-contracts";
import { useRouter } from 'next/navigation';

type EventForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  event?: Event;
  mode: "create" | "update";
};

export default function EventForm({
  artists,
  venues,
  moCoordinators,
  mode,
}: EventForm) {
  const {
    watch,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventFormSchema>();
  const contractStatus = watch("contractStatus");
  const isContractStatusMissing = !contractStatus;

  const selectedVenueId = watch("venueId");
  const selectedVenue = venues.find((venue) => venue.id == selectedVenueId);
  const router = useRouter();
  // Watch the values needed for calculation
  const moCost = watch("moCost");
  const bookingPercentage = watch("bookingPercentage");
  const moArtistAdvancedExpenses = watch("moArtistAdvancedExpenses");
  const venueManagerCost = watch("venueManagerCost");
  const totalCost = watch("totalCost");
  const transportationsCost = watch("transportationsCost");
  const hotelCost = watch("hotelCost");
  const restaurantCost = watch("restaurantCost");
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

  const contractStatusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "ready", label: "Ready" },
    { value: "sent", label: "Sent to DocuSign" },
  ];

  // JSON DATA (local only)
  const contractData = {
    event: {
      artist: { id: 1, name: "Ann Carrot" },
      venue: { id: 12, name: "Milano Social Club" },
      artistManager: { id: 5, name: "Luca Bianchi" },
      ccEmails: [
        "Tour Manager",
        "Admin",
        "team@agency.com",
        "finance@agency.com",
        "admin@agency.com",
      ],
      history: [
        {
          action: "Contract uploaded",
          user: "Ann Carrot",
          date: "2025-11-12 14:32",
        },
        {
          action: "Status changed to Ready",
          user: "Luca Bianchi",
          date: "2025-11-13 10:15",
        },
        {
          action: "Sent to DocuSign",
          user: "Marco Rossi",
          date: "2025-11-14 09:48",
        },
      ],
    },

    signedContractDocument: {
      name: "Contract_Artist_AnnCarrot.pdf",
      url: "https://dummyfiles.com/contracts/contract_123.pdf",
    },
  };

  function isSectionComplete(values: Record<string, any>, fields: string[]) {
    return fields.every((f) => {
      const val = values[f];

      // Consider empty, null, undefined, false as incomplete
      return val !== undefined && val !== null && val !== "" && val !== false;
    });
  }
  const [isPending, startTransition] = useTransition();

  const historyData = [
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: "Contract archived",
      description: "Contract was signed and archived",
      type: "archived", // special styling (black filled circle)
    },
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: `Status changed to "Signed"`,
      description: "Auto status change",
      type: "success",
    },
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: "Contract signed",
      description: "Contract was signed",
      type: "success",
    },
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: "Changes added to the contract",
      description: `User bob.johnson@gmail.com added changes: signed contract`,
      type: "success",
    },
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: `Status changed to "To Sign"`,
      description: "Contracted was sent to DocuSign",
      type: "success",
    },
    {
      date: "13/11/25",
      time: "9:31 AM",
      title: "Contract Autogenerated",
      description: "Contract autogenerated",
      type: "success",
    },
  ];  

  const handleGenerateContract = async () => {

    startTransition(async () => {
      const values = getValues();
      const response = await createContract(values);
      // closeDialog();

      if (response.success) {
        toast.success("Contract created!");
        startTransition(async () => router.refresh());
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
         {mode == "update" &&  <TabsTrigger value="e">Contract</TabsTrigger> }
        </TabsList>

        <TabsContent value="a" className="flex flex-col gap-4 p-2">
          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">Manager artista</div>
            <ArtistManagerSelect />
            {errors.artistManagerProfileId && (
              <p className="text-xs text-destructive mt-2">
                {errors.artistManagerProfileId.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-2">Tour manager</div>
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
            <div className="text-sm font-semibold mb-2">Ingaggi</div>
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
        </TabsContent>

        <TabsContent value="b" className="flex flex-col gap-4 p-2">
          <div className="grid sm:grid-cols-2 gap-4">
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
          </div>
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
                  Performance
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
        <TabsContent value="e" className="flex flex-col gap-6 p-2">
          {/* STATUS BAR */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <Controller
                control={control}
                name="contractStatus"
                render={({ field }) => {
                  const selected = contractStatusOptions.find(
                    (s) => s.value === field.value
                  );
                  const isMissing = !selected;

                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="contractStatus"
                        className="h-8 w-40 rounded-xl flex items-center gap-2 px-3 text-xs font-medium"
                        size="sm"
                      >
                        {/* Label (Missing data or selected label) */}
                        <span
                          className={cn(
                            "truncate",
                            !selected ? "text-[#D97706]" : ""
                          )}
                        >
                          {selected?.label ?? "Missing data"}
                        </span>

                        {/* Question icon (always inside, on right) */}
                        <img
                          src={isMissing ? QUESTION_ICON : CIRCLE_RIGHT_ICON}
                          alt="info"
                          width={14}
                          height={14}
                          className="opacity-80 ml-auto"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {contractStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              <span className="text-xs text-zinc-500">
                Status changed on 13/11/25 by Ann Carrot
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">
              <Button
               type="button"
               size="sm"
               disabled={isContractStatusMissing}
               variant="outline"
               onClick={handleGenerateContract}
              >
                Generate
              </Button>

              <Button type="button" size="sm" className="max-w-max">
                {" "}
                Send to DocuSign
              </Button>
            </div>
          </div>

          {/* CONTRACT FILE BLOCK */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Contract file</div>

            <Controller
              control={control}
              name="signedContractDocument"
              render={({ field }) => (
                <>
                  {/* -------- CASE: FILE EXISTS -------- */}
                  {field.value?.name ? (
                    <div className="flex items-center gap-3 w-fit">
                      {/* FILE CHIP */}
                      <div
                        className="
                flex items-center gap-2
                bg-white 
                border border-zinc-300 
                rounded-full 
                px-4 py-1.5 
                shadow-sm
                w-fit
              "
                      >
                        {/* File icon from assets */}
                        <img src={FILE_ICON} alt="file" className="w-4 h-4" />

                        {/* File Name */}
                        <span className="text-sm text-zinc-800 font-medium">
                          {field.value.name}
                        </span>
                      </div>

                      {/* DOWNLOAD */}
                      <button
                        type="button"
                        onClick={() => window.open(field.value.url, "_blank")}
                        className="text-zinc-600 hover:text-zinc-900"
                      >
                        <img
                          src={DOWNLOAD_ICON}
                          alt="download"
                          className="w-4 h-4 opacity-80 hover:opacity-100"
                        />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => field.onChange(undefined)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <img
                          src={DELETE_ICON}
                          alt="delete"
                          className="w-4 h-4 opacity-80 hover:opacity-100"
                        />
                      </button>
                    </div>
                  ) : (
                    /* -------- CASE: NO FILE YET -------- */
                    <button
                      type="button"
                      className="
              flex items-center gap-2 
              bg-white 
              border border-zinc-300 
              rounded-xl 
              px-4 py-2 
              text-sm text-zinc-700 
              shadow-sm
              w-fit
            "
                      onClick={() =>
                        document.getElementById("contract-upload")?.click()
                      }
                    >
                      <img src={UPLOAD_ICON} alt="upload" className="w-4 h-4" />
                      <span>Upload</span>

                      {/* Hidden input */}
                      <input
                        id="contract-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          field.onChange({
                            name: file.name,
                            url: URL.createObjectURL(file),
                          });
                        }}
                      />
                    </button>
                  )}

                  {/* ERROR MESSAGE */}
                  {errors.signedContractDocument && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.signedContractDocument.message as string}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* ACCORDION: DETAILS, CCS, HISTORY */}
          <Accordion
            type="single"
            collapsible
            className="w-full border-y border-zinc-100 rounded-none"
          >
            {/* DETAILS */}
            <AccordionItem value="details">
              <AccordionTrigger className="px-3 hover:no-underline">
                Details
              </AccordionTrigger>

              <AccordionContent className="px-0">
                <Accordion type="multiple" className="border-none">
                  {/* ---------------- ARTIST SECTION ---------------- */}
                  <AccordionItem value="artist">
                    <AccordionTrigger className="px-3 hover:no-underline bg-zinc-50">
                      {/* Icon + Label group */}
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
                      {/* Panel background box */}
                      <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Artist Full Name */}
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

                          {/* Artist Stage Name */}
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

                  {/* ---------------- VENUE SECTION ---------------- */}
                  <AccordionItem value="venue">
                    <AccordionTrigger className="px-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            isSectionComplete(watch(), [
                              "eventName",
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

                        <span className="text-sm font-medium">Venue</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 py-2 space-y-3">
                      {/* First Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Venue name */}
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

                        {/* Venue Company name */}
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

                      {/* Second Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Venue VAT number */}
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

                        {/* Venue address */}
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

                                    {/* ---------------- EVENT SECTION ---------------- */}
                                  {/* ---------------- EVENT SECTION ---------------- */}
<AccordionItem value="event">
  <AccordionTrigger className="px-3 hover:no-underline">
    <div className="flex items-center gap-2">
      <img
        src={
          isSectionComplete(watch(), [
            "eventType",
            "availability",
            "moCost",
            "transportationsCost",
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
    {/* EVENT TYPE */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-600">Event type</label>
      <Controller
        control={control}
        name="eventType"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-10 w-full">
              {field.value ?? "Select"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concert">Live show</SelectItem>
              <SelectItem value="dj-set">DJ Set</SelectItem>
              <SelectItem value="private-event">Private Event</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>

    {/* DATE + TIME */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Event date</label>
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
            {...register("soundCheckStart")}
            className="h-10"
          />
          <Input
            type="time"
            {...register("soundCheckEnd")}
            className="h-10"
          />
        </div>
      </div>
    </div>

    {/* TRANSPORT COSTS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">
          Transport costs EUR
        </label>
        <Input
          type="number"
          min={0}
          {...register("transportationsCost", {
            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
          })}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">
          Transport costs text
        </label>
        <Input
          {...register("transportCostText")}
          placeholder="three-hundred euros"
          className="h-10"
        />
      </div>
    </div>

    {/* TOTAL CACHET */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">
          Total cachet EUR
        </label>
        <Input
          type="number"
          min={0}
          {...register("moCost", {
            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
          })}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">
          Total cachet text
        </label>
        <Input
          {...register("moCostText")}
          placeholder="three-hundred euros"
          className="h-10"
        />
      </div>
    </div>

    {/* UPFRONT PAYMENT */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">
          Upfront payment EUR
        </label>
        <Input
          type="number"
          min={0}
          {...register("depositCost", {
            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
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
          {...register("depositPaymentDate")}
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
                {contractData.event.ccEmails.map((email, idx) => (
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
              <AccordionTrigger className="px-3 bg-[#F8F8F8] border-y border-zinc-200 hover:no-underline h-12 flex items-center">
                <span className="text-sm font-medium">History of changes</span>
              </AccordionTrigger>

              <AccordionContent className="px-3 py-4">
                <div className="flex flex-col gap-4">
                  {historyData.map((item, index) => {
                    const isLast = index === historyData.length - 1;

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-[60px_1fr] gap-4 relative"
                      >
                        {/* LEFT: DATE + TIME */}
                        <div className="flex flex-col items-end text-right leading-tight">
                          <span className="text-xs font-medium text-zinc-600">
                            {item.date}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {item.time}
                          </span>
                        </div>

                        {/* RIGHT SIDE BLOCK */}
                        <div className="relative pl-6">
                          {/* Timeline vertical line */}
                          {!isLast && (
                            <div className="absolute left-[6px] top-4 bottom-[-2px] w-[0.5px] bg-green-600/70"></div>
                          )}

                          {/* Status dot */}
                          <div className="absolute left-0 top-1">
                            {item.type === "archived" ? (
                              // Black outlined circle (same as screenshot)
                              <div className="w-3 h-3 border border-zinc-700 rounded-full bg-white"></div>
                            ) : (
                              // Green Tick Icon
                              <img
                                src={GREEN_TICK_ICON}
                                width={12}
                                height={12}
                                alt="Success"
                                className="object-contain"
                              />
                            )}
                          </div>

                          {/* Title */}
                          <div className="text-sm font-medium text-zinc-800">
                            {item.title}
                          </div>

                          {/* Description */}
                          <div className="text-xs text-zinc-500 leading-relaxed mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

    </>
  );
}
