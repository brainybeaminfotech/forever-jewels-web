"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { isRemoteImage } from "@/lib/images";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { cn } from "@/lib/utils";
import type { MetalOptionId, ProductMediaVariant } from "@/types";

interface Cell {
  view: string;
  metal: MetalOptionId;
  type: "image" | "video";
  src: string;
}

function viewTagFor(src: string) {
  const m = src.match(/-([A-Za-z0-9]+)\.[a-z]+$/i);
  return (m?.[1] ?? src).toUpperCase();
}

function buildCells(variants: ProductMediaVariant[]): Cell[] {
  const cells: Cell[] = [];
  for (const variant of variants) {
    for (const src of variant.images) {
      if (viewTagFor(src) === "MV") continue;
      cells.push({ view: viewTagFor(src), metal: variant.metal, type: "image", src });
    }
    if (variant.video) cells.push({ view: "VIDEO", metal: variant.metal, type: "video", src: variant.video });
  }
  return cells;
}

// Every view appears once, in first-seen order, with the video (if any) trailing last.
function buildViewOrder(cells: Cell[]): string[] {
  const order: string[] = [];
  const seen = new Set<string>();
  for (const cell of cells) {
    if (cell.view === "VIDEO") continue;
    if (!seen.has(cell.view)) {
      seen.add(cell.view);
      order.push(cell.view);
    }
  }
  if (cells.some((c) => c.view === "VIDEO")) order.push("VIDEO");
  return order;
}

interface ProductGalleryProps {
  variants: ProductMediaVariant[];
  activeMetal: MetalOptionId | undefined;
  name: string;
}

export function ProductGallery({ variants, activeMetal, name }: ProductGalleryProps) {
  const cells = useMemo(() => buildCells(variants), [variants]);
  const viewOrder = useMemo(() => buildViewOrder(cells), [cells]);
  const metal = activeMetal ?? variants[0]?.metal;

  // Which VIEW is on stage — independent of tone, so switching tone never resets this.
  // Derived rather than effect-synced: falls back to the first view whenever the raw
  // selection doesn't exist in the current product's view set (e.g. after navigating to
  // a different product without a full remount).
  const [rawActiveView, setActiveView] = useState(viewOrder[0]);
  const activeView = rawActiveView && viewOrder.includes(rawActiveView) ? rawActiveView : viewOrder[0];

  const swiperRef = useRef<SwiperClass | null>(null);
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());

  const activeCell = cells.find((c) => c.view === activeView && c.metal === metal);

  // Play only the on-stage video; keep every other mounted video paused.
  useEffect(() => {
    for (const [key, el] of videoRefs.current) {
      if (key === `${activeView}:${metal}`) {
        el.currentTime = 0;
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [activeView, metal]);

  useEffect(() => {
    const index = viewOrder.indexOf(activeView ?? "");
    if (index >= 0) swiperRef.current?.slideTo(index);
  }, [activeView, viewOrder]);

  if (viewOrder.length === 0) return null;

  // One thumbnail per view, showing the active tone's shot (falling back to any tone that has it).
  const thumbCells = viewOrder.map((view) => cells.find((c) => c.view === view && c.metal === metal) ?? cells.find((c) => c.view === view)!);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {viewOrder.length > 1 && (
        <div className="flex shrink-0 gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
          {thumbCells.map((cell) => (
            <button
              key={cell.view}
              type="button"
              onMouseEnter={() => setActiveView(cell.view)}
              onFocus={() => setActiveView(cell.view)}
              onClick={() => setActiveView(cell.view)}
              aria-label={cell.type === "video" ? "Play video" : `View ${cell.view.toLowerCase()}`}
              aria-current={activeView === cell.view}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden border transition-colors",
                activeView === cell.view ? "border-gold-500" : "border-warm-200 hover:border-warm-400"
              )}
            >
              {cell.type === "video" ? (
                <>
                  <video src={cell.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                    <Play size={18} className="fill-white text-white" />
                  </span>
                </>
              ) : (
                <Image src={cell.src} unoptimized={isRemoteImage(cell.src)} alt="" fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="hidden sm:block sm:flex-1">
        <div className="relative aspect-square overflow-hidden bg-warm-100">
          {/* Every tone × view is preloaded and stacked here so tone/view switches are an
              instant opacity crossfade instead of a network-bound remount. */}
          {cells.map((cell) => {
            const isActive = cell === activeCell;
            if (cell.type === "video") {
              return (
                <video
                  key={cell.src}
                  ref={(el) => {
                    if (el) videoRefs.current.set(`${cell.view}:${cell.metal}`, el);
                  }}
                  src={cell.src}
                  controls={isActive}
                  muted
                  loop
                  playsInline
                  preload={isActive ? "auto" : "none"}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
                    isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                />
              );
            }
            return (
              <Image
                key={cell.src}
                src={cell.src}
                unoptimized={isRemoteImage(cell.src)}
                alt={name}
                fill
                priority={isActive}
                sizes="(min-width: 1024px) 60vw, 90vw"
                className={cn("absolute inset-0 object-cover transition-opacity duration-500 ease-out", isActive ? "opacity-100" : "pointer-events-none opacity-0")}
              />
            );
          })}
        </div>
      </div>

      <div className="sm:hidden">
        <Swiper spaceBetween={0} slidesPerView={1} onSwiper={(s) => (swiperRef.current = s)} onSlideChange={(s) => setActiveView(viewOrder[s.activeIndex])}>
          {thumbCells.map((cell) => (
            <SwiperSlide key={cell.view}>
              <div className="relative aspect-square bg-warm-100">
                {cell.type === "video" ? (
                  <video src={cell.src} controls muted loop playsInline className="h-full w-full object-cover" />
                ) : (
                  <Image src={cell.src} unoptimized={isRemoteImage(cell.src)} alt={name} fill sizes="100vw" className="object-cover" priority={cell.view === activeView} />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
