"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, PartyPopper, ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { editContract } from "@/lib/server-actions/contracts/update-contract";
import { JSX } from "react";
import { EventFormSchema } from "@/lib/validation/event-form-schema";
import { useFormContext } from "react-hook-form";

type ContractStatus = "draft" | "sent" | "declined" | "voided" | "signed";

type Props = {
  contractId: number;
  status: ContractStatus;
  className?: string;
  labelOverride?: string;
  iconOverride?: JSX.Element;
};

const STATUS_STYLES: Record<
  ContractStatus,
  {
    label: string;
    text: string;
    bg: string;
    icon: JSX.Element;
  }
> = {
  signed: {
    label: "Firmato",
    text: "text-lime-600",
    bg: "bg-lime-50",
    icon: (
      <div className="w-3 h-3 flex items-center justify-center bg-lime-600 rounded-full">
        <Check className="size-2 text-white" />
      </div>
    ),
  },

  draft: {
    label: "Draft",
    text: "text-amber-600",
    bg: "bg-amber-50",
    icon: (
      <div className="w-3 h-3 flex items-center justify-center bg-amber-600 rounded-full">
        <span className="text-[8px] text-white">?</span>
      </div>
    ),
  },

  sent: {
    label: "Sent",
    text: "text-sky-600",
    bg: "bg-sky-50",
    icon: (
      <div className="w-3 h-3 flex items-center justify-center bg-sky-600 rounded-full">
        <ChevronRight className="size-2 text-white" />
      </div>
    ),
  },

  declined: {
    label: "Rifiutato",
    text: "text-red-700",
    bg: "bg-red-50",
    icon: (
      <div className="w-3 h-3 flex items-center justify-center bg-red-600 rounded-full">
        <X className="size-2 text-white" />
      </div>
    ),
  },

  voided: {
    label: "Archived",
    text: "text-zinc-600",
    bg: "bg-zinc-100",
    icon: (
      <div className="w-3 h-3 flex items-center justify-center bg-zinc-600 rounded-full">
        <PartyPopper className="size-2 text-white" />
      </div>
    ),
  },
};

export default function ContractStatusButton({
  contractId,
  status,
  className,
  labelOverride,
  iconOverride,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const form = useFormContext<EventFormSchema>();
  const setValue = form?.setValue;
  const isReadOnly = status == "signed";

  const current = STATUS_STYLES[status];
  const label = labelOverride ?? current.label;
  const icon = iconOverride ?? current.icon;

  const STATUS_TOAST: Partial<
    Record<ContractStatus, { success: string; error?: string }>
  > = {
    draft: {
      success: "Contratto draft con successo",
    },
    sent: {
      success: "Contratto Da firmare con successo",
    },
    declined: {
      success: "Contratto Rifiutato",
    },
    voided: {
      success: "Contratto  Archiviato",
    },
  };
  type MutableStatus = Exclude<ContractStatus, "signed">;

  const updateStatus = (next: MutableStatus) => {
    if (next === status) return;

    startTransition(async () => {
      const response = await editContract({
        contractId,
        status: next,
      });

      if (response.success) {
        toast.success(STATUS_TOAST[next]?.success ?? "Status updated");
        setValue?.("contractStatus", next, {
          shouldDirty: false,
          shouldTouch: false,
        });
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending || isReadOnly}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2.5 py-2.5 text-s font-medium",
            "max-w-min whitespace-nowrap",
            "border border-zinc-200 hover:border-zinc-300",
            "bg-white",
            current.text,
            isPending && "opacity-60",
            className
          )}
        >
          {label}
          <span className="truncate"> {icon} </span>

          {!isReadOnly && (
            <ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />
          )}
        </button>
      </DropdownMenuTrigger>
      {!isReadOnly && (
        <DropdownMenuContent align="start" className="min-w-[100px]">
          <DropdownMenuItem
            onClick={() => updateStatus("sent")}
            className="flex items-center gap-2"
          >
            Da firmare
            <div className="w-3 h-3 flex items-center justify-center bg-sky-600 rounded-full">
              <ChevronRight className="size-2 text-white" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => updateStatus("declined")}
            className="flex items-center gap-2"
          >
            Rifiutato
            <div className="w-3 h-3 flex items-center justify-center bg-red-600 rounded-full">
              <X className="size-2 text-white" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => updateStatus("voided")}
            className="flex items-center gap-2"
          >
            Archiviato
            <div className="w-3 h-3 flex items-center justify-center rounded-full">
              <PartyPopper className="size-3 text-zinc-600" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
