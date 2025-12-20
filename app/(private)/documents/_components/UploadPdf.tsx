"use client";

import React, { useRef, useState } from "react";
import { Upload, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadedFile = {
  name: string;
  file: File;
};

type Props = {
  className?: string;
};

export default function UplodPdf({ className }: Props) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- UPLOAD ---------------- */
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile({
      name: file.name,
      file,
    });

    // allow re-uploading same file
    e.currentTarget.value = "";
  };

  /* ---------------- DOWNLOAD ---------------- */
  const onDownload = () => {
    if (!uploadedFile) return;

    const url = URL.createObjectURL(uploadedFile.file);
    const a = document.createElement("a");

    a.href = url;
    a.download = uploadedFile.name;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------------- DELETE ---------------- */
  const onDelete = () => {
    setUploadedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("flex items-center gap-3 w-fit", className)}>
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onUpload}
      />

      {/* FILE EXISTS */}
      {uploadedFile ? (
        <div className="flex items-center gap-3 w-fit">
          {/* FILE CHIP */}
          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full px-4 py-1.5 shadow-sm">
            <Upload className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium truncate max-w-[220px]">
              {uploadedFile.name}
            </span>
          </div>

          {/* DOWNLOAD */}
          <button
            type="button"
            onClick={onDownload}
            className="text-zinc-600 hover:text-zinc-900"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* NO FILE */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            flex items-center gap-2
            bg-white
            border border-zinc-300
            rounded-xl
            px-4 py-2
            text-sm
            shadow-sm
            hover:bg-zinc-50
          "
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      )}
    </div>
  );
}
