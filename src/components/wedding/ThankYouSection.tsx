import React from "react";
import Image from "next/image";
import { CoupleInfo } from "@/types/wedding";
import { Heart } from "lucide-react";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  closingPhoto: string;
}

export const ThankYouSection: React.FC<ThankYouSectionProps> = ({
  couple,
  closingPhoto,
}) => {
  return (
    <section className="w-full py-24 px-4 bg-surface text-textMain text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Heart icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto">
          <Heart className="w-6 h-6 fill-accent/40 text-accent" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-5xl text-textMain font-normal tracking-wide">
            Thank You!
          </h2>
          <p className="font-serif text-xl sm:text-2xl text-accentGold font-light italic">
            Cảm ơn bạn đã luôn yêu thương & đồng hành cùng chúng mình
          </p>
        </div>

        {/* Closing Photo Frame */}
        <div className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-borderLight my-8">
          <Image
            src={closingPhoto}
            alt="Tú Văn & Hường Nguyễn Thank You"
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Signature */}
        <div className="space-y-1 pt-4">
          <p className="font-couple text-3xl sm:text-4xl text-[#8C1425]">
            {couple.groom.name} & {couple.bride.name}
          </p>
          <p className="font-sans text-xs text-textMuted uppercase tracking-[0.3em]">
            {couple.weddingDateFormatted}
          </p>
        </div>

        {/* Subtle Footer */}
        <div className="pt-12 text-[11px] text-textMuted/60 font-sans tracking-widest uppercase border-t border-borderLight/60">
          Forever & Always • {couple.initials} • 2026
        </div>
      </div>
    </section>
  );
};
