"use client";

import React, { useState, useEffect } from "react";
import weddingDataJson from "@/data/wedding.json";
import { WeddingData } from "@/types/wedding";
import { useGuestName } from "@/hooks/useGuestName";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useActiveWeddingStage } from "@/hooks/useActiveWeddingStage";
import { ActiveWeddingStage } from "@/lib/wedding-timeline";

import { WeddingOpening } from "@/components/wedding/WeddingOpening";
import { MusicController } from "@/components/wedding/MusicController";
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

  // Guarantee page is always at the absolute top on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  const handleOpenInvitation = () => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setHasOpenedInvitation(true);
  };

  // Smart Cinema Auto-Scroll Behavior:
  // - Starts 1.5s after envelope content is revealed
  // - Pauses immediately when user interacts (touch/scroll/click/key)
  // - Resumes smoothly after 10s of inactivity
  useAutoScroll({
    enabled: hasOpenedInvitation,
    speed: 55,
    initialDelay: 3800,
    resumeDelay: 10000,
  });

  return (
    <main className="relative w-full max-w-[480px] min-h-screen mx-auto bg-background text-textMain shadow-[0_0_90px_rgba(0,0,0,0.85)] border-x border-[#8C1425]/15 overflow-x-hidden">
      {/* 1. Opening Envelope Modal Cover with Love Burst Effect */}
      <WeddingOpening
        couple={weddingData.couple}
        guestName={guestName}
        isPersonalized={isPersonalized}
        onOpen={handleOpenInvitation}
        weddingDateFormatted={stage.weddingDateFormatted}
        ceremonyBadge={stage.ceremonyName}
      />

      {/* 2. Floating Ambient Rose Petals & Golden Sparkles */}
      {hasOpenedInvitation && <FloatingPetals />}

      {/* 3. Floating Background Music Controller (Visible after opening) */}
      {hasOpenedInvitation && (
        <MusicController
          src={weddingData.music.src}
          autoPlayTrigger={hasOpenedInvitation}
        />
      )}

      {/* 4. Cinematic Hero Section */}
      <HeroSection
        couple={weddingData.couple}
        heroPhoto={weddingData.hero.mainPhoto}
        isRevealed={hasOpenedInvitation}
        weddingDateFormatted={stage.weddingDateFormatted}
        ceremonyName={stage.ceremonyName}
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
        />
      </ScrollReveal>

      {/* 13. Gift & QR Banking */}
      <ScrollReveal direction="up" delay={100}>
        <GiftSection gift={weddingData.gift} />
      </ScrollReveal>

      {/* 14. Closing Thank You Section */}
      <ScrollReveal direction="up" delay={100}>
        <ThankYouSection
          couple={weddingData.couple}
          weddingDateFormatted={stage.weddingDateFormatted}
          closingPhoto={
            weddingData.gallery[weddingData.gallery.length - 1]?.src ||
            "/images/TOBI1281.webp"
          }
        />
      </ScrollReveal>

      {/* 15. Mobile Fixed Dock Navigation */}
      {hasOpenedInvitation && <BottomNavigation />}

      {/* 16. Floating Back To Top Button */}
      {hasOpenedInvitation && <BackToTop />}
    </main>
  );
}

