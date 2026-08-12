"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui";
import type { Product } from "@/types";

const PAGE_SIZE = 12;

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, products.length));
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, products.length]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-display text-2xl text-ink">No pieces match your filters</p>
        <p className="text-sm text-warm-500">Try removing a filter or two to see more results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
        {shown.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (index % PAGE_SIZE) * 0.03, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

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
