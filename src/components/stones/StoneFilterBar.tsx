"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Listbox, MultiSelectDropdown, RangeSlider } from "@/components/ui";
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

interface StoneFilterBarProps {
  facets: StoneFacet[];
  filters: StoneFilters;
  onChange: (next: StoneFilters) => void;
  visible: boolean;
  onToggleVisible: () => void;
  resultCount: number;
}

const SINGLE_PAIR_OPTIONS: { value: SinglePairFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "single", label: "Single" },
  { value: "pair", label: "Pair" },
];

function HorizontalFacetScroller({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  function scrollByAmount(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * 168, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Show previous options"
          className="absolute -left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center border border-warm-200 bg-white text-warm-600 shadow-sm transition-colors hover:border-gold-400 hover:text-gold-600"
        >
          <ChevronLeft size={14} />
        </button>
      )}
      <div ref={scrollRef} className="flex gap-2.5 overflow-x-auto scroll-smooth scrollbar-none">
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Show more options"
          className="absolute -right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center border border-warm-200 bg-white text-warm-600 shadow-sm transition-colors hover:border-gold-400 hover:text-gold-600"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

export function StoneFilterBar({ facets, filters, onChange, visible, onToggleVisible, resultCount }: StoneFilterBarProps) {
  function toggleMulti(key: StoneMultiKey, value: string) {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  const expandedFacets = facets.filter((f) => f.type === "shape-icon" || f.type === "swatch" || f.type === "range" || f.type === "quality-range");
  const dropdownFacets = facets.filter((f) => f.type === "checkbox" || f.type === "single-pair");

  return (
    <div className="hidden border border-warm-200 bg-white lg:block">
      <button
        type="button"
        onClick={onToggleVisible}
        aria-expanded={visible}
        aria-controls="stone-filter-panel"
        className="flex w-full items-center justify-between border-b border-warm-200 px-6 py-3 text-left transition-colors hover:bg-warm-50"
      >
        <p className="text-sm text-ink">
          Result <span className="text-warm-500">({resultCount})</span>
        </p>
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-ink">
          <ChevronDown size={14} className={cn("transition-transform duration-300 ease-out", visible && "rotate-180")} />
          {visible ? "Hide" : "Show Filters"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            id="stone-filter-panel"
            key="stone-filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-7 px-6 py-6">
              <div className="grid grid-cols-2 gap-x-10 gap-y-7">
                {expandedFacets.map((facet) => (
                  <div key={facet.key}>
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink">{facet.label}</p>

                    {facet.type === "shape-icon" && (
                      <HorizontalFacetScroller>
                        {facet.options?.map((option) => {
                          const active = filters[facet.key as StoneMultiKey].includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleMulti(facet.key as StoneMultiKey, option.value)}
                              title={`${option.label} (${option.count})`}
                              aria-pressed={active}
                              className={cn(
                                "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border p-1.5 transition-colors",
                                active ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent text-warm-500"
                              )}
                            >
                              {option.thumbnail ? (
                                <Image src={option.thumbnail} alt="" fill unoptimized sizes="48px" className="object-contain p-1" />
                              ) : (
                                <StoneShapeIcon shape={option.value} className="h-full w-full" />
                              )}
                            </button>
                          );
                        })}
                      </HorizontalFacetScroller>
                    )}

                    {facet.type === "swatch" && (
                      <HorizontalFacetScroller>
                        {facet.options?.map((option) => {
                          const active = filters[facet.key as StoneMultiKey].includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleMulti(facet.key as StoneMultiKey, option.value)}
                              title={`${option.label} (${option.count})`}
                              aria-pressed={active}
                              className={cn(
                                "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border transition-all",
                                active ? "border-gold-500" : "border-transparent"
                              )}
                            >
                              {option.thumbnail ? (
                                <Image src={option.thumbnail} alt="" fill unoptimized sizes="36px" className="object-cover p-1" />
                              ) : (
                                <span className="h-7 w-7 border border-warm-200" style={{ backgroundColor: option.swatch ?? "#c8a96a" }} />
                              )}
                            </button>
                          );
                        })}
                      </HorizontalFacetScroller>
                    )}

                    {facet.type === "range" &&
                      (() => {
                        const cfg = rangeFacetConfig(facet, filters);
                        if (!cfg) return null;
                        return <RangeSlider {...cfg} onChange={(lo, hi) => onChange(applyRangeChange(facet, filters, lo, hi))} />;
                      })()}

                    {facet.type === "quality-range" && (
                      <>
                        <RangeSlider
                          min={1}
                          max={5}
                          step={1}
                          valueMin={filters.qualityGradeMin ?? 1}
                          valueMax={filters.qualityGradeMax ?? 5}
                          formatValue={(v) => QUALITY_GRADE_ORDER[Math.round(v) - 1] ?? ""}
                          onChange={(lo, hi) => onChange({ ...filters, qualityGradeMin: lo, qualityGradeMax: hi })}
                        />
                        <div className="mt-2 flex justify-between text-[10px] text-warm-400">
                          <span>{QUALITY_GRADE_NOTE[QUALITY_GRADE_ORDER[Math.round(filters.qualityGradeMin ?? 1) - 1]!]}</span>
                          <span>{QUALITY_GRADE_NOTE[QUALITY_GRADE_ORDER[Math.round(filters.qualityGradeMax ?? 5) - 1]!]}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {dropdownFacets.length > 0 && (
                <div className="flex flex-wrap gap-3 border-t border-warm-200 pt-6">
                  {dropdownFacets.map((facet) =>
                    facet.type === "single-pair" ? (
                      <Listbox
                        key={facet.key}
                        label={facet.label}
                        options={SINGLE_PAIR_OPTIONS}
                        value={filters.singlePair}
                        onChange={(v) => onChange({ ...filters, singlePair: v as SinglePairFilter })}
                      />
                    ) : (
                      <MultiSelectDropdown
                        key={facet.key}
                        label={facet.label}
                        options={facet.options ?? []}
                        selected={filters[facet.key as StoneMultiKey]}
                        onChange={(next) => onChange({ ...filters, [facet.key]: next })}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
