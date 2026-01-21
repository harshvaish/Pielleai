"use client";

import { toast } from "sonner";
import { useState } from "react";

type Props = {
  contractId?: number;
};

export default function ResendDocuSignButton({ contractId }: Props) {
  const [loading, setLoading] = useState(false);
  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/contract/resend-docusign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId,
          anchorString: "DOCUSIGN_SIGNATURE",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invio DocuSign non riuscito");
      }

      toast.success("Documento inviato nuovamente per la firma");
    } catch (err: any) {
      console.error("Resend DocuSign failed:", err);
      toast.error(err?.message || "Errore durante l’invio a DocuSign");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-full items-center justify-end pr-2 text-sm font-medium text-[#16A34A] hover:underline"
      disabled={loading}
    >
      {loading ? "Reinvio..." : "Reinvia a DocuSign"}
    </button>
  );
}
