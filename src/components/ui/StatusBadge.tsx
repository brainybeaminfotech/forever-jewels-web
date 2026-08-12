import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/account";

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  className?: string;
}

const TONES: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-navy/10 text-navy",
  processing: "bg-gold-50 text-gold-700",
  danger: "bg-red-50 text-red-600",
  neutral: "bg-warm-100 text-warm-700",
};

const DOT_TONES: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  info: "bg-navy",
  processing: "bg-gold-500",
  danger: "bg-red-500",
  neutral: "bg-warm-400",
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
        TONES[tone],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_TONES[tone])} />
      {label}
    </span>
  );
}
