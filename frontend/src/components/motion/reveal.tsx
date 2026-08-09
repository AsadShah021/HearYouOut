"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

const presets: Record<string, Variants> = {
  "fade-up": fadeUp,
  fade: fadeIn,
  scale: scaleIn,
  left: slideInLeft,
  right: slideInRight,
};

type RevealProps = React.ComponentProps<typeof motion.div> & {
  /** Which entrance the element uses. */
  preset?: keyof typeof presets;
  delay?: number;
  as?: React.ElementType;
};

/** Fades a block in the first time it scrolls into view. */
export function Reveal({
  preset = "fade-up",
  delay = 0,
  className,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={presets[preset]}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = React.ComponentProps<typeof motion.div> & {
  stagger?: number;
  delay?: number;
};

/** Parent for `RevealItem` children — animates them in sequence. */
export function Stagger({
  stagger = 0.08,
  delay = 0,
  className,
  children,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  preset = "fade-up",
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { preset?: keyof typeof presets }) {
  return (
    <motion.div variants={presets[preset]} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
