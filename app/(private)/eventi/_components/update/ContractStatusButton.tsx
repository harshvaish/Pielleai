"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Eye,
  Check,
  X,
  PartyPopper,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { editContract } from "@/lib/server-actions/contracts/update-contract";
import { JSX } from "react";

/* ----------------------------------------
   TYPES
---------------------------------------- */

type ContractStatus =
  | "draft"
  | "sent"
  | "declined"
  | "voided";

type Props = {
  contractId: number;
  status: ContractStatus;
  className?: string;
};

/* ----------------------------------------
   STATUS STYLES (EventStatusBadge style)
---------------------------------------- */

const STATUS_STYLES: Record<
  ContractStatus,
  {
    label: string;
    text: string;
    bg: string;
    icon: JSX.Element;
  }
> = {
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
    label: "Refused",
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

/* ----------------------------------------
   COMPONENT
---------------------------------------- */

export default function ContractStatusButton({
  contractId,
  status,
  className,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const current = STATUS_STYLES[status];

  const STATUS_TOAST: Record<
  ContractStatus,
  { success: string; error?: string }
> = {
  draft: {
    success: "Contract draft successfully",

  },
  sent: {
    success: "Contract sent successfully",
  },
  declined: {
    success: "Contract Refused",
  },
  voided: {
    success: "Contract archived",
  },
};


  const updateStatus = (next: ContractStatus) => {
    if (next === status) return;

    startTransition(async () => {
      const response = await editContract({
        contractId,
        status: next,
      });

      if (response.success) {
        toast.success(
          STATUS_TOAST[next]?.success ?? "Status updated"
        );
              router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2.5 py-2.5 text-s font-medium",
            "max-w-min whitespace-nowrap",
            "border border-zinc-200 hover:border-zinc-300",
            "bg-white",
                    current.text,
            isPending && "opacity-60 cursor-not-allowed",
            className
          )}
        >
          {current.label}
          <span className="truncate"> {current.icon} </span>

          <ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[100px]">
        <DropdownMenuItem
          onClick={() => updateStatus("sent")}
          className="flex items-center gap-2"
        >
          Sent
          <div className="w-3 h-3 flex items-center justify-center bg-sky-600 rounded-full">
            <ChevronRight className="size-2 text-white" />
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => updateStatus("declined")}
          className="flex items-center gap-2"
        >
          Refused
          <div className="w-3 h-3 flex items-center justify-center bg-red-600 rounded-full">
            <X className="size-2 text-white" />
          </div>

        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => updateStatus("voided")}
          className="flex items-center gap-2"
        >
          Archived
          <div className="w-3 h-3 flex items-center justify-center rounded-full">
            <PartyPopper className="size-3 text-zinc-600" />
          </div>

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
