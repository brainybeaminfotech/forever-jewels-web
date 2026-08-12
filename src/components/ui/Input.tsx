import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "dark" | "light";
}

export function Input({ variant = "dark", className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full border-b bg-transparent py-3 text-sm outline-none transition-colors duration-300",
        variant === "dark"
          ? "border-warm-300 text-ink placeholder:text-warm-400 focus:border-gold-500"
          : "border-white/30 text-white placeholder:text-white/50 focus:border-gold-400",
        className
      )}
      {...props}
    />
  );
}
