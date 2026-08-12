"use client";

import { FilterChip } from "@/components/ui";
import { formatPrice } from "@/utils/format";
import {
  countActiveStoneFilters,
  EMPTY_STONE_FILTERS,
  QUALITY_GRADE_ORDER,
  STONE_MULTI_KEYS,
  type StoneFacet,
  type StoneFilters,
} from "@/lib/stones";

interface StoneActiveFilterChipsProps {
  facets: StoneFacet[];
  filters: StoneFilters;
  onChange: (next: StoneFilters) => void;
}

export function StoneActiveFilterChips({ facets, filters, onChange }: StoneActiveFilterChipsProps) {
  const activeCount = countActiveStoneFilters(filters);
  if (activeCount === 0) return null;

  function labelFor(key: string, value: string) {
    const facet = facets.find((f) => f.key === key);
    return facet?.options?.find((o) => o.value === value)?.label ?? value;
  }

  function removeMulti(key: (typeof STONE_MULTI_KEYS)[number], value: string) {
    onChange({ ...filters, [key]: filters[key].filter((v) => v !== value) });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STONE_MULTI_KEYS.flatMap((key) =>
        filters[key].map((value) => <FilterChip key={`${key}-${value}`} label={labelFor(key, value)} onRemove={() => removeMulti(key, value)} />)
      )}
      {(filters.caratMin !== null || filters.caratMax !== null) && (
        <FilterChip
          label={`${(filters.caratMin ?? 0).toFixed(2)}ct – ${(filters.caratMax ?? 0).toFixed(2)}ct`}
          onRemove={() => onChange({ ...filters, caratMin: null, caratMax: null })}
        />
      )}
      {(filters.priceMin !== null || filters.priceMax !== null) && (
        <FilterChip
          label={`${formatPrice(filters.priceMin ?? 0)} – ${formatPrice(filters.priceMax ?? 0)}`}
          onRemove={() => onChange({ ...filters, priceMin: null, priceMax: null })}
        />
      )}
      {(filters.qualityGradeMin !== null || filters.qualityGradeMax !== null) && (
        <FilterChip
          label={`Quality: ${QUALITY_GRADE_ORDER[(filters.qualityGradeMin ?? 1) - 1]} – ${QUALITY_GRADE_ORDER[(filters.qualityGradeMax ?? 5) - 1]}`}
          onRemove={() => onChange({ ...filters, qualityGradeMin: null, qualityGradeMax: null })}
        />
      )}
      {(filters.lengthMin !== null || filters.lengthMax !== null) && (
        <FilterChip
          label={`Length: ${(filters.lengthMin ?? 0).toFixed(2)}mm – ${(filters.lengthMax ?? 0).toFixed(2)}mm`}
          onRemove={() => onChange({ ...filters, lengthMin: null, lengthMax: null })}
        />
      )}
      {(filters.widthMin !== null || filters.widthMax !== null) && (
        <FilterChip
          label={`Width: ${(filters.widthMin ?? 0).toFixed(2)}mm – ${(filters.widthMax ?? 0).toFixed(2)}mm`}
          onRemove={() => onChange({ ...filters, widthMin: null, widthMax: null })}
        />
      )}
      {(filters.lwMin !== null || filters.lwMax !== null) && (
        <FilterChip
          label={`L/W: ${(filters.lwMin ?? 0).toFixed(2)} – ${(filters.lwMax ?? 0).toFixed(2)}`}
          onRemove={() => onChange({ ...filters, lwMin: null, lwMax: null })}
        />
      )}
      {filters.singlePair !== "any" && (
        <FilterChip label={filters.singlePair === "pair" ? "Pair" : "Single"} onRemove={() => onChange({ ...filters, singlePair: "any" })} />
      )}
      <button type="button" onClick={() => onChange(EMPTY_STONE_FILTERS)} className="text-xs uppercase tracking-[0.1em] text-warm-500 underline hover:text-gold-600">
        Clear All
      </button>
    </div>
  );
}
