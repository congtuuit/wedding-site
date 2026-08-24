import React from "react";
import { CoupleInfo } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface FamilySectionProps {
  couple: CoupleInfo;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ couple }) => {
  return (
    <section id="family-section" className="w-full py-14 sm:py-18 px-3 sm:px-6 bg-background text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtitle */}
        <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-1">
          Hai Bên Gia Đình
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide">
          Nhà Trai & Nhà Gái
        </h2>

        <SectionDivider variant="botanical" className="my-5" />

        {/* 2-Column Side-by-Side Family Display (on all screens) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 mt-4 max-w-2xl mx-auto">
          {/* CỘT 1: NHÀ TRAI */}
          <div className="flex flex-col justify-between p-3.5 sm:p-6 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
            <div>
              {/* Badge */}
              <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-3 sm:mb-4">
                Nhà Trai
              </div>
              
              {/* Parents */}
              <div className="space-y-1 mb-3 sm:mb-4">
                <p className="font-sans text-xs sm:text-sm md:text-base text-textMain font-medium leading-snug">
                  {couple.groom.fatherName}
                </p>
                <p className="font-sans text-xs sm:text-sm md:text-base text-textMain font-medium leading-snug">
                  {couple.groom.motherName}
                </p>
                <p className="text-[9px] sm:text-[11px] text-textMuted font-sans tracking-wide pt-0.5">
                  Quê quán: {couple.groom.hometown}
                </p>
              </div>
            </div>

            {/* Groom Info */}
            <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight">
              <span className="inline-block text-[9px] sm:text-[11px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                {couple.groom.role}
              </span>
              <p className="font-couple text-xl sm:text-2xl md:text-3xl text-[#8C1425] font-normal tracking-wide">
                {couple.groom.fullName}
              </p>
            </div>
          </div>

          {/* CỘT 2: NHÀ GÁI */}
          <div className="flex flex-col justify-between p-3.5 sm:p-6 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
            <div>
              {/* Badge */}
              <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#9A7A22] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-3 sm:mb-4">
                Nhà Gái
              </div>
              
              {/* Parents */}
              <div className="space-y-1 mb-3 sm:mb-4">
                <p className="font-sans text-xs sm:text-sm md:text-base text-textMain font-medium leading-snug">
                  {couple.bride.fatherName}
                </p>
                <p className="font-sans text-xs sm:text-sm md:text-base text-textMain font-medium leading-snug">
                  {couple.bride.motherName}
                </p>
                <p className="text-[9px] sm:text-[11px] text-textMuted font-sans tracking-wide pt-0.5">
                  Quê quán: {couple.bride.hometown}
                </p>
              </div>
            </div>

            {/* Bride Info */}
            <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight">
              <span className="inline-block text-[9px] sm:text-[11px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                {couple.bride.role}
              </span>
              <p className="font-couple text-xl sm:text-2xl md:text-3xl text-[#8C1425] font-normal tracking-wide">
                {couple.bride.fullName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
