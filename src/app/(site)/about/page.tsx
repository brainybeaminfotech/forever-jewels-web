import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { COMPANY_VALUES } from "@/data/company";
import { HANDCRAFTED_STATS } from "@/data/stats";
import { SITE } from "@/constants/site";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: `${SITE.name} is a New Jersey atelier crafting certified fine jewellery by hand — meet the people, the standards, and the guarantees behind every piece.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A house built around the bench, not the boardroom."
        description={`${SITE.name} has been designing and hand-finishing fine jewellery in New Jersey since ${SITE.founded}. Everything we sell is made by people we employ, from stones we can account for.`}
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeIn direction="right" className="relative aspect-4/5 overflow-hidden">
            <Image
              src={IMAGES.handcrafted.primary}
              alt="A jeweler setting a diamond at the bench"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </FadeIn>

          <FadeIn direction="left">
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">Who We Are</span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              Fine jewellery, made the slow way
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-warm-600 sm:text-base">
              <p>
                We are a small house by design. Our atelier is in {SITE.city}, {SITE.state}, and the twelve master
                jewelers on staff handle every stage — casting, setting, polishing — without sending work out.
              </p>
              <p>
                That constraint decides what we make. We take on fewer commissions than we could, because a piece that
                is meant to be worn for fifty years should not be assembled in an afternoon.
              </p>
              <p>
                Every centre stone we sell is independently certified, and every specification is published in full on
                the product page — carat, colour, clarity, cut, and the metal weight underneath it.
              </p>
            </div>
            <Button href="/our-story" variant="outline" className="mt-8" icon={<ArrowRight size={16} />} iconPosition="right">
              Read Our Story
            </Button>
          </FadeIn>
        </div>
      </Container>

      <section className="bg-cream">
        <Container className="py-16 sm:py-20">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {HANDCRAFTED_STATS.map((stat, index) => (
              <FadeIn key={stat.id} direction="up" delay={index * 0.08} className="text-center">
                <p className="font-display text-4xl text-ink sm:text-5xl">
                  {stat.value.toLocaleString()}
                  <span className="text-gold-600">{stat.suffix}</span>
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-warm-500">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <FadeIn direction="up" className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">What We Stand For</span>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
            Four commitments we do not trade away
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-px bg-warm-200 sm:grid-cols-2">
          {COMPANY_VALUES.map((value, index) => (
            <FadeIn key={value.id} direction="up" delay={index * 0.06} className="bg-white p-8 sm:p-10">
              <p className="font-display text-xl text-ink sm:text-2xl">{value.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-warm-600">{value.description}</p>
            </FadeIn>
          ))}
        </div>
      </Container>

      <section className="bg-navy text-white">
        <Container className="py-16 text-center sm:py-20">
          <FadeIn direction="up">
            <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
              Come and see the work in person
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Book a private appointment at the atelier, or talk to an advisor about a commission of your own.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="secondary">Contact Us</Button>
              <Link href="/careers" className="text-sm uppercase tracking-[0.2em] text-white/70 underline-offset-4 hover:text-gold-400 hover:underline">
                Work With Us
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
