"use client";

import { MotionConfig } from "framer-motion";

/**
 * Framer Motion animates in JS, so the CSS `prefers-reduced-motion` override in
 * globals.css doesn't reach it. `reducedMotion="user"` makes every transform
 * animation respect the OS setting while keeping opacity fades.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5 }}>
      {children}
    </MotionConfig>
  );
}
