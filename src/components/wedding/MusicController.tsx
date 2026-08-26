"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface MusicControllerProps {
  src: string;
  autoPlayTrigger?: boolean;
  standalone?: boolean;
}

export const MusicController: React.FC<MusicControllerProps> = ({
  src,
  autoPlayTrigger = false,
  standalone = true,
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
        if (isPlaying && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, hasInteracted]);

  const musicButton = (
    <button
      onClick={toggleAudio}
      title={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      className={`pointer-events-auto relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer active:scale-95 select-none ${
        isPlaying
          ? "bg-white/90 border-accent/80 text-accent shadow-[0_2px_14px_rgba(108,127,93,0.35)] opacity-90 hover:opacity-100 hover:scale-105"
          : "bg-white/75 border-white/50 text-textMuted shadow-[0_2px_10px_rgba(0,0,0,0.08)] opacity-75 hover:opacity-100 hover:bg-white/90 hover:text-textMain hover:scale-105"
      }`}
    >
      {isPlaying ? (
        <div className="relative flex items-center justify-center">
          {/* Rotating disk icon */}
          <Music className="w-4.5 h-4.5 animate-spin-slow text-accent drop-shadow-[0_0_4px_rgba(108,127,93,0.4)]" />
          {/* Pulsing subtle ring */}
          <span className="absolute -inset-1 rounded-full border border-accent/30 animate-ping opacity-40 pointer-events-none" />
        </div>
      ) : (
        <VolumeX className="w-4.5 h-4.5 text-textMuted" />
      )}
    </button>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        className="hidden"
      />

      {standalone ? (
        <div className="fixed top-4 inset-x-0 z-40 pointer-events-none flex justify-center px-4">
          <div className="w-full max-w-[480px] flex justify-end">
            {musicButton}
          </div>
        </div>
      ) : (
        musicButton
      )}
    </>
  );
};
