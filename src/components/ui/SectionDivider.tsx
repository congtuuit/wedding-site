import React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "diamond" | "botanical" | "simple";
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  className,
  variant = "botanical",
}) => {
  if (variant === "diamond") {
    return (
      <div className={cn("flex items-center justify-center my-8 opacity-70", className)}>
        <div className="h-[1px] w-12 bg-accentGold/40"></div>
        <div className="mx-3 text-accentGold text-xs rotate-45">✦</div>
        <div className="h-[1px] w-12 bg-accentGold/40"></div>
      </div>
    );
  }

  if (variant === "simple") {
    return (
      <div className={cn("flex items-center justify-center my-6 opacity-50", className)}>
        <div className="h-[1px] w-16 bg-borderLight"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center my-8 text-accent/60 select-none", className)}>
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-accent/30 to-accent/60"></div>
      <div className="mx-3 flex items-center gap-1.5 text-accent">
        <svg
          width="24"
          height="16"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-75"
        >
          <path
            d="M12 0C12 5.5 8 8 2 8C8 8 12 10.5 12 16C12 10.5 16 8 22 8C16 8 12 5.5 12 0Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-accent/30 to-accent/60"></div>
    </div>
  );
};
