import type { Metadata } from "next";
import { Briefcase, MapPin } from "lucide-react";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { CAREER_BENEFITS, JOB_OPENINGS } from "@/data/company";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Open roles at ${SITE.name} — bench jewelers, setters, designers, and client advisors working in our New Jersey atelier.`,
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work where the work is actually made."
        description="We hire people who want to spend a career getting better at one difficult thing — and then give them the bench, the training, and the time to do it."
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <FadeIn direction="up" className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">Why Join Us</span>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
            A small house that invests in its people
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-px bg-warm-200 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_BENEFITS.map((benefit, index) => (
            <FadeIn key={benefit.id} direction="up" delay={index * 0.06} className="bg-white p-8">
              <p className="font-display text-xl text-ink">{benefit.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">{benefit.description}</p>
            </FadeIn>
          ))}
        </div>
      </Container>

      <section className="bg-cream">
        <Container className="py-16 sm:py-20 lg:py-24">
          <FadeIn direction="up" className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">
              Open Positions
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              {JOB_OPENINGS.length} roles open right now
            </h2>
          </FadeIn>

          <div className="mt-12 divide-y divide-warm-200 border-y border-warm-200 bg-white">
            {JOB_OPENINGS.map((job, index) => (
              <FadeIn key={job.id} direction="up" delay={index * 0.05}>
                <article className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-ink sm:text-2xl">{job.title}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.15em] text-warm-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-gold-600" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gold-600" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-warm-600">{job.description}</p>
                  </div>

                  <Button
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Application — ${job.title}`)}`}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    Apply Now
                  </Button>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy text-white">
        <Container className="py-16 text-center sm:py-20">
          <FadeIn direction="up">
            <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
              Nothing here fits, but you still want in?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Send us your portfolio anyway. We have made room for the right person more than once.
            </p>
            <Button
              href={`mailto:${SITE.email}?subject=${encodeURIComponent("Speculative application")}`}
              variant="secondary"
              className="mt-9"
            >
              Send an Introduction
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
