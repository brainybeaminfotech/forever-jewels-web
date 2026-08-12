"use client";

import Image from "next/image";
import { Gem } from "lucide-react";
import { HANDCRAFTED_STATS } from "@/data/stats";
import { IMAGES } from "@/lib/images";
import { Container } from "@/components/common";
import { Button } from "@/components/ui";
import { FadeIn, SlideIn } from "@/components/animations";
import { useCountUp } from "@/hooks/useCountUp";

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: current } = useCountUp(value);

  return (
    <div className="border-l border-gold-300/60 pl-4">
      <p className="font-display text-3xl text-ink sm:text-4xl">
        <span ref={ref}>{current.toLocaleString()}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-warm-500">{label}</p>
    </div>
  );
}

export function HandcraftedDiamonds() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <SlideIn from="left" className="relative">
            <div className="relative aspect-[4/5] w-full max-w-lg overflow-hidden">
              <Image
                src={IMAGES.handcrafted.primary}
                alt="Diamond ring, necklace, and earring set, hand-finished in gold"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden aspect-[4/5] w-40 overflow-hidden border-8 border-white shadow-luxury-lg sm:right-6 sm:block sm:w-48">
              <Image
                src={IMAGES.handcrafted.secondary}
                alt="Ring and pendant earring set, hand-finished in gold"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </SlideIn>

          <div>
            <FadeIn direction="up" className="flex items-center gap-3 text-gold-600">
              <Gem size={20} />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em]">
                Handcrafted Diamonds
              </span>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h2 className="mt-5 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                Every Stone, Set by Hand. Every Piece, Made to Last.
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 max-w-xl text-balance text-sm sm:text-base leading-relaxed text-warm-600">
                Since {new Date().getFullYear() - 18}, our master jewelers have hand-selected, cut, and
                set every diamond that carries the Forever Jewels name. No two pieces leave our atelier
                the same way twice — each is inspected, polished, and finished entirely by hand before
                it reaches you.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {HANDCRAFTED_STATS.map((stat) => (
                  <StatCounter key={stat.id} {...stat} />
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.4} className="mt-10">
              <Button href="/about" variant="primary" size="lg">
                Our Craftsmanship
              </Button>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
