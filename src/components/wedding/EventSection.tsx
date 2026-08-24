"use client";

import React from "react";
import { WeddingEvent } from "@/types/wedding";
import { useEventFilter } from "@/hooks/useEventFilter";
import { EventCard } from "./EventCard";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface EventSectionProps {
  events: WeddingEvent[];
}

export const EventSection: React.FC<EventSectionProps> = ({ events }) => {
  const { filter, setFilter, filteredEvents } = useEventFilter(events);

  return (
    <section id="events" className="w-full py-20 px-4 bg-background text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs uppercase font-sans tracking-[0.35em] text-accent font-semibold">
          Thông Tin Sự Kiện
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-textMain font-normal tracking-wide mt-2">
          Thời Gian & Địa Điểm
        </h2>

        <SectionDivider variant="botanical" />

        {/* Filter Switcher */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-surface border border-borderLight mb-12 shadow-sm">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[40px] ${
              filter === "all"
                ? "bg-accent text-white font-medium shadow-sm"
                : "text-textMuted hover:text-textMain"
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilter("sg")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[40px] ${
              filter === "sg"
                ? "bg-accent text-white font-medium shadow-sm"
                : "text-textMuted hover:text-textMain"
            }`}
          >
            Tiệc Nhà Trai (12.12)
          </button>
          <button
            onClick={() => setFilter("que")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-300 min-h-[40px] ${
              filter === "que"
                ? "bg-accent text-white font-medium shadow-sm"
                : "text-textMuted hover:text-textMain"
            }`}
          >
            Lễ & Tiệc Nhà Gái (10.10)
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};
