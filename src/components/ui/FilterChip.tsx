import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-warm-200 bg-white py-1.5 pl-3 pr-2 text-xs text-ink",
        className
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex h-4 w-4 items-center justify-center text-warm-500 hover:text-ink"
      >
        <X size={12} />
      </button>
    </span>
  );
}
