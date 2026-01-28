"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type DocumentTypeOption = {
  value: string;
  label: string;
};

type DocumentTypeFilterProps = {
  value: string;
  options: DocumentTypeOption[];
};

export default function DocumentTypeFilter({ value, options }: DocumentTypeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue === "all") {
      params.delete("doc");
    } else {
      params.set("doc", nextValue);
    }
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="min-w-44">
        <SelectValue placeholder="Tutti" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
