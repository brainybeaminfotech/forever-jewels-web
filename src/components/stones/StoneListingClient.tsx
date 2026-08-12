"use client";

import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/ui";
import { StoneFilterDrawer } from "./StoneFilterDrawer";
import { StoneFilterBar } from "./StoneFilterBar";
import { StoneSortBar } from "./StoneSortBar";
import { StoneGrid } from "./StoneGrid";
import type { StoneCategory, StoneListItem } from "@/types";
import {
  applyStoneFilters,
  buildStoneFacets,
  countActiveStoneFilters,
  EMPTY_STONE_FILTERS,
  sortStones,
  STONE_META,
  type StoneFilters,
  type StoneSortKey,
  type StoneView,
} from "@/lib/stones";

interface StoneListingClientProps {
  stones: StoneListItem[];
  category: StoneCategory;
  initialFilters?: Partial<StoneFilters>;
  pageTitle?: string;
}

export function StoneListingClient({ stones, category, initialFilters }: StoneListingClientProps) {
  const [filters, setFilters] = useState<StoneFilters>({ ...EMPTY_STONE_FILTERS, ...initialFilters });
  const [sort, setSort] = useState<StoneSortKey>("featured");
  const [pageSize, setPageSize] = useState(24);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [view, setView] = useState<StoneView>("grid");

  const meta = STONE_META[category];
  const facets = useMemo(() => buildStoneFacets(stones, category), [stones, category]);
  const filtered = useMemo(() => applyStoneFilters(stones, filters), [stones, filters]);
  const sorted = useMemo(() => sortStones(filtered, sort), [filtered, sort]);
  const activeCount = countActiveStoneFilters(filters);

  return (
    <div className="mx-auto max-w-360 px-5 pb-10 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-14 lg:pt-52">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: meta.label, href: `/${category === "diamond" ? "diamonds" : "gemstone"}` }]} />

      <div className="mb-6 mt-6">
        <StoneFilterBar
          facets={facets}
          filters={filters}
          onChange={setFilters}
          visible={filtersVisible}
          onToggleVisible={() => setFiltersVisible((v) => !v)}
          resultCount={sorted.length}
        />
      </div>

      <StoneSortBar
        resultCount={sorted.length}
        sort={sort}
        onSortChange={setSort}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onOpenFilters={() => setMobileFiltersOpen(true)}
        activeFilterCount={activeCount}
        view={view}
        onViewChange={setView}
        facets={facets}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="mt-6">
        <StoneGrid key={`${view}-${sort}-${pageSize}-${JSON.stringify(filters)}`} stones={sorted} pageSize={pageSize} view={view} />
      </div>

      <StoneFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} facets={facets} filters={filters} onChange={setFilters} resultCount={sorted.length} />
    </div>
  );
}
