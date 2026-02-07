"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, Download, Trash2 } from "lucide-react";
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/types";
import { pdfUploadSchema } from "@/lib/validation/pdf-upload-schema";
import { deleteContractFile } from "@/lib/server-actions/contracts/delete-contract-file";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { getContractPreviewUrl } from "@/lib/utils/contract-preview";
import { generateEventTitle } from "@/lib/utils/generate-event-title";

export default function UploadPdf() {
  const [uploading, setUploading] = useState(false);
  const { watch, setValue, resetField } = useFormContext<EventFormSchema>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayPdf = watch("contractDocument");
  const contractId = watch("contractId");
  const contractStatus = watch("contractStatus");
  const contractRevisionIndex = watch("contractRevisionIndex");
  const isLocked = contractStatus === "voided" || contractStatus === "signed";
  const artistFullName = watch("artistFullName");
  const artistStageName = watch("artistStageName");
  const venueName = watch("venueName");
  const eventDate = watch("eventDate");
  const eventStartTime = watch("eventStartTime");
  const eventEndTime = watch("eventEndTime");

  const displayName = useMemo(() => {
    if (!displayPdf) return "";
    const revisionSuffix =
      typeof contractRevisionIndex === "number" && contractRevisionIndex > 0
        ? " R"
        : "";
    const artistLabel =
      (artistStageName || "").trim() ||
      (artistFullName || "").trim();
    const venueLabel = (venueName || "").trim();

    if (artistLabel && venueLabel && eventDate) {
      const start = new Date(
        `${eventDate}T${eventStartTime || "00:00"}`
      );
      const end = new Date(
        `${eventDate}T${eventEndTime || eventStartTime || "00:00"}`
      );
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        return `${generateEventTitle(
          artistLabel,
          venueLabel,
          start,
          end
        )}${revisionSuffix}.pdf`;
      }
    }

    if (displayPdf.name) {
      const base = displayPdf.name.replace(/\.pdf$/i, "");
      return `${base}${revisionSuffix}.pdf`;
    }

    return `Contratto${revisionSuffix}.pdf`;
  }, [
    displayPdf,
    artistFullName,
    artistStageName,
    venueName,
    eventDate,
    eventStartTime,
    eventEndTime,
    contractRevisionIndex,
  ]);

  /* ---------------- UPLOAD ---------------- */
  const onUpload = async (file: File) => {
    const fetchResponse = await fetch("/api/upload/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
      }),
    });

    const response: ApiResponse<{
      signedUrl: string;
      path: string;
      fileName: string;
    }> = await fetchResponse.json();

    if (!response.success) {
      toast.error(response.message || "Caricamento pdf non riuscito.");
      return;
    }

    const { signedUrl, path, fileName } = response.data;

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      toast.error("Caricamento pdf non riuscito, riprova più tardi.");
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${path}`;

    setValue(
      "contractDocument",
      { url, name: fileName },
      { shouldDirty: true, shouldTouch: true }
    );
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const onChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = pdfUploadSchema.safeParse(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    try {
      setUploading(true);
      const magicNumber = await getFileMagicNumber(file);

      if (!isValidPdfMagicNumber(magicNumber)) {
        toast.error("Il contenuto del pdf non è valido.");
        return;
      }

      await onUpload(file);
    } catch {
      toast.error("Caricamento pdf non riuscito.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ---------------- DOWNLOAD ---------------- */
  const onDownload = () => {
    if (!displayPdf?.url) return;
    const previewUrl =
      getContractPreviewUrl(displayPdf.url, displayName) ||
      displayPdf.url;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  /* ---------------- DELETE ---------------- */
  const onDeleteHandler = async () => {
    const contractId = watch("contractId");
  
    if (!contractId) {
      toast.error("Contract not found.");
      return;
    }
  
    const response = await deleteContractFile({ contractId });
  
    if (response.success) {
      setValue("contractDocument", undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      } 
      toast.success("File del contratto rimosso.");
    } else {
      toast.error(response.message ?? "Failed to remove contract file.");
    }
  };
  
  return (
    <div className={cn("flex items-center gap-3 w-fit")}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onChangeHandler}
        disabled={isLocked}
      />

      {displayPdf ? (
        <div className="flex items-center gap-3 w-fit">
          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full px-4 py-1.5 shadow-sm">
            <Upload className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium truncate max-w-[220px]">
              {displayName}
            </span>
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="text-zinc-600 hover:text-zinc-900"
          >
            <Download className="w-4 h-4" />
          </button>

          {!isLocked && (
            <button
              type="button"
              onClick={onDeleteHandler}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLocked}
          className="
            flex items-center gap-2
            bg-white
            border border-zinc-300
            rounded-xl
            px-4 py-2
            text-sm
            shadow-sm
            hover:bg-zinc-50
            disabled:opacity-50
          "
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      )}
    </div>
  );
}
