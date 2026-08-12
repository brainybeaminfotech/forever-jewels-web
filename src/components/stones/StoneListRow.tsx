"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { Badge } from "@/components/ui";
import type { StoneListItem } from "@/types";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import { buildStoneListColumns } from "@/lib/stones";
import { StoneMedia } from "./StoneMedia";

interface StoneListRowProps {
  stone: StoneListItem;
  className?: string;
}

function headline(stone: StoneListItem) {
  const carat = `${stone.caratWeight}ct`;
  return stone.category === "gemstone" ? `${carat} ${stone.gemstoneType} ${stone.shape}` : `${carat} ${stone.shape}`;
}

export function StoneListRow({ stone, className }: StoneListRowProps) {
  const detailHref = `/${stone.category === "diamond" ? "diamonds" : "gemstone"}/stone/${stone.slug}`;
  const columns = buildStoneListColumns(stone);
  const onSale = stone.compareAtPrice != null && stone.compareAtPrice > stone.price;

  return (
    <div className={cn("flex flex-col gap-5 border-b border-warm-200 py-6 sm:flex-row sm:items-center", className)}>
      <Link href={detailHref} className="relative h-40 w-full shrink-0 overflow-hidden bg-warm-100 sm:h-28 sm:w-28" aria-label={headline(stone)}>
        <StoneMedia src={stone.image} alt={headline(stone)} sizes="(max-width: 640px) 100vw, 112px" className="object-cover" />
        {stone.video && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.08em] text-ink">
            <Video size={10} />
            360°
          </span>
        )}
        {stone.availability === "unavailable" && (
          <span className="absolute right-1.5 top-1.5">
            <Badge tone="outline">On Hold</Badge>
          </span>
        )}
      </Link>

      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-5">
        {columns.map((col) => (
          <div key={col.label}>
            <p className="text-sm text-ink">{col.value}</p>
            <p className="text-[11px] text-warm-500">{col.label}</p>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2 sm:text-right">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-warm-500">Sale Price</p>
          <div className="flex items-baseline gap-2 sm:justify-end">
            {onSale && <span className="text-xs text-warm-400 line-through">{formatPrice(stone.compareAtPrice!, stone.currency)}</span>}
            <p className="text-lg font-medium text-ink">{formatPrice(stone.price, stone.currency)}</p>
          </div>
        </div>
        <Link
          href={detailHref}
          className="border border-ink px-5 py-2 text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
