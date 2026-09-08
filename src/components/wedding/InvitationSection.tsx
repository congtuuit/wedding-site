import React from "react";
import { WeddingData } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Heart } from "lucide-react";

interface InvitationSectionProps {
  invitation: WeddingData["invitation"];
  guestName: string;
  isPersonalized: boolean;
  headline?: string;
  shortCoupleName?: string;
  stageKey?: "que" | "sg";
}

export const InvitationSection: React.FC<InvitationSectionProps> = ({
  invitation,
  guestName,
  isPersonalized,
  headline,
  shortCoupleName,
  stageKey = "sg",
}) => {
  const displayHeadline = headline || invitation.headline;
  const coupleName = shortCoupleName || (stageKey === "que" ? "Hường & Tú" : "Tú & Hường");

  return (
    <section id="invitation" className="w-full py-16 px-4 bg-surface text-textMain relative overflow-hidden">
      {/* Delicate background ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#8C1425]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
        {/* Header */}
        <div>
          <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold">
            Trân Trọng Kính Mời
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1.5">
            {displayHeadline}
          </h2>
          <SectionDivider variant="botanical" className="my-4" />
        </div>

        {/* Personalized Guest Calling */}
        <div className="inline-block py-2 px-6 rounded-full bg-background border border-borderLight shadow-sm">
          <p className="font-heading text-base sm:text-lg text-[#8C1425] font-semibold tracking-wide">
            Thân gửi: {guestName}
          </p>
        </div>

        {/* Emotional Quote Block */}
        <div className="relative py-6 px-6 bg-background/90 backdrop-blur-sm rounded-3xl border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)]">
          <span className="font-serif text-4xl text-[#D4AF37]/50 absolute -top-3 left-4 select-none">
            “
          </span>
          <p className="font-sans italic text-sm sm:text-base text-textMain/90 leading-relaxed max-w-md mx-auto">
            {invitation.quote}
          </p>
          <span className="font-serif text-4xl text-[#D4AF37]/50 absolute -bottom-6 right-4 select-none">
            ”
          </span>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-3 text-xs sm:text-sm text-textMuted font-sans leading-relaxed">
          {invitation.messageParagraphs.map((para, idx) => {
            const formattedPara = para.replace(/Tú\s*&\s*Hường|Hường\s*&\s*Tú/g, coupleName);
            return <p key={idx}>{formattedPara}</p>;
          })}
        </div>

        {/* Closing */}
        <div className="pt-2 flex flex-col items-center gap-1.5">
          <Heart className="w-4 h-4 text-[#8C1425] fill-[#8C1425]/20 animate-pulse-slow" />
          <p className="font-heading text-base sm:text-lg text-textMain font-medium tracking-wide">
            {invitation.closing}
          </p>
        </div>
      </div>
    </section>
  );
};
