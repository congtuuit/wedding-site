"use client";

import React from "react";
import Image from "next/image";
import { CoupleInfo } from "@/types/wedding";
import { ChevronDown, Calendar, Heart, Sparkles } from "lucide-react";

interface HeroSectionProps {
  couple: CoupleInfo;
  heroPhoto: string;
  isRevealed?: boolean;
  weddingDateFormatted?: string;
  ceremonyName?: string;
  stageKey?: "que" | "sg";
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  couple,
  heroPhoto,
  isRevealed = true,
  weddingDateFormatted,
  ceremonyName,
  stageKey = "sg",
}) => {
  const isVuQuy = stageKey === "que";
  const firstPersonName = isVuQuy ? couple.bride.name : couple.groom.name;
  const secondPersonName = isVuQuy ? couple.groom.name : couple.bride.name;

  const displayDate = weddingDateFormatted || couple.weddingDateFormatted;
  const displayCeremony = ceremonyName || (isVuQuy ? "Lễ Vu Quy" : "Lễ Thành Hôn");
  const scrollToRsvp = () => {
    const el = document.getElementById("rsvp");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNext = () => {
    const el = document.getElementById("family-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between items-center text-center text-white overflow-hidden select-none bg-[#11110F]">
      {/* Background Image with Slow Breathing Zoom */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroPhoto}
          alt={`${firstPersonName} & ${secondPersonName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105 animate-fade-in"
        />
        {/* Editorial Gradients & Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* 1. Top Header Badge with delayed slide-down */}
      <div
        className={`relative z-10 pt-10 sm:pt-14 px-4 transition-all duration-1000 ease-out ${
          isRevealed
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs font-sans tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.25)]">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
          <span>Save The Date</span>
        </div>
      </div>

      {/* 2. Center Couple Identity with Staggered Text Revelations */}
      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto space-y-4">
        {/* Date Display */}
        <div
          className={`flex items-center justify-center gap-3 text-amber-200/90 transition-all duration-1000 ease-out ${
            isRevealed
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <Calendar className="w-4 h-4 text-amber-300" />
          <p className="font-serif text-base sm:text-lg tracking-[0.35em] uppercase font-light drop-shadow">
            {displayDate}
          </p>
        </div>

        {/* Names */}
        <div className="space-y-2">
          {/* First Name with Shimmering Glow */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <h1 className="font-couple text-5xl sm:text-6xl font-normal tracking-wide text-[#FFFDF9] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              {firstPersonName}
            </h1>
          </div>

          {/* Ampersand separator */}
          <div
            className={`flex items-center justify-center gap-4 my-1 transition-all duration-1000 ease-out ${
              isRevealed
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }`}
            style={{ transitionDelay: "1300ms" }}
          >
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            <span className="font-couple text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse-slow">
              &
            </span>
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent via-amber-300/60 to-transparent" />
          </div>

          {/* Second Name with Shimmering Glow */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1600ms" }}
          >
            <h1 className="font-couple text-5xl sm:text-6xl font-normal tracking-wide text-[#FFFDF9] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              {secondPersonName}
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p
          className={`font-sans text-xs sm:text-sm text-white/90 tracking-[0.3em] uppercase pt-2 font-light transition-all duration-1000 ease-out ${
            isRevealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "1900ms" }}
        >
          {displayCeremony}
        </p>

        {/* RSVP Quick Action */}
        <div
          className={`pt-6 transition-all duration-1000 ease-out ${
            isRevealed
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90"
          }`}
          style={{ transitionDelay: "2200ms" }}
        >
          <button
            type="button"
            onClick={scrollToRsvp}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3CC] to-[#C59B27] text-[#3D0A12] font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.65)] hover:scale-105 active:scale-95 min-h-[46px] cursor-pointer overflow-hidden"
          >
            {/* Shimmer on button */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            <Heart className="w-3.5 h-3.5 fill-[#3D0A12] text-[#3D0A12]" />
            <span>Xác Nhận Tham Dự</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Scroll Indicator */}
      <div
        className={`relative z-10 pb-8 px-4 flex flex-col items-center transition-all duration-1000 ease-out ${
          isRevealed ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "2500ms" }}
      >
        <button
          type="button"
          onClick={scrollToNext}
          aria-label="Cuộn xuống xem thiệp"
          className="flex flex-col items-center text-white/75 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase mb-1 font-sans font-light">
            Cuộn xuống
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
