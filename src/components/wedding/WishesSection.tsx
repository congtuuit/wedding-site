"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { WishData, getWishes, fetchLiveWishes, addWish } from "@/lib/rsvp";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
  Heart,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
  MessageSquareHeart,
} from "lucide-react";

interface WishesSectionProps {
  initialGuestName: string;
  isPersonalized: boolean;
  webhookUrl?: string;
  stageKey?: "que" | "sg";
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  initialGuestName,
  isPersonalized,
  webhookUrl,
  stageKey = "sg",
}) => {
  const isVuQuy = stageKey === "que";
  const coupleShortName = isVuQuy ? "Hường & Tú" : "Tú & Hường";

  const [wishes, setWishes] = useState<WishData[]>([]);
  const [senderName, setSenderName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(true);

  // Cinema Horizontal Auto-Scroll State
  const isScrollingRef = useRef<boolean>(false);
  const isUserTouchingRef = useRef<boolean>(false);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const virtualScrollXRef = useRef<number>(0);

  // IntersectionObserver: Pause when completely out of viewport
  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: "250px 0px 250px 0px",
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setWishes(getWishes());

    if (webhookUrl) {
      fetchLiveWishes(webhookUrl).then((live) => {
        if (live && live.length > 0) {
          setWishes(live);
        }
      });
    }

    if (isPersonalized && initialGuestName) {
      setSenderName(initialGuestName);
    }
  }, [initialGuestName, isPersonalized, webhookUrl]);

  // Triple set for seamless infinite horizontal loop
  const displayWishes = useMemo(() => {
    if (wishes.length === 0) return [];
    if (wishes.length < 4) {
      return [...wishes, ...wishes, ...wishes, ...wishes, ...wishes, ...wishes];
    }
    return [...wishes, ...wishes, ...wishes];
  }, [wishes]);

  // Stop horizontal auto-scroll
  const stopScroll = useCallback(() => {
    isScrollingRef.current = false;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  // Cinema continuous horizontal scroll loop (exact engine as page useAutoScroll)
  const startScroll = useCallback(() => {
    const container = carouselRef.current;
    if (
      !container ||
      isScrollingRef.current ||
      isUserTouchingRef.current ||
      wishes.length === 0 ||
      !isInView
    ) {
      return;
    }

    isScrollingRef.current = true;
    lastTimestampRef.current = null;
    virtualScrollXRef.current = container.scrollLeft;

    const speed = 40; // 40px/second smooth cinema reading drift

    const step = (timestamp: number) => {
      if (!isScrollingRef.current || !container || isUserTouchingRef.current || !isInView) {
        stopScroll();
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      // Delta time with 50ms clamp to prevent frame drop jumps
      const delta = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
      lastTimestampRef.current = timestamp;

      // Increment subpixel virtual position
      virtualScrollXRef.current += speed * delta;

      // Resync if manual drift occurred
      if (Math.abs(container.scrollLeft - virtualScrollXRef.current) > 20) {
        virtualScrollXRef.current = container.scrollLeft;
      }

      // Seamless wrap-around at 1/3 point
      const oneThirdWidth = container.scrollWidth / 3;
      if (oneThirdWidth > 0 && virtualScrollXRef.current >= oneThirdWidth) {
        virtualScrollXRef.current -= oneThirdWidth;
      }

      isProgrammaticScrollRef.current = true;
      container.scrollLeft = virtualScrollXRef.current;

      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [isInView, stopScroll, wishes.length]);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      if (!isUserTouchingRef.current && isInView) {
        startScroll();
      }
    }, 2500);
  }, [isInView, startScroll]);

  // Activate Cinema Horizontal Auto-Scroll
  useEffect(() => {
    if (isInView && wishes.length > 0) {
      startScroll();
    } else {
      stopScroll();
    }

    return () => {
      stopScroll();
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [isInView, startScroll, stopScroll, wishes.length]);

  // Touch and interaction listeners for the carousel container
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleTouchStart = () => {
      isUserTouchingRef.current = true;
      stopScroll();
    };

    const handleTouchEnd = () => {
      isUserTouchingRef.current = false;
      virtualScrollXRef.current = container.scrollLeft;
      scheduleResume();
    };

    const handleUserInteraction = () => {
      if (isProgrammaticScrollRef.current) return;
      virtualScrollXRef.current = container.scrollLeft;
      stopScroll();
      scheduleResume();
    };

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      virtualScrollXRef.current = container.scrollLeft;
      if (isScrollingRef.current) {
        stopScroll();
      }
      scheduleResume();
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    container.addEventListener("wheel", handleUserInteraction, { passive: true });
    container.addEventListener("mousedown", handleTouchStart, { passive: true });
    container.addEventListener("mouseup", handleTouchEnd, { passive: true });
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);

      container.removeEventListener("wheel", handleUserInteraction);
      container.removeEventListener("mousedown", handleTouchStart);
      container.removeEventListener("mouseup", handleTouchEnd);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scheduleResume, stopScroll]);

  // Prev / Next button steps
  const handlePrev = () => {
    const container = carouselRef.current;
    if (!container) return;
    stopScroll();
    container.scrollBy({ left: -295, behavior: "smooth" });
    scheduleResume();
  };

  const handleNext = () => {
    const container = carouselRef.current;
    if (!container) return;
    stopScroll();
    container.scrollBy({ left: 295, behavior: "smooth" });
    scheduleResume();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const newWish = await addWish(
      {
        senderName: senderName.trim() || "Khách quý",
        content: content.trim(),
      },
      webhookUrl
    );

    setWishes((prev) => [newWish, ...prev]);
    setContent("");
    setIsSubmitting(false);
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 4000);

    // Scroll to start
    if (carouselRef.current) {
      virtualScrollXRef.current = 0;
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="wishes"
      ref={sectionRef}
      className="w-full py-20 px-4 bg-surface text-textMain relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold flex items-center justify-center gap-1.5">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Sổ Lưu Bút</span>
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1.5">
          Gửi Lời Chúc Phúc
        </h2>
        <p className="text-xs text-textMuted font-sans max-w-md mx-auto mt-1.5">
          Từng lời chúc của bạn là món quà ý nghĩa nhất cho ngày trọng đại của {coupleShortName}
        </p>

        <SectionDivider variant="botanical" className="my-4" />

        {/* Submit Wish Form Box */}
        <div className="max-w-xl mx-auto mt-8 p-6 sm:p-8 rounded-3xl bg-background border border-borderLight shadow-sm text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-textMuted mb-1.5">
                Tên của bạn
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-textMuted mb-1.5">
                Lời chúc gửi tới {coupleShortName}
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết lời chúc thân thương tại đây..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {showSuccessBadge ? (
                <span className="text-xs text-accent font-sans flex items-center gap-1.5 animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">Đã gửi lời chúc thành công!</span>
                </span>
              ) : (
                <span className="text-[11px] text-textMuted font-sans">
                  Lời chúc sẽ hiển thị ngay bên dưới
                </span>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 min-h-[44px] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cinema Continuous Auto-Scroll Carousel */}
        {wishes.length > 0 && (
          <div className="relative mt-12 w-full max-w-2xl mx-auto">
            {/* Title & Arrow Controls */}
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-heading font-semibold text-textMain flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-accent fill-accent" />
                <span>Lời Chúc Mừng ({wishes.length})</span>
              </span>

              {/* Navigation Nudge Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Lời chúc trước"
                  className="w-8 h-8 rounded-full bg-background border border-borderLight hover:border-accent/50 text-textMuted hover:text-textMain flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Lời chúc kế tiếp"
                  className="w-8 h-8 rounded-full bg-background border border-borderLight hover:border-accent/50 text-textMuted hover:text-textMain flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gradient Edge Fade Masks */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-surface via-surface/85 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-surface via-surface/85 to-transparent z-10 pointer-events-none" />

              {/* Continuous Auto-Scrolling Track */}
              <div
                ref={carouselRef}
                style={{ willChange: "scroll-position", transform: "translateZ(0)" }}
                className="flex gap-4 overflow-x-auto no-scrollbar py-3 px-4 select-none touch-pan-x cursor-grab active:cursor-grabbing"
              >
                {displayWishes.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="min-w-[275px] max-w-[290px] sm:min-w-[310px] p-5 rounded-2xl bg-background border border-borderLight/90 hover:border-accent/50 shadow-sm hover:shadow-md transition-all duration-300 relative space-y-2.5 shrink-0 select-none text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FCECEE] text-accent flex items-center justify-center text-xs font-heading font-bold border border-accent/20">
                          {item.senderName ? item.senderName.charAt(0).toUpperCase() : "K"}
                        </div>
                        <p className="font-heading text-sm text-textMain font-semibold tracking-wide truncate max-w-[170px]">
                          {item.senderName}
                        </p>
                      </div>
                      <Quote className="w-4 h-4 text-accent/30 flex-shrink-0 group-hover:text-accent/60 transition-colors" />
                    </div>

                    <p className="font-sans text-xs sm:text-[13px] text-textMuted leading-relaxed line-clamp-4 italic">
                      "{item.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint for interaction */}
            <p className="text-[10px] text-textMuted/70 font-sans tracking-wide mt-2.5 text-center">
              ✦ Tự động cuộn lướt êm ái • Chạm hoặc vuốt tay để dừng đọc ✦
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
