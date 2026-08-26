"use client";

import { useEffect, useState } from "react";
import { WeddingEvent } from "@/types/wedding";

export type EventFilterType = "all" | "sg" | "que";

export function useEventFilter(
  events: WeddingEvent[],
  defaultInitialFilter: EventFilterType = "all"
) {
  const [filter, setFilter] = useState<EventFilterType>(defaultInitialFilter);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get("event") || params.get("type");

      if (eventParam === "sg" || eventParam === "nha-trai") {
        setFilter("sg");
      } else if (eventParam === "que" || eventParam === "nha-gai") {
        setFilter("que");
      } else {
        setFilter(defaultInitialFilter);
      }
    } catch {
      setFilter(defaultInitialFilter);
    }
  }, [defaultInitialFilter]);

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
