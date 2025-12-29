"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, MapPin, Clock, Briefcase } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import BackButton from "@/app/_components/BackButton";
import Link from "next/link";
import ContractDetailClient from "./ContractDetailClient";
import GenerateButton from "../_components/GenerateButton";
import DocuSignButton from "../_components/DocuSignButton";
import ViewContractButton from "../_components/ViewContractButton";
import ContractStatusButton from "../_components/ContractStatusButton";
import { GREEN_TICK_ICON } from "@/lib/constants";
import UplodPdf from "../_components/UploadPdf";
import ResendDocuSignButton from "./ResendDocuSignButton";

type Props = {
  payload: any;
};

type HistoryItem = {
  date: string;
  time: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  type: "archived" | "success";
};

export default function ContractDetailTile({ payload }: Props) {
  const methods = useForm({
    defaultValues: {
      contractId: payload.id,
      contractStatus: payload.backendStatus,
      contractDocument: payload?.fileUrl
        ? {
            url: payload.fileUrl,
            name: payload.fileName,
          }
        : undefined,
    },
  });
  const { watch } = methods;
  const contractStatus = watch("contractStatus");

  const { date, time } = useMemo(() => {
    if (!payload?.availability) return { date: "—", time: "—" };

    const start = new Date(payload.availability.startDate);
    const end = new Date(payload.availability.endDate);

    return {
      date: start.toLocaleDateString("it-IT"),
      time: `${start.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      })} – ${end.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };
  }, [payload]);

  /* ---------------- HISTORY ---------------- */
  const historyData: HistoryItem[] = Array.isArray(payload.history)
    ? payload.history.map((h: any) => {
        const createdAt = new Date(h.createdAt);

        return {
          date: createdAt.toLocaleDateString("it-IT"),
          time: createdAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          title: h.fromStatus
            ? `Stato modificato a "${h.fromStatus}" to "${h.toStatus}"`
            : "Contratti creati",
          description: h.note ?? "Nessuna descrizione disponibile.",
          fileUrl: h.fileUrl ?? undefined,
          fileName: h.fileName ?? undefined,
          type: h.toStatus === "voided" ? "archived" : "success",
        };
      })
    : [];

  return (
    <FormProvider {...methods}>
      <div className="h-full w-full bg-zinc-50 px-4 py-6 md:p-6 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <BackButton />

          <div className="flex items-center gap-2">
            {contractStatus === "declined" && (
              <>
                <ResendDocuSignButton />
                <ViewContractButton />
              </>
            )}

            {contractStatus === "voided" && <ViewContractButton />}

            {contractStatus !== "declined" && contractStatus !== "voided" && (
              <>
                <GenerateButton payload={payload} />
                <DocuSignButton payload={payload} />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
          <Card className="bg-white shadow-sm border-zinc-200">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={payload?.artist?.avatarUrl}
                      alt="Avatar"
                      className="size-11 rounded-full object-cover bg-zinc-200"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">
                        {payload.stageName}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {payload.artistName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 flex shrink-0 justify-center items-center bg-zinc-600 rounded-full" />
                      <span>Club "{payload?.venue?.name}"</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-4 text-zinc-400" />
                      {date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4 text-zinc-400" />
                      {time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[220px]">
                  <ContractStatusButton
                    contractId={payload.id}
                    status={contractStatus}
                  />

                  <div className="text-xs text-zinc-500">
                    Stato aggiornato il {payload.statusDate}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-zinc-800">
                  File del contratto
                </div>
                <UplodPdf payload={payload} />
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <span className="text-zinc-800 font-semibold">
                  Dettagli evento
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-sm text-sky-600"
                  asChild
                >
                  <Link href="/eventi" target="_blank" rel="noreferrer">
                    Visualizza dettagli evento{" "}
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs md:text-sm text-zinc-600">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4 text-zinc-400" />
                  Locale
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md w-fit bg-zinc-100 px-2 py-1.5 text-xs text-zinc-700">
                  <span className="w-3 h-3 flex shrink-0 justify-center items-center bg-zinc-600 rounded-full" />
                  <span>Club "{payload?.venue?.name}"</span>
                </span>

                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-zinc-600" />
                  Manager
                </span>

                <Badge variant="secondary">
                  {payload?.artist?.tourManagerName}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <Briefcase className="size-4 text-zinc-400" />
                  Tour manager
                </span>
                <span>
                  {" "}
                  {payload?.artist?.tourManagerName || ""}{" "}
                  {payload?.artist?.tourManagerSurname || ""}
                </span>
                <span>Administration</span>
                <span className="flex items-center gap-1">
                  <Mail className="size-4 text-zinc-400" />
                  {payload?.artist?.tourManagerEmail}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-zinc-200">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  Storico dei cambiamenti
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent flex flex-col gap-4">
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

                        {/* Title */}
                        <div className="text-sm font-medium text-zinc-800">
                          {item.title}
                        </div>

                        {/* Description */}
                        <div className="text-xs text-zinc-500 leading-relaxed mt-1">
                          {item.description}
                          {/* <span>
                          {" "}
                          {item.fileUrl && item.fileName && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-xs text-sky-600 hover:underline"
                            >
                              {item.fileName}
                            </a>
                          )}
                        </span> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm border-zinc-200">
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Dettagli</div>
            </div>

            <ContractDetailClient payload={payload} />
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
