"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StoneCard } from "./StoneCard";
import { StoneListRow } from "./StoneListRow";
import type { StoneListItem } from "@/types";
import type { StoneView } from "@/lib/stones";

interface StoneGridProps {
  stones: StoneListItem[];
  pageSize: number;
  view?: StoneView;
}

export function StoneGrid({ stones, pageSize, view = "grid" }: StoneGridProps) {
  const [visible, setVisible] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shown = stones.slice(0, visible);
  const hasMore = visible < stones.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + pageSize, stones.length));
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, stones.length, pageSize]);

  if (stones.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-display text-2xl text-ink">No stones match your filters</p>
        <p className="text-sm text-warm-500">Try removing a filter or two to see more results.</p>
      </div>
    );
  }

  return (
    <>
      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((stone, index) => (
            <motion.div
              key={stone.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % pageSize) * 0.02, ease: [0.22, 1, 0.36, 1] }}
            >
              <StoneCard stone={stone} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {shown.map((stone, index) => (
            <motion.div
              key={stone.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % pageSize) * 0.02, ease: [0.22, 1, 0.36, 1] }}
            >
              <StoneListRow stone={stone} />
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center pt-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-warm-400">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-warm-300 border-t-gold-500" />
            Loading more
          </div>
        </div>
      )}
    </>
  );
}
