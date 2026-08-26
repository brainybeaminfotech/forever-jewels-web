"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Diamond } from "lucide-react";
import { DiamondShapeIcon } from "@/components/common";
import { cn } from "@/lib/utils";
import type { DiamondShape, MegaMenu, NavLinkIcon } from "@/types";

/**
 * Photographic renders shown in the promo panel when a shape is hovered.
 * Keyed by `DiamondShape`; a shape with no render simply leaves the default promo image
 * in place rather than showing a gap.
 */
const SHAPE_RENDERS: Partial<Record<DiamondShape, string>> = {
  round: "/diamond-shapes/round.png",
  radiant: "/diamond-shapes/radiant.png",
  princess: "/diamond-shapes/princess.png",
  asscher: "/diamond-shapes/asscher.png",
  cushion: "/diamond-shapes/cushion.png",
  marquise: "/diamond-shapes/marquise.png",
  emerald: "/diamond-shapes/emerald.png",
  heart: "/diamond-shapes/heart.png",
  oval: "/diamond-shapes/oval.png",
  pear: "/diamond-shapes/pear.png",
};

interface MegaMenuPanelProps {
  menu: MegaMenu;
  onNavigate: () => void;
}

function RingIcon({ className }: { className?: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="14.5" r="6" />
      <path d="M9.5 8.5L12 3l2.5 5.5-2.5 2.2z" />
    </svg>
  );
}

function LinkIcon({ icon }: { icon: NavLinkIcon }) {
  if (icon === "setting") return <RingIcon className="text-gold-600" />;
  return <Diamond size={20} strokeWidth={1} className="text-gold-600" />;
}

export function MegaMenuPanel({ menu, onNavigate }: MegaMenuPanelProps) {
  const [hoveredShape, setHoveredShape] = useState<DiamondShape | null>(null);

  const hoveredRender = hoveredShape ? SHAPE_RENDERS[hoveredShape] : undefined;
  const hoveredLabel = menu.shapes?.find((shape) => shape.shape === hoveredShape)?.label;

  return (
    <div className="flex items-stretch">
      <div className="flex flex-wrap gap-x-14 gap-y-10 px-8 py-10 lg:flex-nowrap xl:px-12">
      {menu.shapes && menu.shapes.length > 0 && (
        <div className="w-full shrink-0 lg:w-auto lg:basis-80">
          <p className="font-display text-sm uppercase tracking-[0.15em] text-ink">{menu.shapesHeading}</p>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4" onMouseLeave={() => setHoveredShape(null)}>
            {menu.shapes.map((shape) => (
              <Link
                key={shape.label}
                href={shape.href}
                onClick={onNavigate}
                onMouseEnter={() => setHoveredShape(shape.shape)}
                onFocus={() => setHoveredShape(shape.shape)}
                className="group flex items-center gap-3 text-sm text-warm-600 transition-colors hover:text-gold-600"
              >
                <DiamondShapeIcon
                  shape={shape.shape}
                  size={26}
                  className="shrink-0 text-warm-400 transition-colors group-hover:text-gold-600"
                />
                {shape.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {menu.columns.map((column) => (
        <div key={column.heading} className="w-44 shrink-0">
          <p className="font-display text-sm uppercase tracking-[0.15em] text-ink">{column.heading}</p>
          <div className="mt-5 flex flex-col gap-4">
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onNavigate}
                className="group flex items-center gap-3 text-sm text-warm-600 transition-colors hover:text-gold-600"
              >
                {link.icon && <LinkIcon icon={link.icon} />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      </div>

      {menu.promo && (
        <Link
          href={hoveredShape ? (menu.shapes?.find((s) => s.shape === hoveredShape)?.href ?? menu.promo.href ?? "#") : (menu.promo.href ?? "#")}
          onClick={onNavigate}
          className="group relative hidden w-[26rem] shrink-0 self-stretch overflow-hidden bg-warm-50 xl:block"
        >
          {/*
            Default lifestyle shot stays mounted underneath; the hovered shape's render
            cross-fades over it. Both are always in the DOM so switching between shapes
            never shows a blank frame while the next image decodes.
          */}
          <Image
            src={menu.promo.image}
            alt={menu.promo.alt}
            fill
            sizes="(min-width: 1280px) 26rem, 0px"
            className={cn(
              "object-cover transition-[opacity,transform] duration-500 group-hover:scale-105",
              hoveredRender ? "opacity-0" : "opacity-100",
            )}
          />

          {menu.shapes?.map((shape) => {
            const render = SHAPE_RENDERS[shape.shape];
            if (!render) return null;
            const active = hoveredShape === shape.shape;
            return (
              <Image
                key={shape.shape}
                src={render}
                alt={`${shape.label} cut diamond`}
                fill
                sizes="(min-width: 1280px) 26rem, 0px"
                className={cn(
                  "object-contain p-12 transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            );
          })}

          {hoveredLabel && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-white via-white/85 to-transparent px-8 pb-7 pt-12 text-center font-display text-lg text-ink">
              {hoveredLabel}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
