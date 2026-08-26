import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { EDUCATION_ARTICLES, EDUCATION_CATEGORIES, getEducationArticlesByCategory } from "@/data/education";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Diamond & Jewellery Education",
  description: `Guides to diamonds, gemstones, metals, and buying well — written by the people who make the jewellery at ${SITE.name}.`,
};

export default function EducationPage() {
  // The 4Cs guide leads the page; every other article is grouped by category below.
  const [featured] = EDUCATION_ARTICLES;

  return (
    <>
      <PageHero
        eyebrow="Education"
        title="Know what you are buying."
        description="Plain guidance on diamonds, gemstones, and metals — including the parts of the trade that are usually left vague. No jargon for its own sake, and no advice that only benefits us."
      />

      {featured && (
        <Container className="py-16 sm:py-20">
          <FadeIn direction="up">
            <Link
              href={`/education/${featured.slug}`}
              className="group grid gap-8 border border-warm-200 bg-white p-8 transition-shadow hover:shadow-luxury sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14"
            >
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600">Start Here</span>
                <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-warm-600 sm:text-base">{featured.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-gold-600">
                  Read the Guide
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              <ul className="space-y-3 border-t border-warm-200 pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                {featured.sections.map((section) => (
                  <li key={section.id} className="flex gap-3 text-sm text-warm-600">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-gold-500" />
                    {section.title}
                  </li>
                ))}
              </ul>
            </Link>
          </FadeIn>
        </Container>
      )}

      {EDUCATION_CATEGORIES.map((category, categoryIndex) => {
        const articles = getEducationArticlesByCategory(category.slug).filter((article) => article !== featured);
        if (articles.length === 0) return null;

        return (
          <section key={category.slug} className={categoryIndex % 2 === 0 ? "bg-cream" : undefined}>
            <Container className="py-16 sm:py-20">
              <FadeIn direction="up" className="max-w-2xl">
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">
                  {category.label}
                </span>
                <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
                  {category.description}
                </h2>
              </FadeIn>

              <div className="mt-12 grid gap-px bg-warm-200 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                  <FadeIn key={article.slug} direction="up" delay={index * 0.05} className="bg-white">
                    <Link
                      href={`/education/${article.slug}`}
                      className="group flex h-full flex-col transition-colors hover:bg-warm-50"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-warm-100">
                        <Image
                          src={article.image}
                          alt={article.imageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-8">
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-warm-500">
                        <Clock size={13} className="text-gold-600" />
                        {article.readMinutes} min read
                      </p>
                      <p className="mt-4 font-display text-xl text-ink transition-colors group-hover:text-gold-600 sm:text-2xl">
                        {article.title}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-warm-600">{article.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-gold-600">
                        Read
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <section className="bg-navy text-white">
        <Container className="py-16 text-center sm:py-20">
          <FadeIn direction="up">
            <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
              Still deciding? Ask someone who makes them.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Our advisors will talk you through a stone honestly — including when a higher grade is not worth paying for.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="secondary">Talk to an Advisor</Button>
              <Button href="/diamonds" variant="outline-light">Browse Diamonds</Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
