"use client";

import { Button } from "@/components/ui/button";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { getContractPreviewUrl } from "@/lib/utils/contract-preview";

export default function ViewContractButton() {
  const { watch } = useFormContext<EventFormSchema>();

  const contractDocument = watch("contractDocument");
  const fileUrl = contractDocument?.url;
  const fileName = contractDocument?.name;

  const handleClick = () => {
    if (!fileUrl) {
      toast.error("File contratto non disponibile.");
      return;
    }

    const previewUrl = getContractPreviewUrl(fileUrl, fileName) ?? fileUrl;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
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
