import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { STORY_TIMELINE } from "@/data/company";
import { SITE } from "@/constants/site";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description: `From a single workbench in ${SITE.founded} to a full New Jersey atelier — the story of how ${SITE.name} came to be, told in the decisions that shaped it.`,
  path: "/our-story",
});

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="It started with one bench and a stubborn idea."
        description="That fine jewellery should be made by the people who sell it, from stones they can trace, at a price that reflects the work rather than the marketing."
        breadcrumb={[{ label: "About Us", href: "/about" }]}
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <FadeIn direction="right">
            <h2 className="text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              The commissions nobody else would take
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-warm-600 sm:text-base">
              <p>
                In {SITE.founded} we were one jeweler working above a watch repair shop, taking the commissions the
                larger houses turned down — an heirloom stone reset into something wearable, a ring built around a
                sketch on a napkin.
              </p>
              <p>
                Those jobs were unprofitable and slow, and they taught us the thing the business is still built on:
                the difficult piece is the one worth making properly.
              </p>
              <p>
                Eighteen years later the atelier is larger and the tools are better, but the work still leaves through
                the same hands that started it.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="left" className="relative aspect-4/3 overflow-hidden">
            <Image
              src={IMAGES.handcrafted.secondary}
              alt="Hand-finishing a gold band in the atelier"
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover"
            />
          </FadeIn>
        </div>
      </Container>

      <section className="bg-cream">
        <Container className="py-16 sm:py-20 lg:py-24">
          <FadeIn direction="up" className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">Milestones</span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              Eighteen years, in the moments that mattered
            </h2>
          </FadeIn>

          <ol className="mt-14 space-y-0 border-l border-warm-300">
            {STORY_TIMELINE.map((entry, index) => (
              <FadeIn key={entry.id} direction="up" delay={index * 0.06}>
                <li className="relative pb-12 pl-8 sm:pl-12">
                  <span aria-hidden className="absolute -left-[4.5px] top-2 h-2 w-2 bg-gold-500" />
                  <p className="font-display text-2xl text-gold-600 sm:text-3xl">{entry.year}</p>
                  <p className="mt-2 font-display text-xl text-ink sm:text-2xl">{entry.title}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-warm-600 sm:text-base">
                    {entry.description}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-navy text-white">
        <Container className="py-16 text-center sm:py-20">
          <FadeIn direction="up">
            <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
              The next piece could be yours
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Tell us what you have in mind — a reset heirloom, an engagement ring, or something that does not exist yet.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="secondary">Start a Commission</Button>
              <Button href="/jewellery/rings" variant="outline-light">Browse the Collection</Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
