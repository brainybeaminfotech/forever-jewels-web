import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common";
import { ContentSections, PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import {
  EDUCATION_ARTICLES,
  getEducationArticle,
  getEducationArticlesByCategory,
  getEducationCategory,
} from "@/data/education";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EDUCATION_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt, openGraph: { images: [article.image] } };
}

export default async function EducationArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article) notFound();

  const category = getEducationCategory(article.category);
  const more = getEducationArticlesByCategory(article.category)
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={category?.label}
        title={article.title}
        description={article.intro}
        breadcrumb={[{ label: "Education", href: "/education" }]}
      />

      <Container className="pt-12 sm:pt-16">
        <FadeIn direction="up" className="relative aspect-16/9 overflow-hidden bg-warm-100 sm:aspect-21/9">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        </FadeIn>
      </Container>

      <ContentSections
        sections={article.sections}
        contentsLabel="In This Guide"
        meta={
          <>
            {category?.label} — {article.readMinutes} min read
          </>
        }
      />

      {more.length > 0 && (
        <section className="bg-cream">
          <Container className="py-16 sm:py-20">
            <FadeIn direction="up">
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Continue reading</h2>
            </FadeIn>

            <div className="mt-10 grid gap-px bg-warm-200 sm:grid-cols-3">
              {more.map((entry, index) => (
                <FadeIn key={entry.slug} direction="up" delay={index * 0.05} className="bg-white">
                  <Link href={`/education/${entry.slug}`} className="group flex h-full flex-col p-8 hover:bg-warm-50">
                    <p className="font-display text-lg text-ink transition-colors group-hover:text-gold-600 sm:text-xl">
                      {entry.title}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-warm-600">{entry.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-gold-600">
                      Read
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container className="py-16 text-center sm:py-20">
        <FadeIn direction="up">
          <p className="font-display text-2xl text-ink sm:text-3xl">Questions this guide did not answer?</p>
          <Button href="/contact" variant="outline" className="mt-8">
            Ask an Advisor
          </Button>
        </FadeIn>
      </Container>
    </>
  );
}
