import React from "react";
import { WeddingData } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Heart } from "lucide-react";

interface InvitationSectionProps {
  invitation: WeddingData["invitation"];
  guestName: string;
  isPersonalized: boolean;
}

export const InvitationSection: React.FC<InvitationSectionProps> = ({
  invitation,
  guestName,
  isPersonalized,
}) => {
  return (
    <section id="invitation" className="w-full py-20 px-4 bg-surface text-textMain relative overflow-hidden">
      {/* Delicate background ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8C1425]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs uppercase font-sans tracking-[0.35em] text-accent font-semibold">
            Trân Trọng Kính Mời
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl text-textMain font-normal tracking-wide mt-2">
            {invitation.headline}
          </h2>
          <SectionDivider variant="botanical" />
        </div>

        {/* Personalized Guest Calling */}
        <div className="inline-block py-2.5 px-7 rounded-full bg-background border border-borderLight shadow-sm">
          <p className="font-playfair text-lg sm:text-xl text-[#8C1425] font-medium tracking-wide">
            {isPersonalized ? `Kính gửi: ${guestName}` : `Thân gửi: ${guestName}`}
          </p>
        </div>

        {/* Emotional Quote Block */}
        <div className="relative py-7 px-6 sm:px-12 bg-background/80 backdrop-blur-sm rounded-3xl border border-borderLight shadow-[0_6px_30px_rgba(140,20,37,0.04)]">
          <span className="font-serif text-5xl sm:text-6xl text-[#D4AF37]/40 absolute -top-4 left-6 select-none">
            “
          </span>
          <p className="font-playfair italic text-lg sm:text-2xl text-textMain/90 leading-relaxed max-w-xl mx-auto">
            {invitation.quote}
          </p>
          <span className="font-serif text-5xl sm:text-6xl text-[#D4AF37]/40 absolute -bottom-8 right-6 select-none">
            ”
          </span>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4 max-w-xl mx-auto text-sm sm:text-base text-textMuted font-sans leading-relaxed">
          {invitation.messageParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Closing */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <Heart className="w-5 h-5 text-[#8C1425] fill-[#8C1425]/20 animate-pulse-slow" />
          <p className="font-playfair text-xl sm:text-2xl text-textMain tracking-wide">
            {invitation.closing}
          </p>
        </div>
      </div>
    </section>
  );
};
