"use client";

import React from "react";
import { WeddingEvent } from "@/types/wedding";
import { MapPin, Calendar, Navigation } from "lucide-react";

interface EventCardProps {
  event: WeddingEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const hasTimeslots = event.timeslots && event.timeslots.length > 0;

  // Các timeslot có cùng venue với địa điểm chính → không lặp lại địa chỉ trong từng mốc
  // Chỉ hiển thị venue trong timeslot nếu KHÁC event.venue
  const mainVenueMapUrl = event.mapUrl;

  return (
    <div className="flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-surface border border-borderLight shadow-[0_6px_30px_rgba(140,20,37,0.06)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      {/* Category Ribbon */}
      <div className="flex items-start mb-6">
        <span className="px-3.5 py-1 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-xs font-semibold tracking-wider uppercase">
          {event.category === "sg" ? "Nhà Trai (TP.HCM)" : "Nhà Gái (Lâm Đồng)"}
          {event.subtitle && (
            <span className="font-normal normal-case tracking-normal opacity-70 ml-1.5">
              · {event.subtitle}
            </span>
          )}
        </span>
      </div>

      {/* Main Info */}
      <div className="space-y-4 mb-8 text-left">
        <h3 className="font-playfair text-2xl sm:text-3xl text-textMain font-normal tracking-wide">
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-3 text-sm text-textMuted font-sans pt-1">
          <Calendar className="w-4 h-4 text-[#8C1425] flex-shrink-0" />
          <span className="font-medium text-textMain">{event.date}</span>
        </div>

        {/* Timeslots Timeline */}
        {hasTimeslots ? (
          <div className="pt-1 space-y-0">
            {event.timeslots!.map((slot, idx) => {
              const isLast = idx === event.timeslots!.length - 1;
              // Chỉ hiện địa điểm nếu khác venue chính
              const isDifferentVenue = slot.venue && slot.venue !== event.venue;

              return (
                <div key={idx} className="flex gap-4">
                  {/* Timeline dot & line */}
                  <div className="flex flex-col items-center flex-shrink-0 w-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8C1425] border-2 border-[#8C1425]/30 mt-0.5 flex-shrink-0" />
                    {!isLast && (
                      <div className="w-px flex-1 bg-[#8C1425]/20 my-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#8C1425] font-sans tracking-wide">
                        {slot.time}
                      </span>
                      <span className="text-xs font-semibold text-textMain font-sans">
                        — {slot.label}
                      </span>
                    </div>

                    {/* Chỉ hiện venue nếu KHÁC địa điểm chính */}
                    {isDifferentVenue && (
                      <div className="flex items-start gap-1.5 text-xs text-textMuted font-sans">
                        <MapPin className="w-3 h-3 text-[#8C1425]/60 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-textMain/80">{slot.venue}</span>
                          {slot.address && (
                            <span className="text-textMuted"> — {slot.address}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Chỉ hiện nút chỉ đường riêng nếu KHÁC mapUrl chính */}
                    {isDifferentVenue && slot.mapUrl && slot.mapUrl !== mainVenueMapUrl && (
                      <a
                        href={slot.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-[#8C1425] hover:underline font-sans tracking-wide"
                      >
                        <Navigation className="w-2.5 h-2.5" />
                        Chỉ Đường
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback khi không có timeslots */
          <div className="flex items-start gap-3 text-sm text-textMuted font-sans">
            <MapPin className="w-4 h-4 text-[#8C1425] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-textMain">{event.venue}</p>
              <p className="text-xs text-textMuted mt-0.5">{event.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Địa điểm chính + Chỉ Đường — luôn hiện 1 lần ở dưới */}
      <div className="pt-4 border-t border-borderLight space-y-3">
        <div className="flex items-start gap-2 text-xs text-textMuted font-sans">
          <MapPin className="w-3.5 h-3.5 text-[#8C1425] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-textMain">{event.venue}</span>
            <span className="text-textMuted"> — {event.address}</span>
          </div>
        </div>
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[44px]"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Chỉ Đường (Google Maps)</span>
        </a>
      </div>
    </div>
  );
};
