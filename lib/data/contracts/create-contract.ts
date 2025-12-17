"use server";

import { cookies } from "next/headers";
import { EventFormSchema } from "@/lib/validation/event-form-schema";

type CreateContractResponse =
  | { success: true; data: any }
  | { success: false; message: string };

export default async function createContract(
  data: EventFormSchema
): Promise<CreateContractResponse> {
  try {
    // ---- Build payload (backend contract API shape) ----
    const payload = {
      artistId: data.artistId,
      venueId: data.venueId,
      eventId: data.eventId,
      contractDate: data?.contractDate,
      fileUrl: data?.fileUrl,
      fileName: data?.fileName,
      recipientEmail: data.recipientEmail,
      ccEmails: data.ccEmails ?? [],
      status: data.contractStatus ?? "draft",
      note: "Initial contract created by admin before artist signature.",
    };
    // ---- Forward cookies (same as getContracts) ----
    const allCookies = await cookies();
    const cookieHeader = allCookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch("http://localhost:3001/api/contract/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Create contract failed:", errorText);
      return { success: false, message: "Failed to create contract" };
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Unexpected error creating contract" };
  }
}
