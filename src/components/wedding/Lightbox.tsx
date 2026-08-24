"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/types/wedding";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex]);

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % photos.length;
    onNavigate(nextIdx);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-fade-in"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Bar: Counter & Close */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 text-white">
        <span className="text-xs sm:text-sm font-sans tracking-widest font-light text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </span>

        <button
          onClick={onClose}
          aria-label="Đóng"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-[80vh] max-w-5xl px-4 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={currentPhoto.src}
            alt={currentPhoto.alt || "Ảnh cưới"}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Photo Caption */}
      {currentPhoto.title && (
        <div className="absolute bottom-6 left-4 right-4 text-center z-50 pointer-events-none">
          <p className="font-serif text-sm sm:text-base text-white/90 tracking-wider">
            {currentPhoto.title}
          </p>
        </div>
      )}

      {/* Prev / Next Buttons */}
      <button
        onClick={handlePrev}
        aria-label="Ảnh trước"
        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all min-w-[44px] min-h-[44px]"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Ảnh kế tiếp"
        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all min-w-[44px] min-h-[44px]"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
