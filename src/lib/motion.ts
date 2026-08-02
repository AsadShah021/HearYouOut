import type { Transition, Variants } from "framer-motion";

/** Apple-ish spring: fast to start, settles without wobble. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuint = [0.83, 0, 0.17, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easeOutExpo } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: easeOutExpo } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: easeOutExpo } },
};

export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Shared viewport config so sections all trigger at the same scroll depth. */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;
