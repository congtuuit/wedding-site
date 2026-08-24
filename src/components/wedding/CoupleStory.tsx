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
    <section id="story" className="w-full py-16 px-4 bg-surface text-textMain relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-medium">
            Chuyện Chúng Mình
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-light tracking-wide mt-1.5">
            Hành Trình Yêu Thương
          </h2>
          <SectionDivider variant="botanical" className="my-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative pl-8">
          {/* Vertical Connecting Line */}
          <div className="absolute left-3.5 top-4 bottom-4 w-[1.5px] bg-gradient-to-b from-accent/30 via-accentGold/40 to-accent/30" />

          {/* Timeline Items */}
          <div className="space-y-10">
            {timeline.map((item, index) => {
              return (
                <div key={index} className="relative flex flex-col gap-4">
                  {/* Timeline Badge Point */}
                  <div className="absolute -left-[27px] top-1.5 w-6 h-6 rounded-full bg-surface border-2 border-accent flex items-center justify-center z-10 shadow-sm">
                    <Heart className="w-2.5 h-2.5 text-accent fill-accent" />
                  </div>

                  {/* Image Block */}
                  {item.image && (
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-borderLight group">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 480px"
                        loading="lazy"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  {/* Text Content Block */}
                  <div className="space-y-1.5 text-left">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#8C1425]/10 text-[#8C1425] font-sans text-xs font-semibold tracking-wider">
                      {item.year}
                    </div>
                    <h3 className="font-heading text-xl text-textMain font-medium tracking-wide">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs tracking-wider text-[#8C1425] font-medium">
                      {item.subtitle}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-textMuted font-normal leading-relaxed">
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
