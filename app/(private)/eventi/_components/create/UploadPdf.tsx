"use client";

import React, { useRef, useState, useTransition } from "react";
import { Upload, Download, Trash2 } from "lucide-react";
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { ApiResponse } from "@/lib/types";
import { pdfUploadSchema } from "@/lib/validation/pdf-upload-schema";
import { deleteContractFile } from "@/lib/server-actions/contracts/delete-contract-file";
import { useRouter } from "next/navigation";

export default function LocalPdfUpload() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [uploading, setUploading] = useState(false);

  const { watch, setValue, resetField  } = useFormContext<EventFormSchema>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- FORM VALUE (SINGLE SOURCE) ---------------- */
  const displayPdf = watch("contractDocument");

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

    // Replace or set instantly
    setValue(
      "contractDocument",
      { url, name: fileName },
      { shouldDirty: true }
    );
    toast.success("PDF caricato con successo.");
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    window.open(displayPdf.url, "_blank", "noopener,noreferrer");
  };

  /* ---------------- DELETE ---------------- */
  const onDeleteHandler = async () => {
    startTransition(async () => {

    const contractId = watch("contractId");
    if (!contractId) {
      resetField("contractDocument");
      setValue("contractDocument", undefined, { shouldDirty: true });
  
      if (fileInputRef.current) fileInputRef.current.value = "";
  
      toast.success("File rimosso.");
      return;
    }
  
    const response = await deleteContractFile({
      contractId: Number(contractId),
    });

    if (response.success) {
      resetField("contractDocument");
      setValue("contractDocument", undefined, { shouldDirty: true });
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("File contratto rimosso.");
      startTransition(async () => router.refresh());
    } else {
      toast.error(response.message ?? "Failed to remove contract file.");
    }
  });

  };

  return (
    <div className={cn("flex items-center gap-3 w-fit")}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onChangeHandler}
      />

      {displayPdf ? (
        <div className="flex items-center gap-3 w-fit">
          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full px-4 py-1.5 shadow-sm">
            <Upload className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium truncate max-w-[220px]">
              {displayPdf.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="text-zinc-600 hover:text-zinc-900"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDeleteHandler}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-white border border-zinc-300 rounded-xl px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Caricamento..." : "Upload"}
        </button>
      )}
    </div>
  );
}
