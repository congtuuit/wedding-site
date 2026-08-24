"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 450);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn về đầu trang"
      className={`fixed z-40 right-3.5 sm:right-6 bottom-24 sm:bottom-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8C1425]/90 hover:bg-[#8C1425] backdrop-blur-md text-[#FFFDF9] border border-amber-300/50 shadow-[0_4px_18px_rgba(140,20,37,0.35)] flex items-center justify-center transition-all duration-400 ease-out hover:scale-110 active:scale-90 cursor-pointer group ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};
