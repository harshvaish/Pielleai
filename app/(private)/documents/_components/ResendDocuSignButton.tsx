"use client";

import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";


export default function ResendDocuSignButton() {
  const { watch } = useFormContext<EventFormSchema>();  
  const contractId = watch("contractId");

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();

    try {
      const res = await fetch("/api/contract/resend-docusign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invio DocuSign non riuscito");
      }

      toast.success("Documento inviato nuovamente per la firma");
    } catch (err: any) {
      console.error("Resend DocuSign failed:", err);
      toast.error(err?.message || "Errore durante l’invio a DocuSign");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-full items-center justify-end pr-2 text-sm font-medium text-[#16A34A] hover:underline"
    >
      Invia di nuovo per firma
    </button>
  );
}
