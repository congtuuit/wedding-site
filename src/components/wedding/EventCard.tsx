"use client";

import React from "react";
import { WeddingEvent } from "@/types/wedding";
import { MapPin, Calendar, Clock, Navigation, CalendarPlus } from "lucide-react";
import { downloadIcsFile } from "@/lib/calendar";

interface EventCardProps {
  event: WeddingEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const handleAddToCalendar = () => {
    downloadIcsFile(event);
  };

  return (
    <div className="flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-surface border border-borderLight shadow-[0_6px_30px_rgba(140,20,37,0.06)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      {/* Category Ribbon */}
      <div className="flex justify-between items-start mb-6">
        <span className="px-3.5 py-1 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-xs font-semibold tracking-wider uppercase">
          {event.category === "sg" ? "Nhà Trai (TP.HCM)" : "Nhà Gái (Lâm Đồng)"}
        </span>
        <span className="text-xs text-textMuted font-sans">
          {event.subtitle || "Sự kiện"}
        </span>
      </div>

      {/* Main Info */}
      <div className="space-y-4 mb-8 text-left">
        <h3 className="font-playfair text-2xl sm:text-3xl text-textMain font-normal tracking-wide">
          {event.title}
        </h3>

        <div className="space-y-2.5 text-sm text-textMuted font-sans pt-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#8C1425] flex-shrink-0" />
            <span className="font-medium text-textMain">{event.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#8C1425] flex-shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#8C1425] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-textMain">{event.venue}</p>
              <p className="text-xs text-textMuted mt-0.5">{event.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (Maps & Calendar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-borderLight">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[44px]"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Chỉ Đường</span>
        </a>

        <button
          onClick={handleAddToCalendar}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white hover:bg-[#8C1425]/5 text-[#8C1425] border border-[#8C1425]/30 font-sans text-xs font-semibold tracking-wider uppercase transition-all active:scale-95 min-h-[44px]"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-[#8C1425]" />
          <span>Lưu Vào Lịch</span>
        </button>
      </div>
    </div>
  );
};
