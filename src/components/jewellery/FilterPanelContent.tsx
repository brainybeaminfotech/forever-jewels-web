"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import { RangeSlider } from "@/components/ui";
import { FilterSection } from "./FilterSection";
import type { Facet, ListingFilters } from "@/lib/catalog";

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

type MultiKey = (typeof MULTI_KEYS)[number];

function isMultiKey(key: string): key is MultiKey {
  return (MULTI_KEYS as readonly string[]).includes(key);
}

interface FilterPanelContentProps {
  facets: Facet[];
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
}

export function FilterPanelContent({ facets, filters, onChange }: FilterPanelContentProps) {
  function toggleMulti(key: MultiKey, value: string) {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  function toggleBoolean(key: "readyToShip" | "customizable" | "featured") {
    onChange({ ...filters, [key]: !filters[key] });
  }

  return (
    <div className="flex flex-col">
      {facets.map((facet) => {
        if (facet.type === "price") {
          const min = facet.min ?? 0;
          const max = facet.max ?? 0;
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <RangeSlider
                min={min}
                max={max}
                step={10}
                valueMin={filters.priceMin ?? min}
                valueMax={filters.priceMax ?? max}
                formatValue={(v) => formatPrice(v, "USD")}
                onChange={(lo, hi) => onChange({ ...filters, priceMin: lo, priceMax: hi })}
              />
            </FilterSection>
          );
        }

        if (facet.type === "toggle") {
          const key = facet.key as "readyToShip" | "customizable" | "featured";
          return (
            <FilterSection key={facet.key} title={facet.label} defaultOpen={false}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-warm-600">
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                    filters[key] ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 bg-white"
                  )}
                >
                  {filters[key] && <Check size={11} strokeWidth={3} />}
                </span>
                <input type="checkbox" checked={filters[key]} onChange={() => toggleBoolean(key)} className="sr-only" />
                Show {facet.label.toLowerCase()} only
              </label>
            </FilterSection>
          );
        }

        if (!facet.options || facet.options.length === 0) return null;
        const key = facet.key;
        if (!isMultiKey(key)) return null;

        if (facet.type === "swatch") {
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <div className="flex flex-wrap gap-3">
                {facet.options.map((option) => {
                  const active = filters[key].includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleMulti(key, option.value)}
                      title={`${option.label} (${option.count})`}
                      aria-pressed={active}
                      className={cn(
                        "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                        active ? "border-gold-500" : "border-transparent hover:border-warm-300"
                      )}
                    >
                      <span className="h-6 w-6 rounded-full border border-warm-200" style={{ backgroundColor: option.swatch }} />
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          );
        }

        return (
          <FilterSection key={facet.key} title={facet.label}>
            <div className="flex flex-col gap-3">
              {facet.options.map((option) => {
                const active = filters[key].includes(option.value);
                return (
                  <label key={option.value} className="flex cursor-pointer items-center justify-between gap-3 text-sm text-warm-600">
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                          active ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 bg-white"
                        )}
                      >
                        {active && <Check size={11} strokeWidth={3} />}
                      </span>
                      <input type="checkbox" checked={active} onChange={() => toggleMulti(key, option.value)} className="sr-only" />
                      <span className={active ? "text-ink" : undefined}>{option.label}</span>
                    </span>
                    <span className="text-xs text-warm-400">{option.count}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>
        );
      })}
    </div>
  );
}
