import { Container } from "@/components/common";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui";
import { FadeIn } from "@/components/animations";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Trailing crumb is added automatically from `title`. */
  breadcrumb?: BreadcrumbItem[];
}

/**
 * Shared header for the standalone content pages (About, Our Story, Contact, Careers,
 * Terms, Privacy). Keeps the top of every one of them identical — navy band, gold
 * eyebrow, display title — rather than each page hand-rolling its own.
 */
export function PageHero({ eyebrow, title, description, breadcrumb = [] }: PageHeroProps) {
  return (
    <section className="bg-navy text-white">
      <Container className="pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-52">
        <Breadcrumb light items={[{ label: "Home", href: "/" }, ...breadcrumb, { label: title }]} />
        <FadeIn direction="up" className="mt-8 max-w-3xl">
          {eyebrow && (
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-300 sm:text-sm">{eyebrow}</span>
          )}
          <h1 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {description && (
            <p className="mt-6 max-w-2xl text-balance text-sm leading-relaxed text-white/70 sm:text-base">
              {description}
            </p>
          )}
        </FadeIn>
      </Container>
    </section>
  );
}
