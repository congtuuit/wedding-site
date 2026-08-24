"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDateIso: string;
  weddingDateFormatted: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDateIso,
  weddingDateFormatted,
}) => {
  const { days, hours, minutes, seconds, isExpired, isHydrated } =
    useCountdown(targetDateIso);

  const timeUnits = [
    { label: "Ngày", value: days },
    { label: "Giờ", value: hours },
    { label: "Phút", value: minutes },
    { label: "Giây", value: seconds },
  ];

  return (
    <section id="countdown" className="w-full py-16 sm:py-20 px-4 bg-background text-textMain text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 text-[#8C1425] font-sans text-xs uppercase tracking-[0.3em] font-semibold">
          <Clock className="w-3.5 h-3.5 text-[#8C1425]" />
          <span>Cùng Đếm Ngược</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-4xl text-textMain font-normal tracking-wide">
          Chờ Đón Ngày Hạnh Phúc
        </h2>
        <p className="text-xs sm:text-sm text-textMuted font-sans tracking-widest uppercase">
          {weddingDateFormatted}
        </p>

        <SectionDivider variant="diamond" />

        {isExpired ? (
          <div className="py-8 px-6 rounded-2xl bg-[#8C1425]/10 border border-[#8C1425]/20">
            <p className="font-playfair text-xl sm:text-2xl text-[#8C1425] font-medium">
              Hôm nay là ngày chúng mình chính thức về chung một nhà! 💐
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto mt-8">
            {timeUnits.map((unit, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-shadow"
              >
                <span className="font-playfair text-2xl sm:text-4xl md:text-5xl text-[#8C1425] font-semibold tabular-nums">
                  {isHydrated
                    ? String(unit.value).padStart(2, "0")
                    : "--"}
                </span>
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-sans text-textMuted tracking-wider uppercase font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-textMuted font-sans tracking-wide pt-4">
          Từng giây từng phút trôi qua đều hướng về ngày đặc biệt của chúng mình.
        </p>
      </div>
    </section>
  );
};
