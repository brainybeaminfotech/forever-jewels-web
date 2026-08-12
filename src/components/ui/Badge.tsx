import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "gold" | "ink" | "outline" | "warm";
  className?: string;
}

const tones = {
  gold: "bg-gold-500 text-ink",
  ink: "bg-navy text-white",
  outline: "border border-white/80 text-white",
  warm: "bg-white/95 text-ink",
};

export function Badge({ children, tone = "gold", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
