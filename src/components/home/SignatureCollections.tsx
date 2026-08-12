"use client";

import Image from "next/image";
import { SIGNATURE_COLLECTIONS } from "@/data/collections";
import { Container, SectionHeading } from "@/components/common";
import { Button } from "@/components/ui";
import { SlideIn } from "@/components/animations";
import { cn } from "@/lib/utils";

export function SignatureCollections() {
  return (
    <section className="bg-navy py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="Curated For You"
          title="Signature Collections"
          description="Four distinct edits, each built around a design philosophy — find the one that matches your story."
          light
        />

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {SIGNATURE_COLLECTIONS.map((collection, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={collection.id}
                className={cn(
                  "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
                )}
              >
                <SlideIn
                  from={reversed ? "right" : "left"}
                  className={cn("relative aspect-[4/3]", reversed && "lg:order-2")}
                >
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover"
                  />
                  {collection.piecesCount > 0 && (
                    <span className="absolute bottom-5 left-5 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-ink backdrop-blur">
                      {collection.piecesCount} Pieces
                    </span>
                  )}
                </SlideIn>

                <SlideIn from={reversed ? "left" : "right"} className={cn(reversed && "lg:order-1")}>
                  <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
                    {collection.subtitle}
                  </span>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
                    {collection.title}
                  </h3>
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
