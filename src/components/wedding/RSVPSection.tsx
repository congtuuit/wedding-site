"use client";

import React, { useState, useEffect } from "react";
import { WeddingEvent } from "@/types/wedding";
import { submitRSVP, getSavedRSVP, RSVPData } from "@/lib/rsvp";
import { triggerCelebrationConfetti } from "@/lib/confetti";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { CheckCircle2, Send, Users, Heart, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface RSVPSectionProps {
  events: WeddingEvent[];
  initialGuestName: string;
  isPersonalized: boolean;
  webhookUrl?: string;
  showEventSelection?: boolean;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({
  events,
  initialGuestName,
  isPersonalized,
  webhookUrl,
  showEventSelection = false,
}) => {
  const { dict } = useLocale();
  const [guestName, setGuestName] = useState<string>("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [guestCount, setGuestCount] = useState<number>(1);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("" );

  // Initialize guest name
  useEffect(() => {
    const saved = getSavedRSVP();
    if (saved) {
      setGuestName(saved.guestName);
      setAttending(saved.attending);
      setSelectedEvent(saved.eventSelected);
      setGuestCount(saved.numberOfGuests);
      setIsSubmitted(true);
    } else if (isPersonalized && initialGuestName) {
      setGuestName(initialGuestName);
    }
  }, [initialGuestName, isPersonalized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert(dict.rsvp.alertNameRequired);
      return;
    }

    setIsSubmitting(true);

    const rsvpData: RSVPData = {
      guestName: guestName.trim(),
      attending,
      eventSelected: selectedEvent,
      numberOfGuests: guestCount,
      submittedAt: new Date().toISOString(),
    };

    const res = await submitRSVP(rsvpData, webhookUrl);

    setIsSubmitting(false);
    if (res.success) {
      setIsSubmitted(true);
      setStatusMessage(res.message);
      if (attending === "yes") {
        triggerCelebrationConfetti();
      }
    }
  };

  return (
    <section id="rsvp" className="w-full py-20 px-4 bg-background text-textMain relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold">
          {dict.rsvp.subtitle}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1.5">
          {dict.rsvp.title}
        </h2>
        <p className="text-xs text-textMuted font-sans mt-1.5">
          {dict.rsvp.description}
        </p>

        <SectionDivider variant="botanical" className="my-4" />

        {/* Success State */}
        {isSubmitted ? (
          <div className="mt-8 p-8 rounded-3xl bg-surface border border-accent/30 shadow-md text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-textMain font-medium">
              {dict.rsvp.successTitle}
            </h3>
            <p className="text-sm text-textMuted font-sans max-w-md mx-auto leading-relaxed">
              {dict.rsvp.successMessage(guestName)}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-accent underline hover:text-accent/80 font-sans cursor-pointer"
              >
                {dict.rsvp.editResponse}
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form
            onSubmit={handleSubmit}
            className="mt-8 p-6 sm:p-10 rounded-3xl bg-surface border border-borderLight shadow-sm space-y-6 text-left"
          >
            {/* Guest Name */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-sans font-semibold text-textMain">
                {dict.rsvp.guestNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={dict.rsvp.guestNamePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans transition-all min-h-[48px]"
              />
            </div>

            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-sans font-semibold text-textMain">
                {dict.rsvp.attendingLabel} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={`flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl border text-[12.5px] sm:text-sm font-sans font-medium transition-all min-h-[46px] cursor-pointer whitespace-nowrap ${
                    attending === "yes"
                      ? "bg-accent text-white border-accent shadow-sm"
                      : "bg-background border-borderLight text-textMuted hover:text-textMain"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 shrink-0" />
                  <span>{dict.rsvp.attendingYes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={`flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl border text-[12.5px] sm:text-sm font-sans font-medium transition-all min-h-[46px] cursor-pointer whitespace-nowrap ${
                    attending === "no"
                      ? "bg-surfaceDark text-textMain border-accent/40 shadow-sm"
                      : "bg-background border-borderLight text-textMuted hover:text-textMain"
                  }`}
                >
                  <span>{dict.rsvp.attendingNo}</span>
                </button>
              </div>
            </div>

            {/* If Attending: Select Event & Number of guests */}
            {attending === "yes" && (
              <>
                {showEventSelection && (
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-sans font-semibold text-textMain">
                      {dict.rsvp.eventSelectionLabel}
                    </label>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-background border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans transition-all min-h-[48px]"
                    >
                      <option value="all">{dict.rsvp.eventOptionAll}</option>
                      {events && events.length > 0 ? (
                        events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="sg">{dict.rsvp.eventOptionSg}</option>
                          <option value="que">{dict.rsvp.eventOptionQue}</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-sans font-semibold text-textMain">
                    {dict.rsvp.guestCountLabel}
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-sans font-medium transition-all min-h-[44px] cursor-pointer ${
                          guestCount === num
                            ? "bg-accentGold text-white border-accentGold shadow-sm"
                            : "bg-background border-borderLight text-textMuted hover:text-textMain"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-accent text-white font-sans font-semibold text-sm tracking-wider uppercase hover:bg-accent/90 shadow-md transition-all active:scale-[0.99] min-h-[50px] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{dict.rsvp.submitting}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{dict.rsvp.submitButton}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
