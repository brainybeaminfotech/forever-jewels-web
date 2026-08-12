"use client";

import { FilterChip } from "@/components/ui";
import type { Facet, ListingFilters } from "@/lib/catalog";
import { countActiveFilters, EMPTY_FILTERS } from "@/lib/catalog";
import { formatPrice } from "@/utils/format";

interface ActiveFilterChipsProps {
  facets: Facet[];
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
}

const MULTI_KEYS = [
  "collection",
  "metal",
  "goldPurity",
  "diamondType",
  "gemstone",
  "shape",
  "style",
  "occasion",
  "gender",
  "size",
  "availability",
  "certification",
] as const;

export function ActiveFilterChips({ facets, filters, onChange }: ActiveFilterChipsProps) {
  const activeCount = countActiveFilters(filters);
  if (activeCount === 0) return null;

  function labelFor(key: string, value: string) {
    const facet = facets.find((f) => f.key === key);
    return facet?.options?.find((o) => o.value === value)?.label ?? value;
  }

  function removeMulti(key: (typeof MULTI_KEYS)[number], value: string) {
    onChange({ ...filters, [key]: filters[key].filter((v) => v !== value) });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {MULTI_KEYS.flatMap((key) =>
        filters[key].map((value) => (
          <FilterChip key={`${key}-${value}`} label={labelFor(key, value)} onRemove={() => removeMulti(key, value)} />
        ))
      )}
      {(filters.priceMin !== null || filters.priceMax !== null) && (
        <FilterChip
          label={`${formatPrice(filters.priceMin ?? 0)} – ${formatPrice(filters.priceMax ?? 0)}`}
          onRemove={() => onChange({ ...filters, priceMin: null, priceMax: null })}
        />
      )}
      {filters.readyToShip && <FilterChip label="Ready to Ship" onRemove={() => onChange({ ...filters, readyToShip: false })} />}
      {filters.customizable && <FilterChip label="Customizable" onRemove={() => onChange({ ...filters, customizable: false })} />}
      {filters.featured && <FilterChip label="New & Bestselling" onRemove={() => onChange({ ...filters, featured: false })} />}
      <button type="button" onClick={() => onChange(EMPTY_FILTERS)} className="text-xs uppercase tracking-[0.1em] text-warm-500 underline hover:text-gold-600">
        Clear All
      </button>
    </div>
  );
}
