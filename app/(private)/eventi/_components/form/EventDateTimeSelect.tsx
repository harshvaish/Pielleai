"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EventFormSchema, EventRequestFormSchema } from "@/lib/validation/event-form-schema";
import { ArtistAvailability } from "@/lib/types";
import { checkAvailabilities, cn, fetcher } from "@/lib/utils";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, isBefore } from "date-fns";
import { it } from "date-fns/locale";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";
import { TIME_ZONE } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod/v4";
import { timeValidation } from "@/lib/validation/_general";
import { type DateRange } from "react-day-picker";

type FormValues = EventFormSchema | EventRequestFormSchema;

type EventDateTimeSelectProps = {
  highlightMissing?: boolean;
};

export default function EventDateTimeSelect({
  highlightMissing = false,
}: EventDateTimeSelectProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const selectedArtistId = watch("artistId");
  const selectedAvailability = watch("availability");

  const label = useMemo(() => {
    if (!selectedAvailability?.startDate || !selectedAvailability?.endDate) {
      return "Seleziona data";
    }
    try {
      const start = formatInTimeZone(
        selectedAvailability.startDate,
        TIME_ZONE,
        "dd/MM/yyyy (HH:mm"
      );
      const end = formatInTimeZone(selectedAvailability.endDate, TIME_ZONE, "dd/MM/yyyy, HH:mm)");
      return `${start} - ${end}`;
    } catch {
      return "Seleziona data";
    }
  }, [selectedAvailability]);

  useEffect(() => {
    if (!selectedAvailability?.startDate || !selectedAvailability?.endDate) {
      return;
    }
    const startLocal = toZonedTime(selectedAvailability.startDate, TIME_ZONE);
    const endLocal = toZonedTime(selectedAvailability.endDate, TIME_ZONE);
    setSelectedDate(startLocal);
    setEndDate(endLocal);
    setDateRange({ from: startLocal, to: endLocal });
    setMonth(startLocal);
    setStartTime(format(startLocal, "HH:mm"));
    setEndTime(format(endLocal, "HH:mm"));
  }, [selectedAvailability]);

  const startDateUTC = useMemo(() => {
    if (!selectedDate) return null;
    const startLocal = startOfDay(selectedDate);
    return fromZonedTime(startLocal, TIME_ZONE).toISOString();
  }, [selectedDate]);

  const availabilityFetchUrl = useMemo(() => {
    if (!selectedArtistId || !startDateUTC) return null;
    return `/api/artist-availabilities/date?i=${selectedArtistId}&sd=${startDateUTC}`;
  }, [selectedArtistId, startDateUTC]);

  const { data: availabilityResponse, isLoading: isDayLoading } = useSWR(
    availabilityFetchUrl,
    fetcher
  );

  const monthRange = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return {
      start: fromZonedTime(startOfDay(monthStart), TIME_ZONE).toISOString(),
      end: fromZonedTime(endOfDay(monthEnd), TIME_ZONE).toISOString(),
    };
  }, [month]);

  const rangeFetchUrl = useMemo(() => {
    if (!selectedArtistId) return null;
    return `/api/artist-availabilities/range?i=${selectedArtistId}&sd=${monthRange.start}&ed=${monthRange.end}`;
  }, [selectedArtistId, monthRange]);

  const { data: rangeResponse, isLoading: isRangeLoading } = useSWR(
    rangeFetchUrl,
    fetcher
  );

  const disabledDayKeys = useMemo(() => {
    if (!rangeResponse?.success) return new Set<string>();
    const keys = new Set<string>();
    (rangeResponse.data as ArtistAvailability[]).forEach((block) => {
      const startLocal = toZonedTime(block.startDate, TIME_ZONE);
      const endLocal = toZonedTime(block.endDate, TIME_ZONE);
      const isFullDay =
        startLocal.getTime() === startOfDay(startLocal).getTime() &&
        endLocal.getTime() === startOfDay(endLocal).getTime() &&
        endLocal.getTime() > startLocal.getTime();

      if (!isFullDay) return;

      let cursor = startOfDay(startLocal);
      while (cursor < endLocal) {
        keys.add(format(cursor, "yyyy-MM-dd"));
        cursor = addDays(cursor, 1);
      }
    });
    return keys;
  }, [rangeResponse]);

  const blockedRanges = useMemo(() => {
    if (!availabilityResponse?.success) return [];
    return (availabilityResponse.data as ArtistAvailability[]).map((item) => ({
      ...item,
      startDate: toZonedTime(item.startDate, TIME_ZONE),
      endDate: toZonedTime(item.endDate, TIME_ZONE),
    }));
  }, [availabilityResponse]);

  const onConfirm = () => {
    if (!selectedDate || !endDate) {
      toast.error("Seleziona una data di inizio e fine.");
      return;
    }

    if (disabledDayKeys.has(format(selectedDate, "yyyy-MM-dd"))) {
      toast.error("La data selezionata non è disponibile.");
      return;
    }

    const schema = z.object({
      startTime: timeValidation,
      endTime: timeValidation,
    });

    const validation = schema.safeParse({ startTime, endTime });
    if (!validation.success) {
      toast.error("Orari non validi.");
      return;
    }

    const startLocal = new Date(selectedDate);
    const endLocal = new Date(endDate);

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    startLocal.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    endLocal.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    if (isBefore(endLocal, startLocal) || endLocal.getTime() === startLocal.getTime()) {
      toast.error("L'orario di fine deve essere successivo all'orario di inizio.");
      return;
    }

    const startUTC = fromZonedTime(startLocal, TIME_ZONE);
    const endUTC = fromZonedTime(endLocal, TIME_ZONE);

    const check = checkAvailabilities([{ startDate: startUTC, endDate: endUTC }]);
    if (!check.success) {
      toast.error(check.message);
      return;
    }

    setValue(
      "availability",
      {
        id: selectedAvailability?.id,
        startDate: startUTC,
        endDate: endUTC,
      },
      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
    );
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={cn(
          "h-10 w-full justify-start text-sm font-normal overflow-hidden",
          (!selectedAvailability?.startDate || !selectedAvailability?.endDate) &&
            (highlightMissing ? "text-destructive" : "text-zinc-400"),
          (errors.availability || highlightMissing) &&
            "border-destructive text-destructive"
        )}
        onClick={() => setOpen(true)}
        disabled={!selectedArtistId}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span className="truncate whitespace-nowrap">{label}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent className="h-dvh md:max-h-[440px] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Seleziona data e ora dell&apos;evento</DialogTitle>
            <DialogDescription className="hidden">
              Seleziona l&apos;intervallo di tempo dell&apos;evento.
            </DialogDescription>
          </DialogHeader>

          <div className="h-full grid grid-rows-[max-content_1fr] md:grid-rows-none md:grid-cols-2 justify-items-center gap-4 py-4 border-t overflow-hidden">
            <Calendar
              locale={it}
              mode="range"
              className="h-max p-0 self-center"
              selected={dateRange}
              month={month}
              onMonthChange={setMonth}
              onSelect={(range) => {
                setDateRange(range);
                setSelectedDate(range?.from);
                setEndDate(range?.to ?? range?.from);
                if (range?.from) {
                  setMonth(range.from);
                }
              }}
              disabled={(date) =>
                isBefore(date, startOfDay(new Date())) ||
                disabledDayKeys.has(format(date, "yyyy-MM-dd"))
              }
            />

            {selectedDate ? (
              <div className="w-full flex flex-col overflow-y-auto">
                <div className="font-semibold text-zinc-700 mb-2">Intervallo</div>
                <div className="grid grid-cols-1 gap-3 pb-3 border-b">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const nextDate = e.target.value
                          ? new Date(`${e.target.value}T00:00:00`)
                          : undefined;
                        setSelectedDate(nextDate);
                        const nextEnd =
                          !endDate || (nextDate && isBefore(endDate, nextDate))
                            ? nextDate
                            : endDate;
                        setEndDate(nextEnd);
                        setDateRange(nextDate ? { from: nextDate, to: nextEnd } : undefined);
                      }}
                    />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn(
                        "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const nextDate = e.target.value
                          ? new Date(`${e.target.value}T00:00:00`)
                          : undefined;
                        setEndDate(nextDate);
                        setDateRange(
                          selectedDate ? { from: selectedDate, to: nextDate } : undefined
                        );
                      }}
                    />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={cn(
                        "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none"
                      )}
                    />
                  </div>
                  <Button type="button" size="sm" onClick={onConfirm}>
                    <Check className="mr-1 h-4 w-4" /> Conferma
                  </Button>
                </div>

                <div className="flex flex-col gap-2 my-4">
                  <div className="text-sm font-semibold text-zinc-700">
                    Indisponibilità del giorno
                  </div>
                  {(isDayLoading || isRangeLoading) && (
                    <>
                      <Skeleton className="h-8 rounded-md" />
                      <Skeleton className="h-8 rounded-md" />
                    </>
                  )}
                  {!isDayLoading && blockedRanges.length === 0 && (
                    <div className="text-sm text-zinc-500">
                      Nessun blocco di indisponibilità per questa data.
                    </div>
                  )}
                  {!isDayLoading &&
                    blockedRanges.map((block) => {
                      const isFullDay =
                        block.startDate.getTime() === startOfDay(block.startDate).getTime() &&
                        block.endDate.getTime() === startOfDay(block.endDate).getTime() &&
                        block.endDate.getTime() > block.startDate.getTime();

                      return (
                        <div
                          key={block.id}
                          className="h-10 flex gap-2 justify-between items-center bg-zinc-50 px-2 rounded-xl"
                        >
                          <span>
                            {isFullDay ? (
                              "Intera giornata"
                            ) : (
                              <>
                                {format(block.startDate, "HH:mm")}
                                <span className="text-zinc-400 mx-1">-</span>
                                {format(block.endDate, "HH:mm")}
                              </>
                            )}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center text-sm text-zinc-500">
                Seleziona una data per impostare l&apos;orario.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
