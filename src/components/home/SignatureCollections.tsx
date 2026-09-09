"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SIGNATURE_COLLECTIONS } from "@/data/collections";
import { Container, FacetBackdrop, SectionHeading } from "@/components/common";
import { Button } from "@/components/ui";
import { SlideIn } from "@/components/animations";
import { cn } from "@/lib/utils";

function CornerMarks() {
  const base = "absolute h-6 w-6 border-gold-300/70 transition-all duration-500";
  return (
    <>
      <span className={cn(base, "left-3 top-3 border-l border-t group-hover:left-2 group-hover:top-2")} />
      <span className={cn(base, "right-3 top-3 border-r border-t group-hover:right-2 group-hover:top-2")} />
      <span className={cn(base, "bottom-3 left-3 border-b border-l group-hover:bottom-2 group-hover:left-2")} />
      <span className={cn(base, "bottom-3 right-3 border-b border-r group-hover:bottom-2 group-hover:right-2")} />
    </>
  );
}

function IndexNode({ index }: { index: number }) {
  return (
    <span className="relative flex h-14 w-14 rotate-45 items-center justify-center border border-gold-500/50 bg-navy shadow-[0_0_35px_-8px_rgba(200,169,106,0.7)]">
      <span className="absolute inset-[5px] border border-gold-500/25" />
      <span className="-rotate-45 font-sans text-sm font-medium tracking-[0.1em] text-gold-300">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}

export function SignatureCollections() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 60%"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 sm:py-28">
      <FacetBackdrop />

      <Container size="wide">
        <SectionHeading
          eyebrow="Curated For You"
          title="Signature Collections"
          description="Four distinct edits, each built around a design philosophy — find the one that matches your story."
          light
        />

        <div ref={listRef} className="relative mt-16 flex flex-col gap-20 sm:gap-28">
          {/* Spine rail — draws itself as the section scrolls into view */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/[0.06] lg:block"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: spineScale }}
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold-500/60 via-gold-400/40 to-transparent lg:block"
          />

          {SIGNATURE_COLLECTIONS.map((collection, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={collection.id}
                className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-24"
              >
                {/* Node sits in the column gap, on the spine */}
                <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                  <IndexNode index={index} />
                </span>

                <SlideIn
                  from={reversed ? "right" : "left"}
                  className={cn("relative", reversed && "lg:order-2")}
                >
                  <div className="group relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                    {/* Light sweep on hover */}
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-[1.1s] ease-out group-hover:left-[110%] group-hover:opacity-100" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
                    <CornerMarks />

                    {collection.piecesCount > 0 && (
                      <span className="absolute bottom-5 left-5 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-ink backdrop-blur">
                        {collection.piecesCount} Pieces
                      </span>
                    )}
                  </div>
                  {/* Offset gold frame */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-gold-500/25 sm:block"
                  />
                </SlideIn>

                <SlideIn from={reversed ? "left" : "right"} className={cn(reversed && "lg:order-1")}>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs font-medium tracking-[0.2em] text-gold-500/70 lg:hidden">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-gold-500/40 lg:hidden" />
                    <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
                      {collection.subtitle}
                    </span>
                  </div>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
                    {collection.title}
                  </h3>
                  <span aria-hidden className="mt-5 flex items-center gap-3 text-gold-500/60">
                    <span className="h-px w-12 bg-gold-500/40" />
                    <span className="h-2 w-2 rotate-45 border border-gold-400/70" />
                    <span className="h-px w-6 bg-gold-500/20" />
                  </span>
                  <p className="mt-5 max-w-md text-balance text-sm sm:text-base leading-relaxed text-white/65">
                    {collection.description}
                  </p>
                  <Button href={collection.href} variant="outline-light" size="md" className="mt-8">
                    {collection.ctaLabel}
                  </Button>
                </SlideIn>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
