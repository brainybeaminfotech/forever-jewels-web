"use client";

import { LayoutGrid, Rows3, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Listbox } from "@/components/ui";
import { STONE_SORT_OPTIONS, type StoneFacet, type StoneFilters, type StoneSortKey, type StoneView } from "@/lib/stones";
import { StoneActiveFilterChips } from "./StoneActiveFilterChips";

const PAGE_SIZE_OPTIONS = [
  { value: "24", label: "24 per page" },
  { value: "48", label: "48 per page" },
  { value: "96", label: "96 per page" },
];

interface StoneSortBarProps {
  resultCount: number;
  sort: StoneSortKey;
  onSortChange: (sort: StoneSortKey) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  view: StoneView;
  onViewChange: (view: StoneView) => void;
  facets: StoneFacet[];
  filters: StoneFilters;
  onFiltersChange: (next: StoneFilters) => void;
}

export function StoneSortBar({
  resultCount,
  sort,
  onSortChange,
  pageSize,
  onPageSizeChange,
  onOpenFilters,
  activeFilterCount,
  view,
  onViewChange,
  facets,
  filters,
  onFiltersChange,
}: StoneSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
      <div className="flex flex-wrap items-center gap-5">
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
        <p className="text-sm text-ink lg:hidden">
          Result <span className="text-warm-500">({resultCount})</span>
        </p>
        {activeFilterCount > 0 && <StoneActiveFilterChips facets={facets} filters={filters} onChange={onFiltersChange} />}
      </div>
      <div className="flex items-center gap-3">
        <Listbox
          label="Show"
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          className="hidden sm:block shrink-0"
        />
        <Listbox label="Sort By" options={STONE_SORT_OPTIONS} value={sort} onChange={(v) => onSortChange(v as StoneSortKey)} className="shrink-0" />
        <div className="hidden items-center gap-1 border border-warm-200 p-0.5 sm:flex">
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={cn("flex h-8 w-8 items-center justify-center transition-colors", view === "list" ? "bg-navy text-white" : "text-warm-500 hover:text-ink")}
          >
            <Rows3 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={cn("flex h-8 w-8 items-center justify-center transition-colors", view === "grid" ? "bg-navy text-white" : "text-warm-500 hover:text-ink")}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
