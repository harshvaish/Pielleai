"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { GREEN_TICK_ICON, QUESTION_ICON } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  payload: any;
};

export default function ContractDetailClient({ payload: _payload }: Props) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  /* ---------------- HELPERS ---------------- */
  const isReadOnly = true;

  function isSectionComplete(values: Record<string, any>, fields: string[]) {
    return fields.every((f) => {
      const val = values[f];
      return val !== undefined && val !== null && val !== "" && val !== false;
    });
  }
  return (
    <div>
      <CardContent className="space-y-6">
        <Accordion type="multiple" className="border-none">
          {/* ---------------- ARTIST SECTION ---------------- */}
          <AccordionItem value="artist">
            <AccordionTrigger className="px-3 hover:no-underline bg-zinc-50">
              <div className="flex items-center gap-2">
                <img
                  src={
                    isSectionComplete(watch(), [
                      "artistFullName",
                      "artistStageName",
                      "tourManager",
                      "tourManagerEmail",
                      // "consultantEmail",
                      "adminEmail",
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
              {/* Panel background box */}
              <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Artist Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-600">
                      Nome artista
                    </label>
                    <Input
                      {...register("artistFullName")}
                      placeholder="Enter full name"
                      className={cn(
                        "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100",
                        errors.artistFullName && "border-destructive text-destructive"
                      )}
                      disabled={isReadOnly}
                    />
                    {errors.artistFullName && (
                      <p className="text-xs text-destructive">
                        {errors.artistFullName.message as string}
                      </p>
                    )}
                  </div>

                  {/* Artist Stage Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-600">Nome d'arte</label>
                    <Input
                      {...register("artistStageName")}
                      placeholder="Enter stage name"
                      className={cn(
                        "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100",
                        errors.artistStageName &&
                          "border-destructive text-destructive"
                      )}
                      disabled={isReadOnly}
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
                      Tour Manager
                    </label>
                    <Input
                      {...register("tourManager")}
                      placeholder="Inserisci il nome del tour manager"
                      disabled={isReadOnly}
                      className={cn(
                        "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100",
                        errors.tourManager &&
                          "border-destructive text-destructive"
                      )}
                    />
                    {errors.tourManager && (
                      <p className="text-xs text-destructive">
                        {errors.tourManager.message as string}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="text-sm font-semibold mb-2">
                      Tour manager
                    </div>
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
                      disabled={isReadOnly}
                      className={cn(
                        errors.tourManagerEmail &&
                          "border-destructive text-destructive",
                        "bg-zinc-100 text-zinc-500 disabled:opacity-100"
                      )}
                    />
                    {errors.tourManagerEmail && (
                      <p className="text-xs text-destructive mt-2">
                        {errors.tourManagerEmail.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Consulente paghe e contributi
                  </label>
                  <Input
                    {...register("consultantEmail")}
                    placeholder="Email"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm text-zinc-600">
                    Amministrazione
                  </label>
                  <Input
                    {...register("adminEmail")}
                    placeholder="Email"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
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
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Venue name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">Nome locale</label>
                  <Input
                    {...register("venueName")}
                    placeholder="Venue name"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>

                {/* Venue Company name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Ragione sociale locale
                  </label>
                  <Input
                    {...register("venueCompanyName")}
                    placeholder="Venue Company name"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Venue VAT number */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">PIVA locale</label>
                  <Input
                    {...register("venueVatNumber")}
                    placeholder="Venue VAT number"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>

                {/* Venue address */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Indirizzo locale
                  </label>
                  <Input
                    {...register("venueAddress")}
                    placeholder="Venue address"
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ---------------- EVENT SECTION ---------------- */}
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
                <span className="text-sm font-medium">Evento</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-3 py-4 space-y-4">
              {/* EVENT TYPE */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600">
                  Tipologia evento
                </label>
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger
                        className={cn(
                          "h-10 w-full bg-zinc-100 text-zinc-500"
                        )}
                      >
                        {field.value ?? "Select"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dj-set">DJ Set</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">Data evento</label>
                  <Input
                    type="date"
                    {...register("eventDate")}
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
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
                      disabled={isReadOnly}
                      className={cn(
                        "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                      )}
                    />
                    <Input
                      type="time"
                      {...register("eventEndTime")}
                      disabled={isReadOnly}
                      className={cn(
                        "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* TRANSPORT COSTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Costi di trasporto (€){" "}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    {...register("transportationsCost", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Totale cachet (€)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    {...register("totalCost", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>
              </div>

              {/* UPFRONT PAYMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Pagamento anticipo (€){" "}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    {...register("upfrontPayment", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-600">
                    Data pagamento saldo{" "}
                  </label>
                  <Input
                    type="date"
                    {...register("paymentDate")}
                    disabled={isReadOnly}
                    className={cn(
                      "h-10 bg-zinc-100 text-zinc-500 disabled:opacity-100",
                      errors.paymentDate &&
                        "border-destructive text-destructive"
                    )}
                  />
                  {errors.paymentDate && (
                    <p className="text-xs text-destructive">
                      {errors.paymentDate.message as string}
                    </p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </div>
  );
}
