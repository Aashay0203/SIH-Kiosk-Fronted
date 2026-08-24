// src/utils/confettiFX.js
import confetti from "canvas-confetti";

/**
 * Triggers a multi-stage celebration confetti burst
 */
export function fireCelebrationConfetti() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#38bdf8", "#3b82f6", "#10b981", "#fbbf24", "#a855f7"],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch (e) {
    // Graceful fallback
  }
}

export default {
  fireCelebrationConfetti,
};
