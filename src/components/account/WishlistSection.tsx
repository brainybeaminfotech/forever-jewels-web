"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, ShoppingBag, X } from "lucide-react";
import { useCommerce } from "@/hooks/useCommerce";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";

interface WishlistSectionProps {
  items: Product[];
  onChange: (items: Product[]) => void;
}

export function WishlistSection({ items, onChange }: WishlistSectionProps) {
  const { addToCart } = useCommerce();
  const [addedId, setAddedId] = useState<string | null>(null);

  function remove(id: string) {
    onChange(items.filter((product) => product.id !== id));
  }

  function moveToBag(product: Product) {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId((current) => (current === product.id ? null : current)), 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-ink">My Wishlist</h2>
        <p className="mt-1 text-sm text-warm-600">Pieces you&apos;ve saved to consider later.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-warm-300 px-6 py-16 text-center">
          <Heart size={28} className="text-warm-400" />
          <p className="text-sm text-warm-500">Your wishlist is empty — start saving pieces you love.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col border border-warm-200 bg-white"
              >
                <div className="relative aspect-square overflow-hidden bg-warm-100">
                  <Link href={`/products/${product.slug}`} className="relative block h-full w-full" aria-label={product.name}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3.5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="truncate font-display text-sm text-ink transition-colors group-hover:text-gold-600">{product.name}</h3>
                  </Link>
                  <span className="text-sm font-medium text-ink">{formatPrice(product.price, product.currency)}</span>
                  <button
                    type="button"
                    onClick={() => moveToBag(product)}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 border border-ink py-2 text-[11px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-navy hover:bg-navy hover:text-white"
                  >
                    {addedId === product.id ? <Check size={12} /> : <ShoppingBag size={12} />}
                    {addedId === product.id ? "Added" : "Move to Bag"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
