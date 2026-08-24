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
    <section id="story" className="w-full py-20 px-4 bg-surface text-textMain relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-sans tracking-[0.35em] text-accent font-semibold">
            Chuyện Chúng Mình
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl text-textMain font-normal tracking-wide mt-2">
            Hành Trình 10 Năm Yêu Thương
          </h2>
          <SectionDivider variant="botanical" />
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
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center z-10 shadow-sm animate-pulse-slow">
                    <Heart className="w-3.5 h-3.5 text-accent fill-accent" />
                  </div>

                  {/* Image Block */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    {item.image && (
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-borderLight group">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Content Block */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="inline-block px-3 py-1 rounded-full bg-accentGold/15 text-[#9A7D33] font-serif text-sm font-semibold tracking-wider mb-2">
                      {item.year}
                    </div>
                    <h3 className="font-serif text-2xl text-textMain font-medium mb-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs uppercase tracking-wider text-accent font-medium mb-3">
                      {item.subtitle}
                    </p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">
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
