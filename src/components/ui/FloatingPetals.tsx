"use client";

import React, { useEffect, useState } from "react";

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate only 12 optimized particles to keep 120fps smooth scrolling on mobile
    const count = 12;
    const generated: Petal[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 92) + 4, // 4% to 96%
      size: Math.floor(Math.random() * 6) + 10, // 10px to 16px
      duration: Math.floor(Math.random() * 6) + 12, // 12s to 18s
      delay: Math.floor(Math.random() * 4), // 0 to 4s
      opacity: Math.random() * 0.2 + 0.15,
    }));
    setPetals(generated);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] pointer-events-none z-30 overflow-hidden select-none gpu-layer">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute will-change-transform"
          style={{
            left: `${petal.x}%`,
            top: "-20px",
            fontSize: `${petal.size}px`,
            opacity: petal.opacity,
            animation: `fallingPetalGPU ${petal.duration}s linear ${petal.delay}s infinite`,
          }}
        >
          {petal.id % 2 === 0 ? "🌸" : "✨"}
        </div>
      ))}

      <style jsx global>{`
        @keyframes fallingPetalGPU {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translate3d(30px, 105vh, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
