"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-22 inset-x-0 z-40 pointer-events-none flex justify-center px-3.5">
      <div className="w-full max-w-[480px] flex justify-end">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn về đầu trang"
          className={`pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8C1425]/90 hover:bg-[#8C1425] backdrop-blur-md text-[#FFFDF9] border border-amber-300/50 shadow-[0_4px_18px_rgba(140,20,37,0.35)] flex items-center justify-center transition-all duration-400 ease-out hover:scale-110 active:scale-90 cursor-pointer group ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <ArrowUp className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
