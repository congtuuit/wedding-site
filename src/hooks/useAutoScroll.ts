"use client";

import { useEffect, useRef } from "react";

interface AutoScrollOptions {
  enabled: boolean;
  speed?: number; // Pixels per second (default: 50)
  initialDelay?: number; // Delay in ms before first scroll (default: 3800ms = 2.3s curtain split + 1.5s reading hero)
  resumeDelay?: number; // Delay in ms to resume scroll after user interaction stops (default: 10000ms = 10s)
}

/**
 * Custom Hook for Smart Cinema Auto-Scroll with User Interaction Detection
 * - Starts automatically 1.5s after the invitation curtain reveals the content
 * - Pauses immediately when user touches, scrolls, clicks, or presses keys
 * - Resumes automatically after 10s of complete inactivity
 * - Stops when reaching the bottom of the page or when lightbox is open
 */
export function useAutoScroll({
  enabled,
  speed = 50,
  initialDelay = 3800,
  resumeDelay = 10000,
}: AutoScrollOptions) {
  const isScrollingRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const isAtBottom = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      return currentScroll >= scrollHeight - 15;
    };

    const isLightboxOpen = () => {
      return (
        !!document.querySelector(".yarl__fullsize") ||
        !!document.querySelector('[role="dialog"]')
      );
    };

    const stopScroll = () => {
      isScrollingRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
    };

    const startScroll = () => {
      if (isScrollingRef.current || isAtBottom() || isLightboxOpen()) return;

      isScrollingRef.current = true;
      lastTimestampRef.current = null;

      const step = (timestamp: number) => {
        if (!isScrollingRef.current) return;

        if (isAtBottom() || isLightboxOpen()) {
          stopScroll();
          return;
        }

        if (lastTimestampRef.current === null) {
          lastTimestampRef.current = timestamp;
        }

        const delta = (timestamp - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = timestamp;

        // Smooth delta-based scroll amount
        const movePixels = Math.max(0.4, Math.min(speed * delta, 2.5));

        // Use direct scrollTop assignment for buttery-smooth scrolling without browser smooth-scroll conflicts
        if (document.documentElement) {
          document.documentElement.scrollTop += movePixels;
        } else {
          window.scrollBy(0, movePixels);
        }

        rafIdRef.current = requestAnimationFrame(step);
      };

      rafIdRef.current = requestAnimationFrame(step);
    };

    const scheduleResume = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        if (!isAtBottom() && !isLightboxOpen()) {
          startScroll();
        }
      }, resumeDelay);
    };

    const handleUserInteraction = () => {
      if (!isInitializedRef.current) return;
      // Pause active auto-scroll immediately on any user action
      stopScroll();
      // Schedule to resume after 10s idle
      scheduleResume();
    };

    // User interaction events to listen to
    const interactionEvents: (keyof WindowEventMap)[] = [
      "wheel",
      "touchstart",
      "touchmove",
      "mousedown",
      "pointerdown",
      "keydown",
    ];

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    // Start auto-scroll after opening animation (2.3s) + 1.5s delay
    const initialTimer = setTimeout(() => {
      isInitializedRef.current = true;
      startScroll();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      stopScroll();

      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
    };
  }, [enabled, speed, initialDelay, resumeDelay]);
}
