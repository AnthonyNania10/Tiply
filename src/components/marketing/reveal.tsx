"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

/**
 * Horizontal offsets are intentionally unused. An element sitting at
 * `x: 24` while it waits to enter the viewport expands `document`
 * `scrollWidth` on a 390px phone, which is how a 12px page-wide
 * overflow showed up in capture. Vertical motion does not.
 */
const OFFSET: Record<Direction, { y: number }> = {
  up: { y: 24 },
  left: { y: 24 },
  right: { y: 24 },
  none: { y: 0 },
};

/**
 * The single place scroll animation is defined for the marketing pages.
 *
 * Keeping it in one small client component lets every section stay a Server
 * Component, and gives one place to honour `prefers-reduced-motion`. The CSS
 * reduced-motion block in globals.css cannot reach Framer Motion, which
 * animates via inline styles, so the hook is what actually disables it.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const { y } = OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers direct children on reveal. Used for card grids, where animating
 * each card separately would mean a `Reveal` per card and a delay prop to
 * maintain by hand.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
