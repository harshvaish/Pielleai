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
  FileText,
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
  | "queued"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "voided";

type Props = {
  contractId: number;
  status: ContractStatus;
  className?: string;
};

/* ----------------------------------------
   STATUS STYLES (badge + icon)
---------------------------------------- */

const STATUS_STYLES: Record<
  ContractStatus,
  {
    label: string;
    text: string;
    icon: JSX.Element;
  }
> = {
  draft: {
    label: "Draft",
    text: "text-amber-600",
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-amber-600 rounded-full">
        <span className="text-[8px] text-white">?</span>
      </div>
    ),
  },

  queued: {
    label: "To be signed",
    text: "text-amber-700",
    icon: <Send className="h-3 w-3" />,
  },

  sent: {
    label: "Sent",
    text: "text-sky-600",
    icon: (
      <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-sky-600">
        <ChevronRight className="h-2 w-2 text-white" />
      </span>
    ),
  },

  viewed: {
    label: "Viewed",
    text: "text-indigo-600",
    icon: <Eye className="h-3 w-3" />,
  },

  signed: {
    label: "Signed",
    text: "text-lime-700",
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-lime-600 rounded-full">
        <Check className="size-2 text-white" />
      </div>
    ),
  },

  declined: {
    label: "Refused",
    text: "text-rose-700",
    icon: (
      <div className="w-3 h-3 flex justify-center items-center bg-red-600 rounded-full">
        <X className="size-2 text-white" />
      </div>
    ),
  },

  voided: {
    label: "Archived",
    text: "text-zinc-600",
    icon: <PartyPopper className="h-3 w-3" />,
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

  const s = STATUS_STYLES[status];

  const updateStatus = (next: ContractStatus) => {
    if (next === status) return;

    startTransition(async () => {
      const response = await editContract({
        contractId,
        status: next,
        note: next === "voided" ? "Contratto archiviato" : undefined,
      });

      if (response.success) {
        toast.success(
          next === "voided" ? "Contract archived" : "Status updated"
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
            "inline-flex items-center gap-2 rounded-md border px-2 py-2.5 text-xs font-medium",
            s.text,
            isPending && "opacity-60 cursor-not-allowed",
            className
          )}
        >
          <span >{s.label}</span>
          {s.icon}

          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => updateStatus("sent")}
          className="flex items-center gap-2"
        >
          Sent
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-600">
            <ChevronRight className="h-3 w-3 text-white" />
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => updateStatus("voided")}
          className="flex items-center gap-2"
        >
          Archived
          <PartyPopper className="h-4 w-4 text-zinc-600" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
