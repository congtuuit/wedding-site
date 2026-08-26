"use client";

import React from "react";
import { WeddingEvent } from "@/types/wedding";
import { useEventFilter } from "@/hooks/useEventFilter";
import { EventCard } from "./EventCard";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface EventSectionProps {
  events: WeddingEvent[];
  defaultFilter?: "all" | "sg" | "que";
  activeStageKey?: "sg" | "que";
}

export const EventSection: React.FC<EventSectionProps> = ({
  events,
  defaultFilter = "all",
  activeStageKey = "que",
}) => {
  const { filter, setFilter, filteredEvents } = useEventFilter(events, defaultFilter);

  const isQueFirst = activeStageKey === "que";

  return (
    <section id="events" className="w-full py-16 px-4 bg-background text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold">
          Thông Tin Sự Kiện
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-2">
          Thời Gian & Địa Điểm
        </h2>

        <SectionDivider variant="botanical" className="my-4" />

        {/* Filter Switcher */}
        <div className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-2xl bg-surface border border-borderLight mb-8 shadow-sm">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[36px] ${
              filter === "all"
                ? "bg-accent text-white font-medium shadow-sm"
                : "text-textMuted hover:text-textMain"
            }`}
          >
            Tất Cả
          </button>

          {isQueFirst ? (
            <>
              <button
                onClick={() => setFilter("que")}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[36px] ${
                  filter === "que"
                    ? "bg-accent text-white font-medium shadow-sm"
                    : "text-textMuted hover:text-textMain"
                }`}
              >
                Nhà Gái (10.10)
              </button>
              <button
                onClick={() => setFilter("sg")}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[36px] ${
                  filter === "sg"
                    ? "bg-accent text-white font-medium shadow-sm"
                    : "text-textMuted hover:text-textMain"
                }`}
              >
                Nhà Trai (12.12)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setFilter("sg")}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[36px] ${
                  filter === "sg"
                    ? "bg-accent text-white font-medium shadow-sm"
                    : "text-textMuted hover:text-textMain"
                }`}
              >
                Nhà Trai (12.12)
              </button>
              <button
                onClick={() => setFilter("que")}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[36px] ${
                  filter === "que"
                    ? "bg-accent text-white font-medium shadow-sm"
                    : "text-textMuted hover:text-textMain"
                }`}
              >
                Nhà Gái (10.10)
              </button>
            </>
          )}
        </div>

        {/* Event Cards (Clean vertical full-width stack) */}
        <div className="flex flex-col gap-6 text-left">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};
