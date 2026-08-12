"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { Container, SectionHeading } from "@/components/common";
import { cn } from "@/lib/utils";

const engagementRings = CATEGORIES.find((c) => c.slug === "engagement-rings")!;
const weddingRings = CATEGORIES.find((c) => c.slug === "wedding-rings")!;

const EXPLORE_CATEGORIES = [
  {
    ...engagementRings,
    id: "cat-rings",
    slug: "rings",
    title: "Rings",
    description: "Solitaires, halo settings, and bands for every forever moment.",
    productCount: engagementRings.productCount + weddingRings.productCount,
  },
  ...CATEGORIES.filter((c) =>
    ["earrings", "necklaces", "bracelets", "pendants"].includes(c.slug)
  ),
];

export function ExploreProducts() {
  const [activeId, setActiveId] = useState(
    EXPLORE_CATEGORIES[2]?.id ?? EXPLORE_CATEGORIES[0]!.id
  );

  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="Shop By Category"
          title="Explore Our Products"
          description="Five curated categories, each hand-finished by our master jewelers using certified stones and precious metals."
        />

        {/* Desktop: interactive expanding row */}
        <div
          className="mt-14 hidden gap-3 lg:flex lg:h-140"
          onMouseLeave={() => setActiveId(EXPLORE_CATEGORIES[2]?.id ?? EXPLORE_CATEGORIES[0]!.id)}
        >
          {EXPLORE_CATEGORIES.map((category) => {
            const isActive = activeId === category.id;
            return (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                className={cn(
                  "group relative h-full overflow-hidden bg-warm-200 transition-[flex] duration-500 ease-out",
                  isActive ? "flex-[2.6]" : "flex-1"
                )}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1200px) 30vw, 18vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-t transition-opacity duration-500",
                    isActive ? "from-navy/75 via-navy/10 to-transparent" : "from-navy/60 via-navy/20 to-navy/10"
                  )}
                />

                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.35em] text-white transition-opacity duration-300",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {category.title}
                </span>

                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-2 p-7 transition-all duration-500",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                >
                  <h3 className="font-display text-2xl text-white">{category.title}</h3>
                  <p className="text-sm text-white/75 line-clamp-2">{category.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-300">
                    Shop Now <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile / tablet: grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          {EXPLORE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative aspect-3/4 overflow-hidden bg-warm-200"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 45vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/75 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-base text-white sm:text-lg">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
