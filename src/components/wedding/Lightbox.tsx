"use client";

import React from "react";
import YARLightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

import { GalleryPhoto } from "@/types/wedding";

interface LightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const slides = photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt || "Ảnh cưới Tú Văn & Hường Nguyễn",
    title: photo.title,
    description: photo.title ? photo.title : undefined,
  }));

  return (
    <div className="wedding-lightbox-root">
      <YARLightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter, Fullscreen]}
        on={{
          view: ({ index }) => onNavigate(index),
        }}
        carousel={{
          finite: false,
          preload: 2,
          padding: "16px",
          spacing: "30%",
        }}
        animation={{
          fade: 250,
          swipe: 350,
          navigation: 300,
          easing: {
            fade: "cubic-bezier(0.16, 1, 0.3, 1)",
            swipe: "cubic-bezier(0.16, 1, 0.3, 1)",
            navigation: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
        }}
        thumbnails={{
          position: "bottom",
          width: 70,
          height: 90,
          border: 2,
          borderRadius: 8,
          padding: 4,
          gap: 10,
          showToggle: true,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
        }}
        counter={{
          container: {
            style: {
              top: "16px",
              left: "16px",
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "13px",
              letterSpacing: "0.15em",
              color: "#FFFDF9",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            },
          },
        }}
        styles={{
          container: {
            backgroundColor: "rgba(10, 2, 4, 0.95)",
            backdropFilter: "blur(16px)",
          },
          button: {
            filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
            color: "#FFFDF9",
          },
          thumbnail: {
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          thumbnailsContainer: {
            backgroundColor: "rgba(15, 3, 6, 0.8)",
            backdropFilter: "blur(12px)",
            paddingBottom: "12px",
          },
        }}
      />

      <style jsx global>{`
        .yarl__thumbnails_thumbnail_active {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.6) !important;
          transform: scale(1.06);
        }
        .yarl__slide_title {
          font-family: var(--font-heading), sans-serif !important;
          font-weight: 500 !important;
          letter-spacing: 0.05em !important;
          color: #FFFDF9 !important;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
};
