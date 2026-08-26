"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Share2, Check } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { useCommerce } from "@/hooks/useCommerce";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const EXTRA_BADGE_LABEL: Record<string, string> = {
  trending: "Trending",
  limited: "Limited Edition",
  "ready-to-ship": "Ready to Ship",
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const [shared, setShared] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(product.metalOptions?.[0]?.id);
  const [interacted, setInteracted] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
      : null;
  const hasRange = product.priceMin != null && product.priceMax != null && product.priceMax > product.priceMin;
  const extraBadges = (product.badges ?? []).filter((b) => b in EXTRA_BADGE_LABEL).slice(0, 1);

  const toneImages = useMemo(
    () =>
      product.images && product.images.length > 0
        ? product.images
        : [product.image, product.hoverImage].filter((v): v is string => Boolean(v)),
    [product.images, product.image, product.hoverImage]
  );
  const selectedMetalIndex = Math.max(0, product.metalOptions?.findIndex((m) => m.id === selectedMetal) ?? 0);
  const activeIndex = selectedMetalIndex % toneImages.length;
  const displayImage = toneImages[activeIndex] ?? product.image;
  // Only stack every tone shot once the shopper actually engages with the card — keeps
  // first paint on the listing grid to a single image per card, while still making the
  // tone swap an instant, network-free crossfade from that point on.
  const stackedImages = interacted ? toneImages : [displayImage];

  async function handleShare() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/products/${product.slug}` : `/products/${product.slug}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // user cancelled share sheet — no-op
    }
  }

  return (
    <motion.div
      className={cn("group flex flex-col", className)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative aspect-4/5 overflow-hidden bg-warm-100"
        onMouseEnter={() => setInteracted(true)}
        onFocus={() => setInteracted(true)}
      >
        <Link
          href={`/products/${product.slug}`}
          className="relative block h-full w-full"
          aria-label={product.name}
        >
          {stackedImages.map((src, i) => {
            const isActive = interacted ? i === activeIndex : true;
            return (
              <Image
                key={src}
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 24vw"
                className={cn(
                  "absolute inset-0 object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-110",
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                )}
              />
            );
          })}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <Badge tone="ink">New</Badge>}
          {product.isBestseller && <Badge tone="gold">Bestseller</Badge>}
          {discount && <Badge tone="outline">-{discount}%</Badge>}
          {extraBadges.map((b) => (
            <Badge key={b} tone="warm">
              {EXTRA_BADGE_LABEL[b]}
            </Badge>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex translate-y-1 flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110"
          >
            <motion.span
              key={wishlisted ? "filled" : "empty"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="flex"
            >
              <Heart size={16} className={cn(wishlisted && "fill-red-500 text-red-500")} />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110"
          >
            {shared ? <Check size={16} className="text-gold-600" /> : <Share2 size={16} />}
          </button>
        </div>

        {product.metalOptions && product.metalOptions.length > 0 && (
          <div className="absolute inset-x-0 bottom-3 flex translate-y-1 justify-center opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
              {product.metalOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseEnter={() => setSelectedMetal(option.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedMetal(option.id);
                  }}
                  title={option.label}
                  aria-label={option.label}
                  aria-pressed={selectedMetal === option.id}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                    selectedMetal === option.id ? "border-gold-500" : "border-transparent hover:border-warm-300"
                  )}
                >
                  <span className="h-4 w-4 rounded-full border border-warm-200" style={{ backgroundColor: option.swatch }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.2em] text-warm-500">{product.category}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-lg text-ink transition-colors duration-300 group-hover:text-gold-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          {hasRange ? (
            <span className="text-base font-medium text-ink">
              {formatPrice(product.priceMin!, product.currency)} &ndash; {formatPrice(product.priceMax!, product.currency)}
            </span>
          ) : (
            <>
              <span className="text-base font-medium text-ink">{formatPrice(product.price, product.currency)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-warm-400 line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
