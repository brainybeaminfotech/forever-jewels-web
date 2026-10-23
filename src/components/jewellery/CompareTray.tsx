"use client";

import { useState } from "react";
import Image from "next/image";
import { isRemoteImage } from "@/lib/images";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { Button, Rating } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/types";

interface CompareTrayProps {
  products: Product[];
}

export function CompareTray({ products }: CompareTrayProps) {
  const { compare, toggleCompare, clearCompare } = useCommerce();
  const [modalOpen, setModalOpen] = useState(false);
  const compared = products.filter((p) => compare.includes(p.id));

  return (
    <>
      <AnimatePresence>
        {compared.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-70 border-t border-warm-200 bg-white shadow-luxury-lg"
          >
            <div className="mx-auto flex max-w-360 flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {compared.map((p) => (
                    <div key={p.id} className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-warm-100">
                      <Image src={p.image} unoptimized={isRemoteImage(p.image)} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-ink">
                  {compared.length} item{compared.length > 1 ? "s" : ""} selected to compare
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={clearCompare} className="text-xs uppercase tracking-[0.1em] text-warm-500 underline hover:text-ink">
                  Clear
                </button>
                <Button variant="primary" size="sm" icon={<Scale size={14} />} onClick={() => setModalOpen(true)} disabled={compared.length < 2}>
                  Compare Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-100 bg-navy/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-4 z-101 overflow-auto bg-white shadow-luxury-lg sm:inset-10"
            >
              <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
                <h2 className="font-display text-xl text-ink">Compare</h2>
                <button type="button" onClick={() => setModalOpen(false)} aria-label="Close compare" className="text-ink">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-x-auto p-6">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      <th className="w-40 pb-4 pr-4 align-bottom text-xs uppercase tracking-[0.1em] text-warm-500">Piece</th>
                      {compared.map((p) => (
                        <th key={p.id} className="min-w-52 pb-4 pr-4 align-bottom">
                          <div className="relative mb-3 aspect-square w-full overflow-hidden bg-warm-100">
                            <Image src={p.image} unoptimized={isRemoteImage(p.image)} alt={p.name} fill sizes="200px" className="object-cover" />
                          </div>
                          <p className="font-display text-base text-ink">{p.name}</p>
                          <Rating value={p.rating} reviewCount={p.reviewCount} className="mt-1" />
                          <button
                            type="button"
                            onClick={() => toggleCompare(p.id)}
                            className="mt-2 text-xs uppercase tracking-[0.1em] text-warm-500 underline hover:text-ink"
                          >
                            Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-warm-200">
                      <td className="py-3 pr-4 font-medium text-ink">Price</td>
                      {compared.map((p) => (
                        <td key={p.id} className="py-3 pr-4 text-warm-600">
                          {formatPrice(p.price, p.currency)}
                        </td>
                      ))}
                    </tr>
                    {specRows(compared).map((row) => (
                      <tr key={row.label} className="border-t border-warm-200">
                        <td className="py-3 pr-4 font-medium text-ink">{row.label}</td>
                        {row.values.map((value, i) => (
                          <td key={compared[i]!.id} className="py-3 pr-4 text-warm-600">
                            {value || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function specRows(products: Product[]) {
  const labels = new Set<string>();
  for (const p of products) for (const s of p.specs ?? []) labels.add(s.label);
  return [...labels].map((label) => ({
    label,
    values: products.map((p) => p.specs?.find((s) => s.label === label)?.value ?? ""),
  }));
}
