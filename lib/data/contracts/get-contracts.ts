import { cookies } from "next/headers";

type GetContractsArgs = {
  startDate?: string | "";
  endDate?: string | "";
  status?: string[];
  sort?: 'asc' | 'desc';
};


export default async function getContracts({
  startDate,
  endDate,
  status,
  sort,
}: GetContractsArgs) {
  const payload = {
    status:status ?? ["draft"],
    // dateRange: { start: "2025-11-10", end: "2025-12-09" },
    dateRange: { start: startDate, end: endDate },
    sort: sort,
  };
  console.log("payload", payload);
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
