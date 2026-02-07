"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { invalidateContract } from "@/lib/server-actions/contracts/invalidate-contract";
import type { EventFormSchema } from "@/lib/validation/event-form-schema";
import { useFormContext } from "react-hook-form";

export default function InvalidateContractButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const { watch } = useFormContext<EventFormSchema>();

  const contractId = watch("contractId");

  const handleInvalidate = () => {
    const id = Number(contractId);
    if (!Number.isFinite(id) || id <= 0) {
      toast.error("Contratto non trovato.");
      return;
    }

    startTransition(async () => {
      const response = await invalidateContract({
        contractId: id,
        note: note.trim() || undefined,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Contratto invalidato. Nuovo contratto creato.");
      setOpen(false);
      setNote("");
      router.push(`/documents/${response.data.newContractId}`);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isPending || !contractId}
        >
          Invalida
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invalidare il contratto?</DialogTitle>
          <DialogDescription>
            Il contratto corrente verrà invalidato e verrà creato un nuovo
            contratto (revisione) da firmare.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Motivo (opzionale)
          </label>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Es. correzione dati economici"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Annulla
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleInvalidate}
            disabled={isPending}
          >
            {isPending ? "Invalidando..." : "Invalida e crea nuovo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

