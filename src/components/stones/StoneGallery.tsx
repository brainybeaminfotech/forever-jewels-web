"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { StoneListItem } from "@/types";
import { cn } from "@/lib/utils";
import { StoneMedia } from "./StoneMedia";

interface StoneGalleryProps {
  stone: StoneListItem;
}

type View = "image" | "video";

export function StoneGallery({ stone }: StoneGalleryProps) {
  const headline = stone.category === "gemstone" ? `${stone.caratWeight}ct ${stone.gemstoneType} ${stone.shape}` : `${stone.caratWeight}ct ${stone.shape} Diamond`;
  const hasVideo = Boolean(stone.video);
  const [active, setActive] = useState<View>("image");

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {hasVideo && (
        <div className="flex shrink-0 gap-3 sm:w-20 sm:flex-col">
          <button
            type="button"
            onMouseEnter={() => setActive("image")}
            onFocus={() => setActive("image")}
            onClick={() => setActive("image")}
            aria-label="View image"
            aria-current={active === "image"}
            className={cn("relative h-20 w-20 shrink-0 overflow-hidden border transition-colors", active === "image" ? "border-gold-500" : "border-warm-200 hover:border-warm-400")}
          >
            <StoneMedia src={stone.image} alt="" sizes="80px" className="object-cover" />
          </button>
          <button
            type="button"
            onMouseEnter={() => setActive("video")}
            onFocus={() => setActive("video")}
            onClick={() => setActive("video")}
            aria-label="Play video"
            aria-current={active === "video"}
            className={cn("relative h-20 w-20 shrink-0 overflow-hidden border transition-colors", active === "video" ? "border-gold-500" : "border-warm-200 hover:border-warm-400")}
          >
            <StoneMedia src={stone.image} alt="" sizes="80px" className="object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
              <Play size={18} className="fill-white text-white" />
            </span>
          </button>
        </div>
      )}

      <div className="relative aspect-square flex-1 overflow-hidden bg-warm-100">
        {active === "video" && stone.video ? (
          <iframe src={stone.video} title={`${headline} — video`} className="h-full w-full border-0" allow="fullscreen" allowFullScreen />
        ) : (
          <StoneMedia src={stone.image} alt={headline} priority sizes="(min-width: 1024px) 50vw, 90vw" className="object-cover" />
        )}
      </div>
    </div>
  );
}
