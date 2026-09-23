"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  inline?: boolean;
  onScrollToTop?: () => void;
  visible?: boolean;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  inline = false,
  onScrollToTop,
  visible,
}) => {
  const [internalVisible, setInternalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visible !== undefined) return;

    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setInternalVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [visible]);

  const isVisible = visible !== undefined ? visible : internalVisible;

  const scrollToTop = () => {
    // 1. Dừng auto-scroll ngay lập tức để không bị đè vị trí cuộn
    onScrollToTop?.();

    // 2. Chờ 1 frame đảm bảo auto-scroll loop đã dừng hẳn rồi mới scroll mượt
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const buttonEl = (
    <button
      type="button"
      onClick={scrollToTop}
      title="Cuộn về đầu trang"
      aria-label="Cuộn về đầu trang"
      className="pointer-events-auto relative flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 min-w-[38px] min-h-[38px] rounded-full bg-[#8C1425]/90 hover:bg-[#8C1425] backdrop-blur-md text-[#FFFDF9] border border-amber-300/50 shadow-[0_3px_14px_rgba(140,20,37,0.35)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer select-none group"
    >
      <ArrowUp className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );

  if (inline) {
    return buttonEl;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-22 inset-x-0 z-40 pointer-events-none flex justify-center px-3.5">
      <div className="w-full max-w-[480px] flex justify-end">
        {buttonEl}
      </div>
    </div>
  );
};
