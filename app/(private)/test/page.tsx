"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const payload = {
        status: ["draft"],
        dateRange: {
          start: "2025-11-10",
          end: "2025-12-09",
        },
        sort: "asc",
      };

      const response = await axios.post(
        "http://localhost:3000/api/contract/list",
        payload,
        {
          headers: {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Referer": "http://localhost:3000/dashboard",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua":
              '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Content-Type": "application/json",

            // If you want to FORCE cookies manually (Node-style),
            // you can pass it here—but browser normally blocks manual Cookie header.
            // Only works in Node.js or if your server explicitly permits it.
            Cookie:
              "eagle-booking-staging.session_token=XYZ; eagle-booking-staging.session_data=ABC",
          },
          withCredentials: true,
        }
      );

      setData(response.data);
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      setData({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
