"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Heart, Rotate3d } from "lucide-react";
import { Badge } from "@/components/ui";
import type { StoneListItem } from "@/types";
import { formatPrice } from "@/utils/format";
import { useCommerce } from "@/hooks/useCommerce";
import { cn } from "@/lib/utils";
import { labVerifyUrl } from "@/lib/stones";
import { StoneMedia } from "./StoneMedia";

interface StoneCardProps {
  stone: StoneListItem;
  className?: string;
}

function headline(stone: StoneListItem) {
  const carat = `${stone.caratWeight}ct`;
  return stone.category === "gemstone" ? `${carat} ${stone.gemstoneType} ${stone.shape}` : `${carat} ${stone.shape}`;
}

function subline(stone: StoneListItem) {
  if (stone.category === "gemstone") {
    return [stone.colorLabel, stone.clarity ?? stone.transparency].filter(Boolean).join(" · ");
  }
  return [stone.color, stone.clarity].filter(Boolean).join(" · ");
}

const imageTagClass = "inline-flex items-center gap-1 bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink shadow-sm";

export function StoneCard({ stone, className }: StoneCardProps) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const wishlisted = isWishlisted(stone.id);
  const detailHref = `/${stone.category === "diamond" ? "diamonds" : "gemstone"}/stone/${stone.slug}`;
  const verifyUrl = labVerifyUrl(stone.lab);
  const onSale = stone.compareAtPrice != null && stone.compareAtPrice > stone.price;

  return (
    <motion.div
      className={cn("group flex flex-col border border-warm-200 bg-white transition-shadow duration-300 hover:shadow-luxury", className)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-square overflow-hidden bg-warm-100">
        <Link href={detailHref} className="relative block h-full w-full" aria-label={headline(stone)}>
          <StoneMedia
            src={stone.image}
            alt={headline(stone)}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 24vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {stone.lab &&
            (verifyUrl ? (
              <a href={verifyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title={`Verify ${stone.lab} certificate`} className={imageTagClass}>
                <BadgeCheck size={12} className="text-gold-600" />
                {stone.lab}
              </a>
            ) : (
              <span className={imageTagClass}>
                <BadgeCheck size={12} className="text-gold-600" />
                {stone.lab}
              </span>
            ))}
          {stone.video && (
            <span className={cn(imageTagClass, "text-warm-600")}>
              <Rotate3d size={12} />
              360°
            </span>
          )}
          {stone.availability === "unavailable" && <Badge tone="outline">On Hold</Badge>}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(stone.id)}
          aria-label={wishlisted ? "Remove from saved items" : "Save this stone"}
          aria-pressed={wishlisted}
          title="Wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <Heart size={16} className={cn(wishlisted && "fill-red-500 text-red-500")} />
        </button>
      </div>

      <Link href={detailHref} className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate font-display text-base text-ink transition-colors duration-300 group-hover:text-gold-600">{headline(stone)}</h3>
          <div className="flex shrink-0 items-baseline gap-1">
            {onSale && <span className="text-xs text-warm-400 line-through">{formatPrice(stone.compareAtPrice!, stone.currency)}</span>}
            <span className="text-base font-semibold text-ink">{formatPrice(stone.price, stone.currency)}</span>
            <span className="text-[10px] font-medium uppercase text-warm-500">{stone.currency}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-xs uppercase tracking-wider text-warm-500">{subline(stone)}</p>
          <p className="shrink-0 text-xs uppercase tracking-wider text-warm-400">Item# {stone.id}</p>
        </div>
      </Link>
    </motion.div>
  );
}
