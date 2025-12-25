"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  fileUrl: string | null;
};

export default function ViewContractButton({ fileUrl }: Props) {
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
