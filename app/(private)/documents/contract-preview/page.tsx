"use client";

import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ContractPreview() {
  const searchParams = useSearchParams();

  const artist = searchParams.get("artist") ?? "";
  const venue = searchParams.get("venue") ?? "";
  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "";
  const fee = searchParams.get("fee") ?? "";
  const email = searchParams.get("email") ?? "";

  /* -------------------------------
     GENERATE PDF USING BROWSER
  -------------------------------- */

  /* -------------------------------
     UI (INLINE CSS ONLY)
  -------------------------------- */
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "32px",
        fontSize: "12px",
        color: "#000",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Performance Contract</h2>

      <p><b>Artist:</b> {artist}</p>
      <p><b>Venue:</b> {venue}</p>
      <p><b>Date:</b> {date}</p>
      <p><b>Time:</b> {time}</p>

      <hr />

      <p>
        The Artist agrees to perform at the Venue on the above date.
      </p>

      <p><b>Total Fee:</b> €{fee}</p>

      <div style={{ marginTop: "48px" }}>
        <div
          style={{
            width: "220px",
            height: "48px",
            border: "1px solid #000",
            lineHeight: "48px",
            textAlign: "center",
          }}
        >
          SIGN HERE
        </div>
      </div>

      <br />
    </div>
  );
}
