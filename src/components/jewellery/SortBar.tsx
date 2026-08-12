"use client";

import { SlidersHorizontal } from "lucide-react";
import { Listbox } from "@/components/ui";
import { SORT_OPTIONS, type SortKey } from "@/lib/catalog";

interface SortBarProps {
  resultCount: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export function SortBar({ resultCount, sort, onSortChange, onOpenFilters, activeFilterCount }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-warm-200 pb-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2 border border-warm-200 px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-ink lg:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-warm-500">
          {resultCount} {resultCount === 1 ? "Result" : "Results"}
        </p>
      </div>
      <Listbox
        label="Sort By"
        options={SORT_OPTIONS}
        value={sort}
        onChange={(v) => onSortChange(v as SortKey)}
        className="shrink-0"
      />
    </div>
  );
}
