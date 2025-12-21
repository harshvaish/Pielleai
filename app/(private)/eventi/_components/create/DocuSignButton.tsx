"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

// docusignDummyData.ts
export const DUMMY_CONTRACT_DATA = {
    artistName: "Ann Carrot",
    artistStageName: "DJ Carrot",
    venueName: "Milano Social Club",
    eventDate: "18/12/2025",
    totalFee: "€5,000",
    paymentDate: "25/12/2025",
    signerName: "Luca Bianchi",
    signerEmail: "luca.bianchi@example.com",
  };
  
export default function DocuSignButton() {
  const [loading, setLoading] = useState(false);

const handleClick = () => {
    const encoded = encodeURIComponent(JSON.stringify(DUMMY_CONTRACT_DATA));
    window.open(`/contract/contract-template.html?data=${encoded}`, '_blank');
  };

  return (
    <Button
      type="button"
      size="sm"
      className="max-w-max"
      //disabled={!file || loading}
      onClick={handleClick}
    >
      {loading ? "Sending..." : "Send to DocuSign"}
    </Button>
  );
}
