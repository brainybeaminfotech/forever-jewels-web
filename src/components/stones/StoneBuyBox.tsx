"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, Heart, MessageSquareText, Share2, Truck } from "lucide-react";
import { Button } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";
import { labVerifyUrl, QUALITY_GRADE_NOTE } from "@/lib/stones";
import type { StoneListItem } from "@/types";

interface StoneBuyBoxProps {
  stone: StoneListItem;
}

function headlineFor(stone: StoneListItem) {
  return stone.category === "gemstone" ? `${stone.caratWeight}ct ${stone.gemstoneType} ${stone.shape}` : `${stone.caratWeight}ct ${stone.shape} Diamond`;
}

function categoryLabelFor(stone: StoneListItem) {
  if (stone.category === "diamond") return stone.growthType === "lab-grown" ? "Lab-Grown Diamond" : "Natural Diamond";
  return stone.gemstoneType ?? "Gemstone";
}

function estimateDelivery() {
  const date = new Date(Date.now() + 5 * 86400000);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function StoneBuyBox({ stone }: StoneBuyBoxProps) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const [shared, setShared] = useState(false);
  const wishlisted = isWishlisted(stone.id);
  const deliveryLabel = useMemo(estimateDelivery, []);
  const verifyUrl = labVerifyUrl(stone.lab);

  const quickFacts = [
    stone.category === "diamond" ? { label: "Color", value: stone.color } : { label: "Color", value: stone.colorLabel },
    { label: "Clarity", value: stone.clarity },
    stone.category === "diamond" ? { label: "Symmetry", value: stone.symmetry } : { label: "Transparency", value: stone.transparency },
    stone.category === "diamond" ? { label: "Certificate", value: stone.lab } : { label: "Quality Grade", value: stone.qualityGrade ? `${stone.qualityGrade} — ${QUALITY_GRADE_NOTE[stone.qualityGrade]}` : undefined },
  ].filter((f) => f.value);

  const inquiryHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello Forever Jewels, I'd like to inquire about the ${headlineFor(stone)} (Stock #${stone.id}).`)}`;

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : `/${stone.category === "diamond" ? "diamonds" : "gemstone"}/stone/${stone.slug}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: headlineFor(stone), url });
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
          <p className="text-xs uppercase tracking-[0.2em] text-warm-500">{categoryLabelFor(stone)}</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{headlineFor(stone)}</h1>
          <p className="mt-2 text-xs text-warm-500">Stock #{stone.id}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => toggleWishlist(stone.id)}
            aria-label={wishlisted ? "Remove from saved items" : "Save this stone"}
            aria-pressed={wishlisted}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm-100 hover:text-red-500"
          >
            <motion.span key={wishlisted ? "filled" : "empty"} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="flex">
              <Heart size={20} className={cn(wishlisted && "fill-red-500 text-red-500")} />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this stone"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm-100 hover:text-gold-600"
          >
            {shared ? <Check size={20} className="text-gold-600" /> : <Share2 size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-2xl font-medium text-ink">{formatPrice(stone.price, stone.currency)}</span>
        <span className="text-sm text-warm-500">{formatPrice(stone.pricePerCarat, stone.currency)}/ct</span>
      </div>

      {quickFacts.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-warm-200 pt-6 sm:grid-cols-4">
          {quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="text-[10px] uppercase tracking-[0.15em] text-warm-500">{f.label}</dt>
              <dd className="mt-1 text-sm text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {stone.certificateNumber && (
        <p className="mt-4 text-xs text-warm-500">
          Certificate #{stone.certificateNumber}
          {verifyUrl && (
            <>
              {" · "}
              <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-600 hover:underline">
                Verify with {stone.lab} <ExternalLink size={11} />
              </a>
            </>
          )}
        </p>
      )}

      <div className="mt-6 flex items-center gap-2 text-sm text-warm-600">
        <Truck size={16} className="shrink-0 text-gold-600" />
        {stone.availability === "unavailable" ? (
          <span>Currently on hold — join the waitlist</span>
        ) : (
          <span>
            Estimated delivery by <span className="text-ink">{deliveryLabel}</span>
          </span>
        )}
      </div>

      <div className="mt-6">
        <Button variant="primary" size="lg" fullWidth icon={<MessageSquareText size={16} />} href={inquiryHref} target="_blank" rel="noopener noreferrer">
          Inquiry Now
        </Button>
      </div>

      <ul className="mt-8 flex flex-col gap-2.5 border-t border-warm-200 pt-6 text-sm text-warm-600">
        <li className="flex items-start gap-2.5">
          <Check size={15} className="mt-0.5 shrink-0 text-gold-600" />
          Independently graded and certified
        </li>
        <li className="flex items-start gap-2.5">
          <Check size={15} className="mt-0.5 shrink-0 text-gold-600" />
          Ethically sourced and conflict-free
        </li>
        <li className="flex items-start gap-2.5">
          <Check size={15} className="mt-0.5 shrink-0 text-gold-600" />
          Free insured shipping and 30-day returns
        </li>
      </ul>
    </div>
  );
}
