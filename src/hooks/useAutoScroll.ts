"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface AutoScrollOptions {
  enabled: boolean;
  speed?: number; // Pixels per second (default: 48 - optimal reading pace)
  initialDelay?: number; // Delay in ms before first scroll (default: 3600ms = curtain animation + reading hero)
  resumeDelay?: number; // Delay in ms to resume scroll after user interaction stops (default: 8000ms = 8s)
}

export interface AutoScrollReturn {
  isAutoScrolling: boolean;
  isPausedByUser: boolean;
  toggleAutoScroll: () => void;
  pauseAutoScroll: () => void;
  resumeAutoScroll: () => void;
}

/**
 * Enhanced Cinema Auto-Scroll Hook for Mobile (iPhone iOS Safari & Android) and Desktop:
 * - Sub-pixel virtual position accumulator prevents WebKit integer truncation stutter on iPhone ProMotion (120Hz)
 * - Seamless gesture detection with iOS momentum & inertial scrolling sync
 * - Automatically halts when typing into inputs / textareas (virtual keyboard on iPhone)
 * - Pauses when modal / photo lightbox is active
 * - Handles iPhone tab switching / screen locking via Visibility API
 * - Provides pause/resume state and toggle controls for custom UI
 */
export function useAutoScroll({
  enabled,
  speed = 48,
  initialDelay = 3600,
  resumeDelay = 8000,
}: AutoScrollOptions): AutoScrollReturn {
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);

  const isScrollingRef = useRef<boolean>(false);
  const isPausedByUserRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  const isUserTouchingRef = useRef<boolean>(false);

  const rafIdRef = useRef<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const virtualScrollYRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  const isAtBottom = useCallback((): boolean => {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const currentScroll = window.scrollY + window.innerHeight;
    return currentScroll >= scrollHeight - 25;
  }, []);

  const isLightboxOrModalOpen = useCallback((): boolean => {
    if (typeof document === "undefined") return false;
    return (
      !!document.querySelector(".yarl__fullsize") ||
      !!document.querySelector('[role="dialog"]') ||
      !!document.querySelector(".fixed.inset-0.z-50") ||
      document.body.classList.contains("overflow-hidden")
    );
  }, []);

  const isInputOrInteractiveFocused = useCallback((): boolean => {
    if (typeof document === "undefined") return false;
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName.toUpperCase();
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || active.hasAttribute("contenteditable");
  }, []);

  const stopScroll = useCallback(() => {
    isScrollingRef.current = false;
    setIsAutoScrolling(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  const startScroll = useCallback(() => {
    if (
      isScrollingRef.current ||
      isPausedByUserRef.current ||
      isUserTouchingRef.current ||
      isAtBottom() ||
      isLightboxOrModalOpen() ||
      isInputOrInteractiveFocused()
    ) {
      return;
    }

    isScrollingRef.current = true;
    setIsAutoScrolling(true);
    lastTimestampRef.current = null;
    virtualScrollYRef.current = window.scrollY;

    const step = (timestamp: number) => {
      if (!isScrollingRef.current) return;

      if (
        isPausedByUserRef.current ||
        isUserTouchingRef.current ||
        isAtBottom() ||
        isLightboxOrModalOpen() ||
        isInputOrInteractiveFocused()
      ) {
        stopScroll();
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      // Delta in seconds, clamped to max 50ms to prevent jumping on frame drops
      const delta = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
      lastTimestampRef.current = timestamp;

      // Increment virtual position
      virtualScrollYRef.current += speed * delta;

      // Resync virtual position if drift between real window.scrollY and virtual is significant
      if (Math.abs(window.scrollY - virtualScrollYRef.current) > 10) {
        virtualScrollYRef.current = window.scrollY;
      }

      isProgrammaticScrollRef.current = true;

      // Ultra-smooth native scroll execution on iOS Safari & modern mobile
      window.scrollTo({
        top: virtualScrollYRef.current,
        behavior: "instant",
      });

      // Reset programmatic flag in next tick
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [isAtBottom, isLightboxOrModalOpen, isInputOrInteractiveFocused, speed, stopScroll]);

  const scheduleResume = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (isPausedByUserRef.current) return;

    idleTimerRef.current = setTimeout(() => {
      if (
        !isPausedByUserRef.current &&
        !isUserTouchingRef.current &&
        !isAtBottom() &&
        !isLightboxOrModalOpen() &&
        !isInputOrInteractiveFocused()
      ) {
        startScroll();
      }
    }, resumeDelay);
  }, [resumeDelay, isAtBottom, isLightboxOrModalOpen, isInputOrInteractiveFocused, startScroll]);

  const pauseAutoScroll = useCallback(() => {
    isPausedByUserRef.current = true;
    setIsPausedByUser(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    stopScroll();
  }, [stopScroll]);

  const resumeAutoScroll = useCallback(() => {
    isPausedByUserRef.current = false;
    setIsPausedByUser(false);
    startScroll();
  }, [startScroll]);

  const toggleAutoScroll = useCallback(() => {
    if (isScrollingRef.current) {
      pauseAutoScroll();
    } else {
      resumeAutoScroll();
    }
  }, [pauseAutoScroll, resumeAutoScroll]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Handle user physical touches on iPhone / Touch devices
    const handleTouchStart = () => {
      isUserTouchingRef.current = true;
      stopScroll();
    };

    const handleTouchEnd = () => {
      isUserTouchingRef.current = false;
      virtualScrollYRef.current = window.scrollY;
      scheduleResume();
    };

    // Handle user wheel, key or pointer gestures
    const handleUserInteraction = () => {
      if (isProgrammaticScrollRef.current) return;
      virtualScrollYRef.current = window.scrollY;
      stopScroll();
      scheduleResume();
    };

    // Track scroll events not triggered by our auto-scroll (e.g. inertial momentum on iOS)
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      virtualScrollYRef.current = window.scrollY;
      if (isScrollingRef.current) {
        stopScroll();
      }
      scheduleResume();
    };

    // Visibility change (iOS switching apps or screen lock)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopScroll();
      } else {
        lastTimestampRef.current = null;
        virtualScrollYRef.current = window.scrollY;
        scheduleResume();
      }
    };

    // Focus on forms / virtual keyboard
    const handleFocusIn = () => {
      if (isInputOrInteractiveFocused()) {
        stopScroll();
      }
    };

    const handleFocusOut = () => {
      scheduleResume();
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("mousedown", handleUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    // Initial start after invitation opening animation
    const initialTimer = setTimeout(() => {
      isInitializedRef.current = true;
      if (!isPausedByUserRef.current) {
        startScroll();
      }
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      stopScroll();

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);

      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
      window.removeEventListener("pointerdown", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("scroll", handleScroll);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [enabled, initialDelay, isInputOrInteractiveFocused, scheduleResume, startScroll, stopScroll]);

  return {
    isAutoScrolling,
    isPausedByUser,
    toggleAutoScroll,
    pauseAutoScroll,
    resumeAutoScroll,
  };
}
