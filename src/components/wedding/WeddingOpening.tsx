"use client";

import React, { useState, useEffect } from "react";
import { CoupleInfo } from "@/types/wedding";
import { Mail, Sparkles, Heart } from "lucide-react";

interface WeddingOpeningProps {
  couple: CoupleInfo;
  guestName: string;
  isPersonalized: boolean;
  onOpen: () => void;
  weddingDateFormatted?: string;
  ceremonyBadge?: string;
}

// 1. Outer ambient constellation around the card (~12 glowing star points)
const OUTER_SPARKLES = [
  { id: 1, top: "5%", left: "8%", size: 18, delay: "0s", duration: "3.2s", symbol: "✦" },
  { id: 2, top: "7%", right: "9%", size: 22, delay: "1.2s", duration: "3.6s", symbol: "✨" },
  { id: 3, top: "18%", left: "16%", size: 14, delay: "0.5s", duration: "2.8s", symbol: "✧" },
  { id: 4, top: "20%", right: "15%", size: 16, delay: "2.0s", duration: "3.2s", symbol: "⋆" },
  { id: 5, top: "42%", left: "5%", size: 18, delay: "1.7s", duration: "3.5s", symbol: "✨" },
  { id: 6, top: "46%", right: "6%", size: 16, delay: "0.8s", duration: "3.0s", symbol: "✦" },
  { id: 7, top: "68%", left: "7%", size: 15, delay: "2.4s", duration: "2.9s", symbol: "✧" },
  { id: 8, top: "72%", right: "8%", size: 19, delay: "1.1s", duration: "3.8s", symbol: "✨" },
  { id: 9, bottom: "16%", left: "12%", size: 16, delay: "2.2s", duration: "3.4s", symbol: "⋆" },
  { id: 10, bottom: "14%", right: "13%", size: 17, delay: "0.4s", duration: "3.6s", symbol: "✨" },
  { id: 11, bottom: "6%", left: "22%", size: 13, delay: "1.5s", duration: "2.7s", symbol: "✧" },
  { id: 12, bottom: "5%", right: "24%", size: 15, delay: "0.9s", duration: "3.2s", symbol: "✦" },
];

// 2. Inner card sparkles on the velvet surface (~8 accent stars)
const INNER_SPARKLES = [
  { id: "i1", top: "14px", left: "14px", size: 15, delay: "0s", duration: "2.5s", symbol: "✦" },
  { id: "i2", top: "14px", right: "14px", size: 15, delay: "1s", duration: "2.7s", symbol: "✦" },
  { id: "i3", bottom: "14px", left: "14px", size: 15, delay: "1.5s", duration: "2.9s", symbol: "✦" },
  { id: "i4", bottom: "14px", right: "14px", size: 15, delay: "2s", duration: "3.1s", symbol: "✦" },
  { id: "i5", top: "40px", left: "42px", size: 12, delay: "0.4s", duration: "3.0s", symbol: "✨" },
  { id: "i6", top: "42px", right: "42px", size: 13, delay: "1.8s", duration: "3.3s", symbol: "✧" },
  { id: "i7", top: "220px", left: "20px", size: 12, delay: "0.7s", duration: "3.0s", symbol: "⋆" },
  { id: "i8", top: "224px", right: "20px", size: 13, delay: "1.6s", duration: "3.2s", symbol: "✨" },
];

export const WeddingOpening: React.FC<WeddingOpeningProps> = ({
  couple,
  guestName,
  isPersonalized,
  onOpen,
  weddingDateFormatted,
  ceremonyBadge,
}) => {
  const [phase, setPhase] = useState<"idle" | "loading" | "splitting" | "dismissed">("idle");
  const [progress, setProgress] = useState<number>(0);

  const displayDate = weddingDateFormatted || couple.weddingDateFormatted;
  const displayBadge = ceremonyBadge || "Wedding Invitation";

  // Lock body scroll and guarantee top scroll position while opening screen is active
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    if (phase !== "dismissed") {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [phase]);

  // Handle click to trigger progress bar loading
  const handleOpenClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    setPhase("loading");
    setProgress(0);

    // Smooth, graceful ~2.0s loading progression
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 3; // step 3% - 7%
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);

        // Pause briefly on 100% then trigger split
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
          }
          setPhase("splitting");
          onOpen();
          document.body.style.overflow = "unset";

          // Fully dismiss after split transition finishes
          setTimeout(() => {
            setPhase("dismissed");
          }, 2300);
        }, 400);
      } else {
        setProgress(current);
      }
    }, 70);
  };

  if (phase === "dismissed") return null;

  const isSplitting = phase === "splitting";

  return (
    <div className="fixed inset-0 z-50 select-none pointer-events-auto overflow-hidden">
      {/* ================= TOP CURTAIN ================= */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-[#170205] z-50 transition-transform duration-[2200ms] ease-[cubic-bezier(0.7,0,0.2,1)] flex flex-col justify-end items-center overflow-hidden ${
          isSplitting ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(180,28,50,0.35)_0%,_transparent_75%)] pointer-events-none" />
        
        {/* Horizontal Split Seam Glow Line at Bottom of Top Curtain */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FDF0CD] to-transparent shadow-[0_0_15px_#D4AF37]" />
      </div>

      {/* ================= BOTTOM CURTAIN ================= */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-[#170205] z-50 transition-transform duration-[2200ms] ease-[cubic-bezier(0.7,0,0.2,1)] flex flex-col justify-start items-center overflow-hidden ${
          isSplitting ? "translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Ambient Bottom Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,28,50,0.35)_0%,_transparent_75%)] pointer-events-none" />
        
        {/* Horizontal Split Seam Glow Line at Top of Bottom Curtain */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FDF0CD] to-transparent shadow-[0_0_15px_#D4AF37]" />
      </div>

      {/* ================= MAIN CONTENT CARD (FADES ON SPLIT) ================= */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center px-4 py-6 transition-all duration-1000 ${
          isSplitting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* 1. Outer Twinkling Golden Dust & Star Sparkles Constellation */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {OUTER_SPARKLES.map((sp) => (
            <div
              key={sp.id}
              className="absolute text-[#FDF0CD] drop-shadow-[0_0_10px_rgba(253,240,205,0.9)] pointer-events-none select-none animate-twinkle"
              style={{
                top: sp.top,
                bottom: sp.bottom,
                left: sp.left,
                right: sp.right,
                fontSize: `${sp.size}px`,
                animationDelay: sp.delay,
                animationDuration: sp.duration,
              }}
            >
              {sp.symbol}
            </div>
          ))}
        </div>

        {/* 2. Luxury Royal Ruby & Gold Foil Envelope Card */}
        <div className="relative w-full max-w-[400px] mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#8C1425] via-[#660C1B] to-[#42060F] border border-amber-300/60 shadow-[0_20px_60px_rgba(0,0,0,0.7),_0_0_35px_rgba(212,175,55,0.3)] z-30 text-center overflow-hidden">
          {/* Continuous Soft Silk Shimmer Sheen across Card */}
          <div className="absolute inset-0 -translate-x-[200%] animate-card-shimmer bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

          {/* Inner Card Sparkles (Accent star constellation on velvet) */}
          {INNER_SPARKLES.map((sp) => (
            <div
              key={sp.id}
              className="absolute text-amber-200/80 drop-shadow-[0_0_6px_rgba(253,240,205,0.8)] pointer-events-none select-none animate-twinkle"
              style={{
                top: sp.top,
                bottom: sp.bottom,
                left: sp.left,
                right: sp.right,
                fontSize: `${sp.size}px`,
                animationDelay: sp.delay,
                animationDuration: sp.duration,
              }}
            >
              {sp.symbol}
            </div>
          ))}

          {/* Top Royal Wax Seal Monogram Emblem */}
          <div className="flex flex-col items-center justify-center mb-4 relative z-10">
            <div className="w-[54px] h-[54px] rounded-full border-2 border-amber-300/80 bg-gradient-to-b from-[#A8192E] to-[#590B17] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] relative mb-2.5">
              <span className="font-playfair text-amber-200 font-semibold text-sm tracking-widest drop-shadow">
                {couple.initials}
              </span>
              <div className="absolute -inset-1.5 rounded-full border border-amber-300/30 animate-pulse-slow pointer-events-none" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-amber-300/45 text-amber-200 text-[10px] uppercase tracking-[0.25em] font-sans shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
              <span>{displayBadge}</span>
            </div>
          </div>

          {/* Wedding Date */}
          <div className="flex items-center justify-center gap-2 text-amber-200/90 mb-4 relative z-10">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-300/60" />
            <p className="font-sans text-[11px] sm:text-xs tracking-[0.3em] uppercase font-medium">
              {displayDate}
            </p>
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-300/60" />
          </div>

          {/* Couple Names in Romantic, Graceful Script */}
          <div className="space-y-0.5 my-3 relative z-10">
            <h1 className="font-couple text-4xl sm:text-5xl text-[#FFFDF9] font-normal tracking-wide drop-shadow-md">
              {couple.groom.name}
            </h1>
            
            <div className="flex items-center justify-center gap-3 my-0">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <span className="font-couple text-3xl text-amber-300 leading-none">
                &
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>

            <h1 className="font-couple text-4xl sm:text-5xl text-[#FFFDF9] font-normal tracking-wide drop-shadow-md">
              {couple.bride.name}
            </h1>
          </div>

          {/* Personalized Guest Badge Frame */}
          <div className="my-5 p-3.5 rounded-2xl bg-black/25 backdrop-blur-sm border border-amber-300/40 relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-10">
            <p className="text-[10px] sm:text-[11px] text-[#FADBD8] font-sans tracking-[0.2em] uppercase mb-1 font-medium">
              {isPersonalized ? "Trân trọng kính mời" : "Thân gửi lời mời tới"}
            </p>
            <p className="font-playfair text-xl sm:text-2xl text-amber-200 font-medium tracking-wide drop-shadow-sm">
              {guestName}
            </p>
          </div>

          {/* Action Section: Button OR Game-Style Loading Bar */}
          <div className="pt-1 relative z-20 min-h-[58px] flex items-center justify-center">
            {phase === "idle" ? (
              <button
                type="button"
                onClick={handleOpenClick}
                className="group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3CC] to-[#C59B27] text-[#3D0A12] font-sans font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_6px_25px_rgba(212,175,55,0.5),_0_0_20px_rgba(253,240,205,0.3)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.7),_0_0_30px_rgba(253,240,205,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[50px] cursor-pointer overflow-hidden pointer-events-auto"
              >
                {/* Button Shimmer Ray */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full animate-shimmer-fast transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <Mail className="w-4 h-4 text-[#3D0A12] transition-transform group-hover:-translate-y-0.5 pointer-events-none" />
                <span className="pointer-events-none font-bold tracking-wider">MỞ THIỆP CƯỚI</span>
                <Heart className="w-3.5 h-3.5 fill-[#3D0A12] text-[#3D0A12] pointer-events-none animate-pulse" />
              </button>
            ) : (
              /* Game-Like Luxury Loading Bar */
              <div className="w-full space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-sans text-amber-200">
                  <span className="flex items-center gap-1.5 font-medium tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                    Đang mở thiệp cưới...
                  </span>
                  <span className="font-bold text-accentGold font-mono text-sm">{progress}%</span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-3 rounded-full bg-black/50 p-0.5 border border-amber-300/40 shadow-inner overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C59B27] via-[#FFF0B8] to-[#D4AF37] shadow-[0_0_12px_#D4AF37] transition-all duration-100 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer inside progress bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-[11px] text-amber-100/75 tracking-wider font-sans relative z-10">
            {phase === "loading"
              ? "Giai điệu hạnh phúc đang chuẩn bị cất lên..."
              : "Chạm để mở thiệp & lắng nghe giai điệu hạnh phúc"}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.7) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.25) rotate(15deg);
            filter: drop-shadow(0 0 8px rgba(253, 240, 205, 0.9));
          }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        @keyframes cardShimmer {
          0% {
            transform: translateX(-150%) rotate(25deg);
          }
          30% {
            transform: translateX(250%) rotate(25deg);
          }
          100% {
            transform: translateX(250%) rotate(25deg);
          }
        }
        .animate-card-shimmer {
          animation: cardShimmer 6s infinite ease-in-out;
        }
        @keyframes shimmerFast {
          0% {
            transform: translateX(-150%);
          }
          50%, 100% {
            transform: translateX(150%);
          }
        }
        .animate-shimmer-fast {
          animation: shimmerFast 3.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
