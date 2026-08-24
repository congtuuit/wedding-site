"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, Image as ImageIcon, Send, Gift } from "lucide-react";

export const BottomNavigation: React.FC = () => {
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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 animate-fade-up">
      {/* Outer Neon Glow Wrapper */}
      <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#801424] via-accentGold to-[#801424] shadow-[0_0_20px_rgba(128,20,36,0.35),_0_0_35px_rgba(212,175,55,0.25),_0_10px_30px_rgba(0,0,0,0.15)] max-w-md mx-auto">
        <div className="flex items-center justify-around py-2.5 px-3 rounded-full bg-white/95 backdrop-blur-2xl text-textMain">
          <button
            onClick={() => scrollToSection("invitation")}
            className="flex flex-col items-center justify-center p-1.5 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <Mail className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Thư Mời</span>
          </button>

          <button
            onClick={() => scrollToSection("events")}
            className="flex flex-col items-center justify-center p-1.5 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <Calendar className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Sự Kiện</span>
          </button>

          <button
            onClick={() => scrollToSection("gallery")}
            className="flex flex-col items-center justify-center p-1.5 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(128,20,36,0.6)] transition-all min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Album</span>
          </button>

          <button
            onClick={() => scrollToSection("rsvp")}
            className="flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full bg-gradient-to-r from-accent to-[#5A0D18] text-white font-semibold hover:brightness-110 transition-all min-w-[44px] min-h-[44px] shadow-[0_0_15px_rgba(128,20,36,0.55)] cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4 mb-0.5 fill-white" />
            <span className="text-[10px] font-sans font-bold tracking-wider">RSVP</span>
          </button>

          <button
            onClick={() => scrollToSection("gift")}
            className="flex flex-col items-center justify-center p-1.5 text-textMain/85 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(108,127,93,0.6)] transition-all min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <Gift className="w-4 h-4 mb-0.5 text-textMain" />
            <span className="text-[10px] font-sans font-medium">Mừng Cưới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
