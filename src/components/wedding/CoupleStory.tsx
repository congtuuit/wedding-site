import React from "react";
import Image from "next/image";
import { TimelineStory } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Heart } from "lucide-react";

interface CoupleStoryProps {
  timeline: TimelineStory[];
}

export const CoupleStory: React.FC<CoupleStoryProps> = ({ timeline }) => {
  return (
    <section id="story" className="w-full py-18 sm:py-24 px-4 bg-surface text-textMain relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16">
          <span className="text-[11px] sm:text-xs uppercase font-sans tracking-[0.3em] text-accent font-medium">
            Chuyện Chúng Mình
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl text-textMain font-light tracking-wide mt-1.5">
            Hành Trình Yêu Thương
          </h2>
          <SectionDivider variant="botanical" className="my-5" />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-borderLight to-transparent -translate-x-1/2" />
          {/* Left Line for Mobile */}
          <div className="md:hidden absolute left-6 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-borderLight to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-12 sm:space-y-16">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Badge Point with gentle pulse */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-background border-2 border-accent/70 flex items-center justify-center z-10 shadow-sm animate-pulse-slow">
                    <Heart className="w-3 h-3 text-accent fill-accent" />
                  </div>

                  {/* Image Block */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    {item.image && (
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-borderLight group">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Content Block with Soft & Light Typography */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-xs font-medium tracking-wider mb-2">
                      {item.year}
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl text-textMain font-normal tracking-wide mb-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs tracking-wider text-[#8C1425] font-normal mb-2.5">
                      {item.subtitle}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-textMuted/90 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
