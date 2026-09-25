"use client";

import React, { useState, useEffect, useRef } from "react";
import weddingDataJson from "@/data/wedding.json";
import { WeddingData } from "@/types/wedding";
import { useGuestName } from "@/hooks/useGuestName";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useActiveWeddingStage } from "@/hooks/useActiveWeddingStage";
import { ActiveWeddingStage } from "@/lib/wedding-timeline";

import { WeddingOpening } from "@/components/wedding/WeddingOpening";
import { MusicController, MusicControllerHandle } from "@/components/wedding/MusicController";
import { AutoScrollController } from "@/components/wedding/AutoScrollController";
import { HeroSection } from "@/components/wedding/HeroSection";
import { FamilySection } from "@/components/wedding/FamilySection";
import { InvitationSection } from "@/components/wedding/InvitationSection";
import { Countdown } from "@/components/wedding/Countdown";
import { CoupleStory } from "@/components/wedding/CoupleStory";
import { EventSection } from "@/components/wedding/EventSection";
import { Gallery } from "@/components/wedding/Gallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { WishesSection } from "@/components/wedding/WishesSection";
import { GiftSection } from "@/components/wedding/GiftSection";
import { ThankYouSection } from "@/components/wedding/ThankYouSection";
import { BottomNavigation } from "@/components/wedding/BottomNavigation";

import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BackToTop } from "@/components/ui/BackToTop";

const weddingData = weddingDataJson as WeddingData;

interface WeddingPageClientProps {
  initialGuestName?: string;
  initialIsPersonalized?: boolean;
  initialStage?: ActiveWeddingStage;
}

export function WeddingPageClient({
  initialGuestName,
  initialIsPersonalized,
  initialStage,
}: WeddingPageClientProps) {
  const { guestName: clientGuestName, isPersonalized: clientIsPersonalized } =
    useGuestName();

  const guestName =
    clientIsPersonalized || clientGuestName !== "Bạn & Người Thương"
      ? clientGuestName
      : initialGuestName || clientGuestName;

  const isPersonalized =
    clientIsPersonalized || Boolean(initialIsPersonalized);

  const stage = useActiveWeddingStage(initialStage);

  const [hasOpenedInvitation, setHasOpenedInvitation] = useState<boolean>(false);
  const [showFloatingNav, setShowFloatingNav] = useState<boolean>(false);
  const musicRef = useRef<MusicControllerHandle | null>(null);

  // Guarantee page is always at the absolute top on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Synchronize bottom floating nav & action controls to appear simultaneously when scroll > 300px
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowFloatingNav(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartAudio = () => {
    if (musicRef.current) {
      musicRef.current.play();
    }
  };

  const handleOpenInvitation = () => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setHasOpenedInvitation(true);
  };

  // Smart Cinema Auto-Scroll Hook:
  // - 60fps/120fps Subpixel floating point accumulator (Optimized for iPhone ProMotion & iOS Safari)
  // - Immediate pause on touch / momentum scroll
  // - Auto-resume after 8s of inactivity
  // - Pause on form focus / modal dialogs / tab hidden
  const {
    isAutoScrolling,
    isPausedByUser,
    toggleAutoScroll,
    pauseAutoScroll,
  } = useAutoScroll({
    enabled: hasOpenedInvitation,
    speed: 48,
    initialDelay: 3600,
    resumeDelay: 8000,
  });

  return (
    <main className="relative w-full max-w-[480px] min-h-screen mx-auto bg-background text-textMain shadow-[0_0_90px_rgba(0,0,0,0.85)] border-x border-[#8C1425]/15 overflow-x-hidden">
      {/* 1. Opening Envelope Modal Cover with Love Burst Effect */}
      <WeddingOpening
        couple={weddingData.couple}
        guestName={guestName}
        isPersonalized={isPersonalized}
        onOpen={handleOpenInvitation}
        onStartAudio={handleStartAudio}
        weddingDateFormatted={stage.weddingDateFormatted}
        ceremonyBadge={stage.ceremonyName}
        stageKey={stage.stageKey}
      />

      {/* 2. Floating Ambient Rose Petals & Golden Sparkles */}
      {hasOpenedInvitation && <FloatingPetals />}


      {/* 4. Cinematic Hero Section */}
      <HeroSection
        couple={weddingData.couple}
        heroPhoto={weddingData.hero.mainPhoto}
        isRevealed={hasOpenedInvitation}
        weddingDateFormatted={stage.weddingDateFormatted}
        ceremonyName={stage.ceremonyName}
        stageKey={stage.stageKey}
      />

      {/* 5. Family Section (Nhà Trai & Nhà Gái) */}
      <ScrollReveal direction="up">
        <FamilySection
          couple={weddingData.couple}
          priority={stage.stageKey}
        />
      </ScrollReveal>

      {/* 6. Emotional Invitation Message */}
      <ScrollReveal direction="up" delay={100}>
        <InvitationSection
          invitation={weddingData.invitation}
          headline={stage.invitationHeadline}
          shortCoupleName={stage.shortCoupleName}
          stageKey={stage.stageKey}
          guestName={guestName}
          isPersonalized={isPersonalized}
        />
      </ScrollReveal>

      {/* 7. Live Countdown */}
      <ScrollReveal direction="up" delay={150}>
        <Countdown
          targetDateIso={stage.targetCountdownIso}
          weddingDateFormatted={stage.weddingDateFormatted}
          ceremonyName={stage.ceremonyName}
          location={stage.location}
        />
      </ScrollReveal>

      {/* 8. Love Story Timeline */}
      <ScrollReveal direction="up" delay={100}>
        <CoupleStory timeline={weddingData.timeline} />
      </ScrollReveal>

      {/* 9. Wedding Events & Google Maps & Calendar */}
      <ScrollReveal direction="up" delay={100}>
        <EventSection
          events={stage.orderedEvents}
          defaultFilter={stage.defaultFilter}
          activeStageKey={stage.stageKey}
        />
      </ScrollReveal>

      {/* 10. Wedding Photo Gallery & Lightbox */}
      <ScrollReveal direction="up" delay={100}>
        <Gallery photos={weddingData.gallery} />
      </ScrollReveal>

      {/* 11. RSVP Confirmation Section */}
      <ScrollReveal direction="up" delay={100}>
        <RSVPSection
          events={stage.orderedEvents}
          initialGuestName={guestName}
          isPersonalized={isPersonalized}
          webhookUrl={weddingData.appsheetWebhookUrl}
          showEventSelection={weddingData.rsvp?.showEventSelection}
        />
      </ScrollReveal>

      {/* 12. Guest Wishes Board */}
      <ScrollReveal direction="up" delay={100}>
        <WishesSection
          initialGuestName={guestName}
          isPersonalized={isPersonalized}
          webhookUrl={weddingData.appsheetWebhookUrl}
          stageKey={stage.stageKey}
        />
      </ScrollReveal>

      {/* 13. Gift & QR Banking */}
      <ScrollReveal direction="up" delay={100}>
        <GiftSection
          gift={weddingData.gift}
          stageKey={stage.stageKey}
          guestName={guestName}
        />
      </ScrollReveal>

      {/* 14. Closing Thank You Section */}
      <ScrollReveal direction="up" delay={100}>
        <ThankYouSection
          couple={weddingData.couple}
          weddingDateFormatted={stage.weddingDateFormatted}
          stageKey={stage.stageKey}
          closingPhoto={
            weddingData.gallery[weddingData.gallery.length - 1]?.src ||
            "/images/TOBI1281.webp"
          }
        />
      </ScrollReveal>

      {/* 15. Mobile Fixed Dock Navigation (Đồng bộ hiển thị khi scroll > 300) */}
      {hasOpenedInvitation && (
        <BottomNavigation
          visible={showFloatingNav}
          onNavigate={pauseAutoScroll}
        />
      )}

      {/* 16. Floating Bottom-Right Media & Navigation Cluster (Xuất hiện đồng bộ cùng Menu khi scroll > 300) */}
      <div className="fixed bottom-20 sm:bottom-22 inset-x-0 z-40 pointer-events-none flex justify-center px-3 sm:px-4">
        <div className="w-full max-w-[480px] flex justify-end">
          <div
            className={`flex flex-col items-center gap-2 pointer-events-auto transition-all duration-300 ease-out ${
              hasOpenedInvitation && showFloatingNav
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-4 pointer-events-none"
            }`}
          >
            <BackToTop
              inline
              visible={hasOpenedInvitation && showFloatingNav}
              onScrollToTop={pauseAutoScroll}
            />
            <AutoScrollController
              isAutoScrolling={isAutoScrolling}
              isPausedByUser={isPausedByUser}
              onToggle={toggleAutoScroll}
            />
            <MusicController
              ref={musicRef}
              src={weddingData.music.src}
              autoPlayTrigger={hasOpenedInvitation}
              standalone={false}
              visible={hasOpenedInvitation}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

