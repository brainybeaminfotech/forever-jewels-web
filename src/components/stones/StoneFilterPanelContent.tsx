"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RangeSlider, Listbox } from "@/components/ui";
import { FilterSection } from "@/components/jewellery";
import {
  applyRangeChange,
  QUALITY_GRADE_NOTE,
  QUALITY_GRADE_ORDER,
  rangeFacetConfig,
  type StoneFacet,
  type StoneFilters,
  type StoneMultiKey,
  type SinglePairFilter,
} from "@/lib/stones";
import { StoneShapeIcon } from "./StoneShapeIcon";

interface StoneFilterPanelContentProps {
  facets: StoneFacet[];
  filters: StoneFilters;
  onChange: (next: StoneFilters) => void;
}

const SINGLE_PAIR_OPTIONS: { value: SinglePairFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "single", label: "Single" },
  { value: "pair", label: "Pair" },
];

export function StoneFilterPanelContent({ facets, filters, onChange }: StoneFilterPanelContentProps) {
  function toggleMulti(key: StoneMultiKey, value: string) {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <div className="flex flex-col">
      {facets.map((facet) => {
        if (facet.type === "shape-icon") {
          const key = facet.key as StoneMultiKey;
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <div className="grid grid-cols-5 gap-2.5">
                {facet.options?.map((option) => {
                  const active = filters[key].includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleMulti(key, option.value)}
                      title={`${option.label} (${option.count})`}
                      aria-pressed={active}
                      className={cn(
                        "relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden border p-1.5 transition-colors",
                        active ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent text-warm-500"
                      )}
                    >
                      {option.thumbnail ? (
                        <Image src={option.thumbnail} alt="" fill unoptimized sizes="60px" className="object-contain p-1" />
                      ) : (
                        <>
                          <StoneShapeIcon shape={option.value} className="h-5 w-5" />
                          <span className="text-[9px] uppercase tracking-[0.05em]">{option.label}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          );
        }

        if (facet.type === "swatch") {
          const key = facet.key as StoneMultiKey;
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <div className="flex flex-wrap gap-3">
                {facet.options?.map((option) => {
                  const active = filters[key].includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleMulti(key, option.value)}
                      title={`${option.label} (${option.count})`}
                      aria-pressed={active}
                      className={cn(
                        "relative flex h-8 w-8 items-center justify-center overflow-hidden border transition-all",
                        active ? "border-gold-500" : "border-transparent"
                      )}
                    >
                      {option.thumbnail ? (
                        <Image src={option.thumbnail} alt="" fill unoptimized sizes="32px" className="object-cover p-1" />
                      ) : (
                        <span className="h-6 w-6 border border-warm-200" style={{ backgroundColor: option.swatch ?? "#c8a96a" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          );
        }

        if (facet.type === "checkbox") {
          const key = facet.key as StoneMultiKey;
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <div className="flex flex-col gap-3">
                {facet.options?.map((option) => {
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
        }

        if (facet.type === "range") {
          const cfg = rangeFacetConfig(facet, filters);
          if (!cfg) return null;
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <RangeSlider {...cfg} onChange={(lo, hi) => onChange(applyRangeChange(facet, filters, lo, hi))} />
            </FilterSection>
          );
        }

        if (facet.type === "quality-range") {
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <RangeSlider
                min={1}
                max={5}
                step={1}
                valueMin={filters.qualityGradeMin ?? 1}
                valueMax={filters.qualityGradeMax ?? 5}
                formatValue={(v) => {
                  const grade = QUALITY_GRADE_ORDER[Math.round(v) - 1];
                  return grade ? `${grade}` : "";
                }}
                onChange={(lo, hi) => onChange({ ...filters, qualityGradeMin: lo, qualityGradeMax: hi })}
              />
              <div className="mt-2 flex justify-between text-[10px] text-warm-400">
                <span>{QUALITY_GRADE_NOTE[QUALITY_GRADE_ORDER[Math.round(filters.qualityGradeMin ?? 1) - 1]!]}</span>
                <span>{QUALITY_GRADE_NOTE[QUALITY_GRADE_ORDER[Math.round(filters.qualityGradeMax ?? 5) - 1]!]}</span>
              </div>
            </FilterSection>
          );
        }

        if (facet.type === "single-pair") {
          return (
            <FilterSection key={facet.key} title={facet.label}>
              <Listbox
                options={SINGLE_PAIR_OPTIONS}
                value={filters.singlePair}
                onChange={(v) => onChange({ ...filters, singlePair: v as SinglePairFilter })}
                className="w-full"
              />
            </FilterSection>
          );
        }

        return null;
      })}
    </div>
  );
}
