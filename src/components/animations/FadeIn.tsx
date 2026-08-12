"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance,
  className,
  once = true,
}: FadeInProps) {
  const offset = offsets[direction];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x ? (distance ?? offset.x) : 0,
      y: offset.y ? (distance ?? offset.y) : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
