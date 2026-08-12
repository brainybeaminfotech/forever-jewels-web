"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  from?: "left" | "right" | "bottom";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const startPosition = {
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  bottom: { x: 0, y: 80 },
};

export function SlideIn({
  children,
  from = "bottom",
  delay = 0,
  duration = 0.8,
  className,
  once = true,
}: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...startPosition[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
