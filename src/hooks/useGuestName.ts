"use client";

import { useEffect, useState } from "react";
import { decodeGuestName } from "@/lib/utils";

export function useGuestName(): { guestName: string; isPersonalized: boolean } {
  const [guestName, setGuestName] = useState<string>("");
  const [isPersonalized, setIsPersonalized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get("to") || params.get("guest") || params.get("k");

      if (toParam) {
        const decoded = decodeGuestName(toParam);
        if (decoded) {
          setGuestName(decoded);
          setIsPersonalized(true);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading guest param:", e);
    }
  }, []);

  return {
    guestName: guestName || "Bạn & Người Thương",
    isPersonalized,
  };
}
