"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

type ConflictingHandlers =
  | "className"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  target?: string;
  rel?: string;
}

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-gold-600 hover:text-ink",
  secondary: "bg-gold-500 text-ink hover:bg-gold-600",
  outline: "border border-ink text-ink hover:bg-navy hover:text-white hover:border-navy",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:text-gold-600",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-xs",
  md: "px-8 py-3.5 text-sm",
  lg: "px-10 py-4 text-sm sm:text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  fullWidth = false,
  icon,
  iconPosition = "right",
  href,
  target,
  rel,
  ...buttonProps
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.15em] transition-colors duration-300",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button whileTap={{ scale: 0.97 }} className={classes} {...buttonProps}>
      {content}
    </motion.button>
  );
}
