"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { GalleryPhoto } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Eye, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";

const Lightbox = dynamic(
  () => import("./Lightbox").then((mod) => mod.Lightbox),
  { ssr: false }
);

interface GalleryProps {
  photos: GalleryPhoto[];
}

export const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Show 8 curated photos by default, expandable to all photos
  const displayedPhotos = isExpanded ? photos : photos.slice(0, 8);

  return (
    <section id="gallery" className="w-full py-16 px-3 sm:px-4 bg-surface text-textMain">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold">
          Khoảnh Khắc Đẹp
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1.5">
          Album Ảnh Cưới
        </h2>
        <p className="text-xs text-textMuted font-sans mt-1.5">
          Từng khoảnh khắc ghi lại tình yêu của chúng mình
        </p>

        <SectionDivider variant="botanical" className="my-4" />

        {/* 2-Column Masonry Gallery (Consistent on all devices within frame) */}
        <div className="columns-2 gap-2.5 space-y-2.5 mt-6 text-left">
          {displayedPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="group relative break-inside-avoid cursor-pointer overflow-hidden rounded-2xl bg-white border border-borderLight shadow-sm hover:shadow-lg transition-all duration-500 ease-out"
            >
              {/* Photo Image */}
              <div className="relative w-full overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt || "Ảnh cưới Tú Văn & Hường Nguyễn"}
                  width={600}
                  height={900}
                  sizes="(max-width: 640px) 50vw, 240px"
                  loading="lazy"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Shimmer Light Ray on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              </div>

              {/* Soft Gradient Overlay & Caption on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 text-white">
                <div className="flex items-center justify-between transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    {photo.title && (
                      <p className="font-heading text-xs tracking-wide font-medium text-white line-clamp-1">
                        {photo.title}
                      </p>
                    )}
                    <span className="text-[9px] text-accentGold font-sans tracking-widest uppercase">
                      Xem chi tiết
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Eye className="w-3.5 h-3.5 text-accentGold" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expand / Collapse Button if more than 8 photos */}
        {photos.length > 8 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-background border border-borderLight hover:border-accent text-textMain hover:text-accent font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer min-h-[42px]"
            >
              {isExpanded ? (
                <>
                  <span>Thu Gọn Album</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Xem Tất Cả ({photos.length} Ảnh)</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Hint */}
        <p className="text-xs text-textMuted font-sans tracking-wide mt-5 flex items-center justify-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-accent" />
          <span>Chạm vào ảnh bất kỳ để phóng to & vuốt xem toàn bộ album</span>
        </p>

        {/* Lightbox Modal (Dynamic Loaded on Demand) */}
        {isLightboxOpen && (
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            onNavigate={setLightboxIndex}
          />
        )}
      </div>
    </section>
  );
};
