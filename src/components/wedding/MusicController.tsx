"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface MusicControllerProps {
  src: string;
  autoPlayTrigger?: boolean;
}

export const MusicController: React.FC<MusicControllerProps> = ({
  src,
  autoPlayTrigger = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Play audio safely
  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      })
      .catch((err) => {
        console.log("Audio autoplay prevented by browser policy:", err);
      });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Trigger play when autoPlayTrigger changes (e.g. after clicking "Mở thiệp")
  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      playAudio();
    }
  }, [autoPlayTrigger]);

  // Handle visibility change (pause when tab hidden, resume if was playing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        if (hasInteracted && isPlaying && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, hasInteracted]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        className="hidden"
      />

      {/* Floating Music Control Button */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[460px] px-4 z-40 pointer-events-none flex justify-end">
        <button
          onClick={toggleAudio}
          aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
          className={`pointer-events-auto relative flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl transition-all duration-300 min-w-[44px] min-h-[44px] border-2 cursor-pointer active:scale-95 ${
            isPlaying
              ? "bg-white/95 border-accent text-accent shadow-[0_0_20px_rgba(108,127,93,0.45),_0_8px_25px_rgba(0,0,0,0.12)] hover:scale-105"
              : "bg-white/90 border-borderLight text-textMuted shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:text-textMain hover:scale-105"
          }`}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              {/* Rotating disk icon */}
              <Music className="w-5 h-5 animate-spin-slow text-accent drop-shadow-[0_0_6px_rgba(108,127,93,0.5)]" />
              {/* Pulsing subtle ring */}
              <span className="absolute -inset-1 rounded-full border border-accent/40 animate-ping opacity-50 pointer-events-none" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-textMuted" />
          )}
        </button>
      </div>
    </>
  );
};
