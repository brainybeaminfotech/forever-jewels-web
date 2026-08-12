import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <FadeIn
      direction="up"
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs sm:text-sm font-medium uppercase tracking-[0.35em]",
            light ? "text-gold-300" : "text-gold-600"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl sm:text-4xl lg:text-5xl leading-tight",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-balance text-sm sm:text-base leading-relaxed",
            light ? "text-white/70" : "text-warm-600",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </FadeIn>
  );
}
