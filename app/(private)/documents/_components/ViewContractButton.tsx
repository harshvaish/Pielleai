"use client";

import { Button } from "@/components/ui/button";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export default function ViewContractButton() {
  const { watch } = useFormContext<EventFormSchema>();

  const contractDocument = watch("contractDocument");
  const fileUrl = contractDocument?.url;

  const handleClick = () => {
    if (!fileUrl) {
      toast.error("File contratto non disponibile.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      onClick={handleClick}
    >
      Visualizza contratto
    </Button>
  );
}
