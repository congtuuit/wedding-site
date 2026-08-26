"use client";

import React from "react";
import { Play, Pause } from "lucide-react";

interface AutoScrollControllerProps {
  isAutoScrolling: boolean;
  isPausedByUser: boolean;
  onToggle: () => void;
}

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({
  isAutoScrolling,
  isPausedByUser,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={isAutoScrolling ? "Tạm dừng tự động cuộn" : "Bật tự động cuộn"}
      aria-label={isAutoScrolling ? "Tạm dừng tự động cuộn" : "Bật tự động cuộn"}
      className={`pointer-events-auto relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer active:scale-95 select-none ${
        isAutoScrolling
          ? "bg-white/90 border-amber-400/80 text-[#8C1425] shadow-[0_2px_14px_rgba(212,175,55,0.35)] opacity-90 hover:opacity-100 hover:scale-105"
          : "bg-white/75 border-white/50 text-textMuted shadow-[0_2px_10px_rgba(0,0,0,0.08)] opacity-75 hover:opacity-100 hover:bg-white/90 hover:text-textMain hover:scale-105"
      }`}
    >
      {isAutoScrolling ? (
        <div className="relative flex items-center justify-center">
          {/* Pause Icon */}
          <Pause className="w-4.5 h-4.5 text-[#8C1425] fill-[#8C1425]/20 animate-pulse-slow" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <Play className="w-4.5 h-4.5 text-textMuted ml-0.5" />
        </div>
      )}
    </button>
  );
};
