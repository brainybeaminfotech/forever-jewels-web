import type { ReactNode } from "react";
import { Container } from "@/components/common";
import { FadeIn } from "@/components/animations";
import type { ContentSection } from "@/types";

interface ContentSectionsProps {
  sections: ContentSection[];
  /** Small line rendered above the body — e.g. "Last updated", or a category + read time. */
  meta?: ReactNode;
  contentsLabel?: string;
}

/**
 * Long-form document body with a sticky contents rail on desktop. Shared by the legal
 * pages and the education articles — anything section-based should render through this
 * rather than repeating the layout.
 *
 * The rail uses the documented `sticky top-44` + **no `items-start`** grid shape: an
 * `align-items` override shrink-wraps the aside and silently disables sticky positioning
 * (see the AccountNav note).
 */
export function ContentSections({ sections, meta, contentsLabel = "Contents" }: ContentSectionsProps) {
  return (
    <Container className="py-16 sm:py-20 lg:py-24">
      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <nav className="sticky top-44">
            <p className="text-xs uppercase tracking-[0.25em] text-warm-500">{contentsLabel}</p>
            <ul className="mt-5 space-y-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm leading-snug text-warm-600 transition-colors hover:text-gold-600"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          {meta && (
            <div className="border-b border-warm-200 pb-6 text-xs uppercase tracking-[0.2em] text-warm-500">{meta}</div>
          )}

          <div className="mt-10 space-y-12">
            {sections.map((section) => (
              <FadeIn key={section.id} direction="up">
                <section id={section.id} className="scroll-mt-44">
                  <h2 className="font-display text-2xl text-ink sm:text-3xl">{section.title}</h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed text-warm-600 sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-warm-600 sm:text-base">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-gold-500" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
