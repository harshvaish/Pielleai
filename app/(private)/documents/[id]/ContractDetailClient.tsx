"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { GREEN_TICK_ICON, QUESTION_ICON } from "@/lib/constants";

type Props = {
  payload: any;
};

/* ---------------- COMPONENT ---------------- */

export default function ContractDetailClient({ payload }: Props) {
  /* ---------------- FORM ---------------- */
  const form = useForm({
    defaultValues: {
      artistFullName: `${payload.artist.name} ${payload.artist.surname}`,
      artistStageName: payload.artist.stageName,

      venueName: payload.venue.name,
      venueCompanyName: payload.venue.company,
      venueVatNumber: payload.venue.vatCode,
      venueAddress: payload.venue.address,

      eventDate: format(payload.availability.startDate, "yyyy-MM-dd"),
      eventStartTime: format(payload.availability.startDate, "HH:mm", {
        locale: it,
      }),
      eventEndTime: format(payload.availability.endDate, "HH:mm", {
        locale: it,
      }),
      eventType: payload?.event.eventType,

      transportationsCost: payload.event.transportCost ?? "",
      totalCost: payload.event.totalFee ?? "",
      upfrontPayment: payload.event.depositCost ?? "",
      tourManager: payload.artist?.tourManagerName
        ? `${payload.artist.tourManagerName} ${payload.artist.tourManagerSurname ?? ""}`
        : "",

      consultantEmail: payload.event?.payrollConsultantEmail ?? "",
      adminEmail: payload.artist?.tourManagerEmail ?? "",
    },
    shouldUnregister: true,
  });
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  /* ---------------- HELPERS ---------------- */

  function isSectionComplete(values: Record<string, any>, fields: string[]) {
    return fields.every((f) => {
      const val = values[f];
      return val !== undefined && val !== null && val !== "" && val !== false;
    });
  }
  /* ---------------- RENDER ---------------- */

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
                    <label className="text-sm text-zinc-600">Nome d'arte</label>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-600">
                      Tour Manager
                    </label>
                    <Input
                      {...register("tourManager")}
                      placeholder="Enter full name"
                      className="h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-600">
                      Consulente paghe e contributi
                    </label>
                    <Input
                      {...register("consultantEmail")}
                      placeholder="Email"
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm text-zinc-600">
                    Amministrazione
                  </label>
                  <Input
                    {...register("adminEmail")}
                    placeholder="Email"
                    className="h-10"
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
                    className="h-10"
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
                    className="h-10"
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
                    className="h-10"
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
                    className="h-10"
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
                      "eventStartTime",
                      "eventEndTime",
                      "transportationsCost",
                      "totalCost",
                      "upfrontPayment",
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-10 w-full">
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
                    className="h-10"
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
                    className="h-10"
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
                    className="h-10"
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
                    className="h-10"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </div>
  );
}
