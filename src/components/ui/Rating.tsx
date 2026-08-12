import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

export function Rating({ value, reviewCount, size = 14, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const fillRatio = Math.min(Math.max(value - index, 0), 1);
          return (
            <span key={index} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-warm-300" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillRatio * 100}%` }}>
                <Star size={size} className="text-gold-500 fill-gold-500" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {typeof reviewCount === "number" && (
        <span className="text-xs text-warm-500">({reviewCount})</span>
      )}
    </div>
  );
}
