"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsivePopover from "@/app/_components/ResponsivePopover";
import { cn, getFileMagicNumber, isValidPdfMagicNumber } from "@/lib/utils";
import { pdfUploadSchema } from "@/lib/validation/pdf-upload-schema";
import { ApiResponse, ArtistSelectData } from "@/lib/types";
import { updateArtistDocuments } from "@/lib/server-actions/artists/update-artist-documents";

type DocumentType = "tax-code" | "id-card" | "passport" | "other";

type UploadArtistDocumentDialogProps = {
  artists: ArtistSelectData[];
};

function ArtistSelect({
  artists,
  value,
  onChange,
}: {
  artists: ArtistSelectData[];
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => artists.find((artist) => artist.id === value) ?? null,
    [artists, value],
  );

  const triggerLabel = selected
    ? `${selected.stageName} · ${selected.name} ${selected.surname}`
    : "Seleziona artista";

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title="Seleziona artista"
      description="Cerca artista per nome o stage name"
      isDescriptionHidden={true}
      isTitleHidden={true}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("w-full justify-between text-sm font-normal")}
        >
          <span className={cn(!selected && "text-zinc-400")}>{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </Button>
      }
      align="start"
    >
      <div className="border-t">
        <Command className="relative">
          <CommandInput placeholder="Cerca artista" />
          <CommandList
            className="max-h-60 overflow-y-auto overscroll-contain"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {artists.map((artist) => {
                const isSelected = artist.id === value;
                const searchLabel = `${artist.stageName} ${artist.name} ${artist.surname}`;
                return (
                  <CommandItem
                    key={artist.id}
                    value={searchLabel}
                    onSelect={() => {
                      onChange(artist.id);
                      setOpen(false);
                    }}
                    keywords={[artist.stageName, artist.name, artist.surname]}
                  >
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-800">
                          {artist.stageName}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {artist.name} {artist.surname}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 text-zinc-500 transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <div className="border-t p-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              Pulisci
            </Button>
          </div>
        </Command>
      </div>
    </ResponsivePopover>
  );
}

export default function UploadArtistDocumentDialog({
  artists,
}: UploadArtistDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const resetState = () => {
    setSelectedArtistId(null);
    setDocumentType("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const uploadFile = async (
    file: File,
    endpoint: string,
    payload?: Record<string, unknown>,
  ) => {
    const fetchResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
        ...payload,
      }),
    });

    const response: ApiResponse<{
      signedUrl: string;
      path: string;
      fileName: string;
    }> = await fetchResponse.json();

    if (!response.success) {
      throw new Error(response.message || "Caricamento pdf non riuscito.");
    }

    const { signedUrl, path, fileName } = response.data;
    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Caricamento pdf non riuscito, riprova più tardi.");
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${path}`;
    return { url, fileName };
  };

  const handleUpload = async () => {
    if (!selectedArtistId) {
      toast.error("Seleziona un artista.");
      return;
    }

    if (!selectedFile) {
      toast.error("Seleziona un file.");
      return;
    }

    const validation = pdfUploadSchema.safeParse({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    try {
      setUploading(true);
      const magicNumber = await getFileMagicNumber(selectedFile);
      if (!isValidPdfMagicNumber(magicNumber)) {
        toast.error("Il contenuto del pdf non è valido.");
        return;
      }

      const endpoint =
        documentType === "other" ? "/api/upload/artist-document" : "/api/upload/pdf";
      const payload =
        documentType === "other" ? { artistId: selectedArtistId } : undefined;
      const { url, fileName } = await uploadFile(selectedFile, endpoint, payload);

      if (
        documentType === "tax-code" ||
        documentType === "id-card" ||
        documentType === "passport"
      ) {
        const response = await updateArtistDocuments(selectedArtistId, {
          type: documentType,
          fileName,
          fileUrl: url,
        });

        if (!response.success) {
          toast.error(response.message || "Aggiornamento documento non riuscito.");
          return;
        }
      }

      toast.success("Documento caricato.");
      router.refresh();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Caricamento pdf non riuscito.");
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled =
    uploading ||
    !documentType ||
    !selectedFile ||
    !selectedArtistId;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
          return;
        }
        setOpen(value);
      }}
    >
      <Button
        type="button"
        size="xs"
        variant="default"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Aggiungi
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Aggiungi un nuovo file</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Artist name</label>
            <ArtistSelect
              artists={artists}
              value={selectedArtistId}
              onChange={setSelectedArtistId}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Type of document</label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tax-code">Fiscal Code</SelectItem>
                <SelectItem value="id-card">ID Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Upload file</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="justify-start"
            >
              <Upload className="h-4 w-4" />
              {selectedFile ? selectedFile.name : "Seleziona file"}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploadDisabled}
            >
              {uploading ? "Caricamento..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
