"use client";

import { useMemo, useState } from "react";
import { CompareTray } from "./CompareTray";
import { FilterDrawer } from "./FilterDrawer";
import { FilterPanelContent } from "./FilterPanelContent";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { SortBar } from "./SortBar";
import { ProductGrid } from "./ProductGrid";
import type { Product, JewelleryCategorySlug } from "@/types";
import {
  applyFilters,
  buildFacets,
  countActiveFilters,
  EMPTY_FILTERS,
  sortProducts,
  type ListingFilters,
  type SortKey,
} from "@/lib/catalog";

interface ListingClientProps {
  products: Product[];
  category: JewelleryCategorySlug;
}

export function ListingClient({ products, category }: ListingClientProps) {
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const facets = useMemo(() => buildFacets(products, category), [products, category]);
  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-360 px-5 pb-10 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-14 lg:pt-52">
      <div className="flex gap-12">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto pb-10 pr-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-xs uppercase tracking-[0.1em] text-warm-500 underline hover:text-gold-600"
                >
                  Clear All
                </button>
              )}
            </div>
            <FilterPanelContent facets={facets} filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <SortBar
            resultCount={sorted.length}
            sort={sort}
            onSortChange={setSort}
            onOpenFilters={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeCount}
          />
          <div className="my-6">
            <ActiveFilterChips facets={facets} filters={filters} onChange={setFilters} />
          </div>
          <ProductGrid key={`${sort}-${JSON.stringify(filters)}`} products={sorted} />
        </div>
      </div>

      <FilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        facets={facets}
        filters={filters}
        onChange={setFilters}
        resultCount={sorted.length}
      />

      <CompareTray products={products} />
    </div>
  );
}
