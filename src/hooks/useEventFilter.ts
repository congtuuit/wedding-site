"use client";

import { useEffect, useState } from "react";
import { WeddingEvent } from "@/types/wedding";

export type EventFilterType = "all" | "sg" | "que";

export function useEventFilter(events: WeddingEvent[]) {
  const [filter, setFilter] = useState<EventFilterType>("all");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get("event") || params.get("type");

      if (eventParam === "sg") {
        setFilter("sg");
      } else if (eventParam === "que") {
        setFilter("que");
      } else {
        setFilter("all");
      }
    } catch {
      setFilter("all");
    }
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.category === filter;
  });

  return {
    filter,
    setFilter,
    filteredEvents,
  };
}
