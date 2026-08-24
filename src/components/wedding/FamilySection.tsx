import React from "react";
import { CoupleInfo } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface FamilySectionProps {
  couple: CoupleInfo;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ couple }) => {
  return (
    <section id="family-section" className="w-full py-16 sm:py-20 px-3 sm:px-6 bg-background text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtitle */}
        <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-1.5">
          Hai Bên Gia Đình
        </p>
        <h2 className="font-playfair text-3xl sm:text-4xl text-textMain font-normal tracking-wide">
          Nhà Trai & Nhà Gái
        </h2>

        <SectionDivider variant="botanical" className="my-6" />

        {/* 2-Column Side-by-Side Family Display (on all screens) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 mt-6 max-w-3xl mx-auto">
          {/* CỘT 1: NHÀ TRAI */}
          <div className="flex flex-col justify-between p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-surface border border-borderLight shadow-[0_4px_25px_rgba(140,20,37,0.05)] hover:shadow-md transition-all text-center">
            <div>
              {/* Badge */}
              <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-4 sm:mb-6">
                Nhà Trai
              </div>
              
              {/* Parents */}
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                <p className="font-playfair text-sm sm:text-lg md:text-xl text-textMain font-medium leading-snug">
                  {couple.groom.fatherName}
                </p>
                <p className="font-playfair text-sm sm:text-lg md:text-xl text-textMain font-medium leading-snug">
                  {couple.groom.motherName}
                </p>
                <p className="text-[10px] sm:text-xs text-textMuted font-sans tracking-wide pt-1">
                  Quê quán: {couple.groom.hometown}
                </p>
              </div>
            </div>

            {/* Groom Info */}
            <div className="pt-3 sm:pt-4 border-t border-borderLight">
              <span className="inline-block text-[10px] sm:text-xs text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                {couple.groom.role}
              </span>
              <p className="font-playfair text-base sm:text-2xl md:text-3xl text-textMain font-normal tracking-wide">
                {couple.groom.fullName}
              </p>
            </div>
          </div>

          {/* CỘT 2: NHÀ GÁI */}
          <div className="flex flex-col justify-between p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-surface border border-borderLight shadow-[0_4px_25px_rgba(140,20,37,0.05)] hover:shadow-md transition-all text-center">
            <div>
              {/* Badge */}
              <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-[#D4AF37]/15 text-[#9A7A22] font-sans text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-4 sm:mb-6">
                Nhà Gái
              </div>
              
              {/* Parents */}
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                <p className="font-playfair text-sm sm:text-lg md:text-xl text-textMain font-medium leading-snug">
                  {couple.bride.fatherName}
                </p>
                <p className="font-playfair text-sm sm:text-lg md:text-xl text-textMain font-medium leading-snug">
                  {couple.bride.motherName}
                </p>
                <p className="text-[10px] sm:text-xs text-textMuted font-sans tracking-wide pt-1">
                  Quê quán: {couple.bride.hometown}
                </p>
              </div>
            </div>

            {/* Bride Info */}
            <div className="pt-3 sm:pt-4 border-t border-borderLight">
              <span className="inline-block text-[10px] sm:text-xs text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                {couple.bride.role}
              </span>
              <p className="font-playfair text-base sm:text-2xl md:text-3xl text-textMain font-normal tracking-wide">
                {couple.bride.fullName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
