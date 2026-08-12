"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ConflictingHandlers =
  | "className"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  children: ReactNode;
  label: string;
  count?: number;
  variant?: "dark" | "light";
  className?: string;
}

export function IconButton({
  children,
  label,
  count,
  variant = "dark",
  className,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center transition-colors duration-300",
        variant === "dark" ? "text-ink hover:text-gold-600" : "text-white hover:text-gold-300",
        className
      )}
      {...props}
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </motion.button>
  );
}
