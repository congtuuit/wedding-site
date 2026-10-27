"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Clock } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface CountdownProps {
  targetDateIso: string;
  weddingDateFormatted: string;
  ceremonyName?: string;
  location?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDateIso,
  weddingDateFormatted,
  ceremonyName,
  location,
}) => {
  const { dict } = useLocale();
  const { days, hours, minutes, seconds, isExpired, isHydrated } =
    useCountdown(targetDateIso);

  const timeUnits = [
    { label: dict.countdown.days, value: days },
    { label: dict.countdown.hours, value: hours },
    { label: dict.countdown.minutes, value: minutes },
    { label: dict.countdown.seconds, value: seconds },
  ];

  const ceremonyLabel = ceremonyName || "Ngày Trọng Đại";

  return (
    <section id="countdown" className="w-full py-16 px-4 bg-background text-textMain text-center">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="flex items-center justify-center gap-2 text-[#8C1425] font-sans text-xs uppercase tracking-[0.3em] font-semibold">
          <Clock className="w-3.5 h-3.5 text-[#8C1425]" />
          <span>{dict.countdown.subtitle}</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide">
          {dict.countdown.headingPrefix} {ceremonyLabel}
        </h2>
        <p className="text-xs text-textMuted font-sans tracking-widest uppercase">
          {weddingDateFormatted} {location ? `• ${location}` : ""}
        </p>

        <SectionDivider variant="diamond" className="my-4" />

        {isExpired ? (
          <div className="py-6 px-4 rounded-2xl bg-[#8C1425]/10 border border-[#8C1425]/20">
            <p className="font-heading text-lg text-[#8C1425] font-medium">
              {ceremonyName === "Lễ Vu Quy"
                ? dict.countdown.expiredQue
                : dict.countdown.expiredSg}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto mt-6">
            {timeUnits.map((unit, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-shadow"
              >
                <span className="font-heading text-2xl sm:text-3xl text-[#8C1425] font-bold tabular-nums">
                  {isHydrated
                    ? String(unit.value).padStart(2, "0")
                    : "--"}
                </span>
                <span className="mt-1 text-[10px] font-sans text-textMuted tracking-wider uppercase font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-textMuted font-sans tracking-wide pt-2">
          {dict.countdown.subtext(ceremonyLabel)}
        </p>
      </div>
    </section>
  );
};

