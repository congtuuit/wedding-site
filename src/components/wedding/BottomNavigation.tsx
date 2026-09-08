"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, Image as ImageIcon, Send, Gift } from "lucide-react";

interface BottomNavigationProps {
  onNavigate?: () => void; // Gọi trước khi scroll (dừng auto-scroll)
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Dừng auto-scroll TRƯỚC để tránh xung đột với scrollIntoView
    onNavigate?.();

    // Dùng requestAnimationFrame để đảm bảo auto-scroll đã dừng hẳn trước khi scroll
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 pointer-events-none flex justify-center px-3">
      {/* Outer Neon Glow Wrapper (Centered, Interactive) */}
      <div className="pointer-events-auto w-full max-w-[440px] p-[1.5px] rounded-full bg-gradient-to-r from-[#801424] via-accentGold to-[#801424] shadow-[0_0_20px_rgba(128,20,36,0.35),_0_0_35px_rgba(212,175,55,0.25),_0_10px_30px_rgba(0,0,0,0.15)] animate-fade-up">
        <div className="flex items-center justify-around py-2 px-2.5 rounded-full bg-white/95 backdrop-blur-2xl text-textMain">
          <button
            onClick={() => scrollToSection("invitation")}
            className="flex flex-col items-center justify-center p-1 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[40px] min-h-[40px] cursor-pointer"
          >
            <Mail className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Thư Mời</span>
          </button>

          <button
            onClick={() => scrollToSection("events")}
            className="flex flex-col items-center justify-center p-1 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[40px] min-h-[40px] cursor-pointer"
          >
            <Calendar className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Sự Kiện</span>
          </button>

          <button
            onClick={() => scrollToSection("gallery")}
            className="flex flex-col items-center justify-center p-1 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[40px] min-h-[40px] cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Album</span>
          </button>

          <button
            onClick={() => scrollToSection("rsvp")}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-full bg-gradient-to-r from-accent to-[#5A0D18] text-white font-semibold hover:brightness-110 transition-all min-w-[40px] min-h-[40px] shadow-[0_0_15px_rgba(128,20,36,0.55)] cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5 mb-0.5 fill-white" />
            <span className="text-[10px] font-sans font-bold tracking-wider">Xác Nhận</span>
          </button>

          <button
            onClick={() => scrollToSection("gift")}
            className="flex flex-col items-center justify-center p-1 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(108,127,93,0.6)] transition-all min-w-[40px] min-h-[40px] cursor-pointer"
          >
            <Gift className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Mừng Cưới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
