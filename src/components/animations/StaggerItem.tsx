"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
}

const itemVariants = (distance: number): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
});

export function StaggerItem({ children, className, distance = 24 }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants(distance)} className={className}>
      {children}
    </motion.div>
  );
}
