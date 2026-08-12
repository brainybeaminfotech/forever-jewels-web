"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { FilterPanelContent } from "./FilterPanelContent";
import type { Facet, ListingFilters } from "@/lib/catalog";
import { countActiveFilters, EMPTY_FILTERS } from "@/lib/catalog";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  facets: Facet[];
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
  resultCount: number;
}

export function FilterDrawer({ open, onClose, facets, filters, onChange, resultCount }: FilterDrawerProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-90 bg-navy/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-95 flex w-full max-w-sm flex-col bg-white shadow-luxury-lg lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-warm-200 px-6 py-5">
              <h2 className="font-display text-lg text-ink">Filters{activeCount > 0 ? ` (${activeCount})` : ""}</h2>
              <button type="button" onClick={onClose} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <FilterPanelContent facets={facets} filters={filters} onChange={onChange} />
            </div>
            <div className="flex gap-3 border-t border-warm-200 px-6 py-5">
              <Button variant="outline" size="sm" fullWidth onClick={() => onChange(EMPTY_FILTERS)}>
                Clear All
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={onClose}>
                Show {resultCount} Results
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
