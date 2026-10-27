"use client";

import React from "react";
import { useLocale, LocaleType } from "@/context/LocaleContext";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = "" }) => {
  const { locale, setLocale } = useLocale();

  const handleSwitch = (target: LocaleType) => {
    if (target === locale) return;

    if (setLocale) {
      setLocale(target);
    }

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (target === "jp") {
        url.searchParams.set("lang", "jp");
      } else {
        url.searchParams.delete("lang");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div
      role="group"
      aria-label="Language Switcher"
      className={`inline-flex items-center gap-0.5 p-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg select-none transition-all duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={() => handleSwitch("vi")}
        aria-pressed={locale === "vi"}
        aria-label="Chuyển sang Tiếng Việt"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] tracking-wider transition-all duration-200 ${
          locale === "vi"
            ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5C0A15] font-bold shadow-sm"
            : "text-[#F5E6D3]/70 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="text-xs leading-none">🇻🇳</span>
        <span>VI</span>
      </button>

      <button
        type="button"
        onClick={() => handleSwitch("jp")}
        aria-pressed={locale === "jp"}
        aria-label="日本語に切り替え"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] tracking-wider transition-all duration-200 ${
          locale === "jp"
            ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#5C0A15] font-bold shadow-sm"
            : "text-[#F5E6D3]/70 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="text-xs leading-none">🇯🇵</span>
        <span>JP</span>
      </button>
    </div>
  );
};
