"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { VolumeX, Music } from "lucide-react";

export interface MusicControllerHandle {
  play: () => Promise<void> | void;
  pause: () => void;
  toggle: () => void;
}

interface MusicControllerProps {
  src: string;
  autoPlayTrigger?: boolean;
  standalone?: boolean;
  visible?: boolean;
}

export const MusicController = forwardRef<
  MusicControllerHandle,
  MusicControllerProps
>(({ src, autoPlayTrigger = false, standalone = true, visible = true }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const userPausedRef = useRef<boolean>(false);
  const hasAttemptedAutoplayRef = useRef<boolean>(false);

  // Play audio safely
  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    userPausedRef.current = false;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Audio play was prevented:", err);
          setIsPlaying(false);
        });
    }
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    userPausedRef.current = true;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggleAudio = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (!audioRef.current) return;

      if (!audioRef.current.paused && isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    },
    [isPlaying, pauseAudio, playAudio]
  );

  // Expose imperative handle for direct synchronous calls on click events
  useImperativeHandle(
    ref,
    () => ({
      play: playAudio,
      pause: pauseAudio,
      toggle: toggleAudio,
    }),
    [playAudio, pauseAudio, toggleAudio]
  );

  // Synchronize state with native audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Trigger play when autoPlayTrigger becomes true for the first time
  useEffect(() => {
    if (
      autoPlayTrigger &&
      !hasAttemptedAutoplayRef.current &&
      !userPausedRef.current
    ) {
      hasAttemptedAutoplayRef.current = true;
      playAudio();
    }
  }, [autoPlayTrigger, playAudio]);

  // iOS Safari Fallback: Listen for user gesture only if autoplay hasn't started and user hasn't explicitly paused
  useEffect(() => {
    if (!autoPlayTrigger || isPlaying || userPausedRef.current) return;

    const unlockAudioOnGesture = () => {
      if (!userPausedRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("touchstart", unlockAudioOnGesture, {
      passive: true,
      once: true,
    });
    window.addEventListener("click", unlockAudioOnGesture, {
      passive: true,
      once: true,
    });

    return () => {
      window.removeEventListener("touchstart", unlockAudioOnGesture);
      window.removeEventListener("click", unlockAudioOnGesture);
    };
  }, [autoPlayTrigger, isPlaying]);

  // Handle visibility change (pause when tab hidden, resume only if not paused by user)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (!userPausedRef.current && autoPlayTrigger) {
          audio.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoPlayTrigger]);

  const musicButton = (
    <button
      type="button"
      onClick={toggleAudio}
      title={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      className={`pointer-events-auto relative flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 min-w-[38px] min-h-[38px] rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer active:scale-95 select-none ${
        isPlaying
          ? "bg-white/95 border-[#8C1425]/70 text-[#8C1425] shadow-[0_3px_14px_rgba(140,20,37,0.3)] opacity-95 hover:opacity-100 hover:scale-105"
          : "bg-white/80 border-white/60 text-textMuted shadow-[0_2px_10px_rgba(0,0,0,0.08)] opacity-80 hover:opacity-100 hover:bg-white/95 hover:text-textMain hover:scale-105"
      }`}
    >
      {isPlaying ? (
        <div className="relative flex items-center justify-center">
          {/* Rotating disk icon */}
          <Music className="w-4 h-4 animate-spin-slow text-[#8C1425] drop-shadow-[0_0_4px_rgba(140,20,37,0.35)]" />
          {/* Pulsing subtle ring */}
          <span className="absolute -inset-1 rounded-full border border-[#8C1425]/30 animate-ping opacity-40 pointer-events-none" />
        </div>
      ) : (
        <VolumeX className="w-4 h-4 text-textMuted" />
      )}
    </button>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
        playsInline
        className="hidden"
      />

      {visible &&
        (standalone ? (
          <div className="fixed top-4 inset-x-0 z-40 pointer-events-none flex justify-center px-4">
            <div className="w-full max-w-[480px] flex justify-end">
              {musicButton}
            </div>
          </div>
        ) : (
          musicButton
        ))}
    </>
  );
});

MusicController.displayName = "MusicController";

