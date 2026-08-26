import React from "react";
import Image from "next/image";
import { CoupleInfo } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface FamilySectionProps {
  couple: CoupleInfo;
  priority?: "que" | "sg";
}

export const FamilySection: React.FC<FamilySectionProps> = ({
  couple,
  priority = "que",
}) => {
  const isQuePriority = priority === "que";
  const titleText = isQuePriority ? "Nhà Gái & Nhà Trai" : "Nhà Trai & Nhà Gái";
  return (
    <section id="family-section" className="w-full py-14 sm:py-18 px-3 sm:px-6 bg-background text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtitle */}
        <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-1">
          Hai Bên Gia Đình
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide">
          {titleText}
        </h2>

        <SectionDivider variant="botanical" className="my-5" />

        {/* 2-Column Side-by-Side Family Display (on all screens) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 mt-4 max-w-2xl mx-auto">
          {/* CỘT NHÀ GÁI (Khi ưu tiên Nhà Gái) HOẶC CỘT NHÀ TRAI */}
          {isQuePriority ? (
            <>
              {/* CỘT 1: NHÀ GÁI */}
              <div className="flex flex-col justify-between p-3 sm:p-5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
                <div>
                  <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#9A7A22] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-2.5 sm:mb-3">
                    Nhà Gái
                  </div>
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.bride.fatherName}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.bride.motherName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-textMuted font-sans tracking-wide pt-0.5 leading-tight">
                      Quê quán: {couple.bride.hometown}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight flex flex-col items-center">
                  <span className="inline-block text-[8.5px] sm:text-[10px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                    {couple.bride.role}
                  </span>
                  <p className="font-couple text-base sm:text-xl md:text-2xl text-[#8C1425] font-normal tracking-wide whitespace-nowrap mb-2.5 sm:mb-3">
                    {couple.bride.fullName}
                  </p>
                  {couple.bride.photo && (
                    <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-[#8C1425]/15 shadow-sm group">
                      <Image
                        src={couple.bride.photo}
                        alt={couple.bride.fullName}
                        fill
                        sizes="(max-width: 480px) 45vw, 200px"
                        className="object-cover object-top scale-[1.95] -translate-y-[53%] origin-top transition-transform duration-700 ease-out group-hover:scale-[2.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT 2: NHÀ TRAI */}
              <div className="flex flex-col justify-between p-3 sm:p-5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
                <div>
                  <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-2.5 sm:mb-3">
                    Nhà Trai
                  </div>
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.groom.fatherName}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.groom.motherName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-textMuted font-sans tracking-wide pt-0.5 leading-tight">
                      Quê quán: {couple.groom.hometown}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight flex flex-col items-center">
                  <span className="inline-block text-[8.5px] sm:text-[10px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                    {couple.groom.role}
                  </span>
                  <p className="font-couple text-base sm:text-xl md:text-2xl text-[#8C1425] font-normal tracking-wide whitespace-nowrap mb-2.5 sm:mb-3">
                    {couple.groom.fullName}
                  </p>
                  {couple.groom.photo && (
                    <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-[#8C1425]/15 shadow-sm group">
                      <Image
                        src={couple.groom.photo}
                        alt={couple.groom.fullName}
                        fill
                        sizes="(max-width: 480px) 45vw, 200px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* CỘT 1: NHÀ TRAI */}
              <div className="flex flex-col justify-between p-3 sm:p-5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
                <div>
                  <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-2.5 sm:mb-3">
                    Nhà Trai
                  </div>
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.groom.fatherName}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.groom.motherName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-textMuted font-sans tracking-wide pt-0.5 leading-tight">
                      Quê quán: {couple.groom.hometown}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight flex flex-col items-center">
                  <span className="inline-block text-[8.5px] sm:text-[10px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                    {couple.groom.role}
                  </span>
                  <p className="font-couple text-base sm:text-xl md:text-2xl text-[#8C1425] font-normal tracking-wide whitespace-nowrap mb-2.5 sm:mb-3">
                    {couple.groom.fullName}
                  </p>
                  {couple.groom.photo && (
                    <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-[#8C1425]/15 shadow-sm group">
                      <Image
                        src={couple.groom.photo}
                        alt={couple.groom.fullName}
                        fill
                        sizes="(max-width: 480px) 45vw, 200px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT 2: NHÀ GÁI */}
              <div className="flex flex-col justify-between p-3 sm:p-5 rounded-2xl bg-surface border border-borderLight shadow-[0_4px_20px_rgba(140,20,37,0.04)] hover:shadow-md transition-all text-center">
                <div>
                  <div className="inline-block px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#9A7A22] font-sans text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold mb-2.5 sm:mb-3">
                    Nhà Gái
                  </div>
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.bride.fatherName}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs md:text-sm text-textMain font-medium leading-snug whitespace-nowrap">
                      {couple.bride.motherName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-textMuted font-sans tracking-wide pt-0.5 leading-tight">
                      Quê quán: {couple.bride.hometown}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 sm:pt-3.5 border-t border-borderLight flex flex-col items-center">
                  <span className="inline-block text-[8.5px] sm:text-[10px] text-[#8C1425] uppercase tracking-wider font-sans font-medium mb-0.5">
                    {couple.bride.role}
                  </span>
                  <p className="font-couple text-base sm:text-xl md:text-2xl text-[#8C1425] font-normal tracking-wide whitespace-nowrap mb-2.5 sm:mb-3">
                    {couple.bride.fullName}
                  </p>
                  {couple.bride.photo && (
                    <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-[#8C1425]/15 shadow-sm group">
                      <Image
                        src={couple.bride.photo}
                        alt={couple.bride.fullName}
                        fill
                        sizes="(max-width: 480px) 45vw, 200px"
                        className="object-cover object-top scale-[1.95] -translate-y-[53%] origin-top transition-transform duration-700 ease-out group-hover:scale-[2.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
