"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, MessageSquareText, Minus, Plus, Share2, Truck } from "lucide-react";
import { Button } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";
import type { MetalOptionId, Product } from "@/types";

interface BuyBoxProps {
  product: Product;
  metal?: MetalOptionId;
  onMetalChange?: (metal: MetalOptionId) => void;
}

const HIDDEN_HIGHLIGHTS = new Set([
  "Ethically sourced and conflict-free",
  "Independently graded and certified",
  "Includes complimentary resizing within 60 days",
  "Comes packaged in a signature Forever Jewels box",
]);

function estimateDelivery(readyToShip?: boolean, availability?: Product["availability"]) {
  const days = readyToShip ? 3 : availability === "made-to-order" ? 18 : 7;
  const date = new Date(Date.now() + days * 86400000);
  const label = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return { days, label };
}

export function BuyBox({ product, metal, onMetalChange }: BuyBoxProps) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quality, setQuality] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [engrave, setEngrave] = useState(false);
  const [engraveText, setEngraveText] = useState("");
  const [shared, setShared] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const visibleHighlights = useMemo(
    () => (product.highlights ?? []).filter((h) => !HIDDEN_HIGHLIGHTS.has(h)),
    [product.highlights]
  );
  const delivery = useMemo(() => estimateDelivery(product.readyToShip, product.availability), [product.readyToShip, product.availability]);
  const monthly = Math.round(product.price / 12);

  const qualityTiers = product.diamondType
    ? [
        { label: `${product.color ?? "D-E-F"}, ${product.clarity ?? "VVS"}`, note: "Best Value" },
        { label: "F-G, VS", note: "Popular" },
        { label: "Choose Your Own", note: undefined },
      ]
    : [];

  const inquiryHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello Forever Jewels, I'd like to inquire about the ${product.name} (Qty: ${quantity}).`
  )}`;

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : `/products/${product.slug}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // cancelled share sheet
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-warm-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>
          {product.sku && <p className="mt-2 text-xs text-warm-500">SKU: {product.sku}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wishlisted ? "Remove from saved items" : "Save this item"}
            aria-pressed={wishlisted}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm-100 hover:text-red-500"
          >
            <motion.span
              key={wishlisted ? "filled" : "empty"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="flex"
            >
              <Heart size={20} className={cn(wishlisted && "fill-red-500 text-red-500")} />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this product"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm-100 hover:text-gold-600"
          >
            {shared ? <Check size={20} className="text-gold-600" /> : <Share2 size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-2xl font-medium text-ink">{formatPrice(product.price, product.currency)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-base text-warm-400 line-through">{formatPrice(product.compareAtPrice, product.currency)}</span>
            <span className="text-sm font-medium text-gold-600">
              {Math.round(100 - (product.price / product.compareAtPrice) * 100)}% off
            </span>
          </>
        )}
      </div>
      {product.priceMax && product.priceMax > product.price && (
        <p className="mt-1 text-xs text-warm-500">Price varies by selection, up to {formatPrice(product.priceMax, product.currency)}</p>
      )}
      <p className="mt-1 text-xs text-warm-500">
        or as low as <span className="text-ink">{formatPrice(monthly, product.currency)}/mo</span> with 0% APR financing
      </p>

      {product.metalOptions && product.metalOptions.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink">
            Metal: <span className="font-normal text-warm-600">{product.metalOptions.find((m) => m.id === metal)?.label}</span>
          </p>
          <div className="mt-3 flex gap-3">
            {product.metalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onMouseEnter={() => onMetalChange?.(option.id)}
                onFocus={() => onMetalChange?.(option.id)}
                onClick={() => onMetalChange?.(option.id)}
                title={option.label}
                aria-pressed={metal === option.id}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                  metal === option.id ? "border-gold-500" : "border-transparent hover:border-warm-300"
                )}
              >
                <span className="h-7 w-7 rounded-full border border-warm-200" style={{ backgroundColor: option.swatch }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizeLabel && product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink">{product.sizeLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "min-w-11 border px-3 py-2 text-sm transition-colors",
                  size === s ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 text-ink hover:border-gold-400"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {qualityTiers.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink">Diamond Quality</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {qualityTiers.map((tier, index) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => setQuality(index)}
                aria-pressed={quality === index}
                className={cn(
                  "border px-2 py-3 text-center text-xs transition-colors",
                  quality === index ? "border-gold-500 bg-gold-50 text-ink" : "border-warm-300 text-warm-600 hover:border-gold-400"
                )}
              >
                <span className="block font-medium">{tier.label}</span>
                {tier.note && <span className="mt-0.5 block text-[10px] text-gold-600">{tier.note}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.customizable && (
        <div className="mt-6">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                engrave ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 bg-white"
              )}
            >
              {engrave && <Check size={11} strokeWidth={3} />}
            </span>
            <input type="checkbox" checked={engrave} onChange={() => setEngrave((v) => !v)} className="sr-only" />
            Add personalized engraving
          </label>
          {engrave && (
            <input
              type="text"
              maxLength={20}
              value={engraveText}
              onChange={(e) => setEngraveText(e.target.value)}
              placeholder="Enter up to 20 characters"
              className="mt-3 w-full border border-warm-300 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink">Quantity</p>
        <div className="flex items-center border border-warm-300">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold-600">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(5, q + 1))} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold-600">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-warm-600">
        <Truck size={16} className="shrink-0 text-gold-600" />
        {product.availability === "out-of-stock" ? (
          <span>Currently out of stock &mdash; join the waitlist</span>
        ) : (
          <span>
            {product.readyToShip ? "Ready to ship — " : ""}Estimated delivery by <span className="text-ink">{delivery.label}</span>
          </span>
        )}
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={<MessageSquareText size={16} />}
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Inquiry Now
        </Button>
      </div>

      {visibleHighlights.length > 0 && (
        <ul className="mt-8 flex flex-col gap-2.5 border-t border-warm-200 pt-6">
          {visibleHighlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-warm-600">
              <Check size={15} className="mt-0.5 shrink-0 text-gold-600" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
