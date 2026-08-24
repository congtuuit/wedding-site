"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: "up" | "down" | "left" | "right" | "none";
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  direction = "up",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return "translate3d(0,0,0) opacity-100 scale-100";
    switch (direction) {
      case "up":
        return "translate3d(0,24px,0) opacity-0 scale-[0.99]";
      case "down":
        return "translate3d(0,-24px,0) opacity-0 scale-[0.99]";
      case "left":
        return "translate3d(24px,0,0) opacity-0";
      case "right":
        return "translate3d(-24px,0,0) opacity-0";
      default:
        return "opacity-0 scale-95";
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform gpu-layer",
        isVisible ? "will-change-auto" : "will-change-transform",
        getTransformStyle(),
        className
      )}
    >
      {children}
    </div>
  );
};
