import confetti from "canvas-confetti";

/**
 * Romantic Golden Dust & Love Hearts Explosion when Opening Invitation
 */
export function triggerLoveBurst() {
  if (typeof window === "undefined") return;

  const count = 60;
  const defaults = {
    origin: { y: 0.6 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Golden and Rose Petal Particles
  fire(0.25, {
    spread: 26,
    startVelocity: 45,
    colors: ["#D4AF37", "#F3E5AB", "#E8C374"],
  });

  fire(0.2, {
    spread: 60,
    colors: ["#EBB8B8", "#D98880", "#FADBD8"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#801424", "#D4AF37", "#F5DCDD", "#E8C374", "#FFFFFF"],
    zIndex: 9999,
  });
}

/**
 * Celebration Confetti Burst on RSVP confirmation
 */
export function triggerCelebrationConfetti() {
  if (typeof window === "undefined") return;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#801424", "#D4AF37", "#F5DCDD", "#E8C374", "#FFFFFF"],
    zIndex: 9999,
  });
}
