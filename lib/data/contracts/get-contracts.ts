import { cookies } from "next/headers";

export default async function getContracts() {
  const payload = {
    status: ["draft"],
    dateRange: { start: "2025-11-10", end: "2025-12-09" },
    sort: "asc",
  };

  // forward cookies
  const allCookies = await cookies();
  const cookieHeader = allCookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:3001/api/contract/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Cookie: cookieHeader,     // ← IMPORTANT FIX
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to load contracts");
  }

  return res.json();
}
