"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, FacetBackdrop } from "@/components/common";
import { Breadcrumb, Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { STONE_COMING_SOON } from "@/data/stone-coming-soon";
import { cn } from "@/lib/utils";
import type { StoneCategory } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Side profile of a brilliant cut: table edge at y=30 (x 60–180), girdle at y=90 (x 20–220), culet at (120, 220). */
const OUTLINE = "M60 30H180L220 90L120 220L20 90Z";
const FACETS = [
  // Crown
  "M20 90L60 30L80 90Z",
  "M60 30L80 90L100 30Z",
  "M80 90L100 30L120 90Z",
  "M100 30L120 90L140 30Z",
  "M120 90L140 30L160 90Z",
  "M140 30L160 90L180 30Z",
  "M160 90L180 30L220 90Z",
  // Pavilion
  "M20 90L80 90L120 220Z",
  "M80 90L120 90L120 220Z",
  "M120 90L160 90L120 220Z",
  "M160 90L220 90L120 220Z",
];
const FACET_TINT = [0.06, 0.16, 0.09, 0.2, 0.09, 0.16, 0.06, 0.04, 0.12, 0.07, 0.03];

const STAR = "M0 -9L1.6 -1.6L9 0L1.6 1.6L0 9L-1.6 1.6L-9 0L-1.6 -1.6Z";
const GLINTS = [
  { x: 188, y: 26, scale: 1.2, delay: 2.6 },
  { x: 30, y: 66, scale: 0.7, delay: 3.8 },
  { x: 214, y: 132, scale: 0.6, delay: 4.6 },
  { x: 74, y: 176, scale: 0.8, delay: 5.4 },
];

/** The centrepiece: a brilliant cut that draws itself facet by facet, then catches a sweep of light. */
function FacetedStone() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 240 250" className="h-auto w-full overflow-visible" aria-hidden>
        <defs>
          <clipPath id="stone-coming-soon-clip">
            <path d={OUTLINE} />
          </clipPath>
          <linearGradient id="stone-coming-soon-shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="stone-coming-soon-glow">
            <stop offset="0" stopOpacity="0.28" style={{ stopColor: "var(--color-gold-300)" }} />
            <stop offset="1" stopOpacity="0" style={{ stopColor: "var(--color-gold-300)" }} />
          </radialGradient>
        </defs>

        <motion.circle
          cx="120"
          cy="110"
          r="125"
          fill="url(#stone-coming-soon-glow)"
          animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <ellipse cx="120" cy="240" rx="64" ry="5" className="fill-gold-300/15" />

        {/* Facet fills settle in once the cut lines are drawn */}
        <motion.g
          className="text-gold-200"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: EASE }}
        >
          {FACETS.map((d, index) => (
            <path key={d} d={d} fill="currentColor" fillOpacity={FACET_TINT[index]} />
          ))}
        </motion.g>

        {/* Polishing sweep */}
        {!reduceMotion && (
          <g clipPath="url(#stone-coming-soon-clip)">
            <g transform="skewX(-20)">
              <motion.rect
                y="0"
                width="70"
                height="250"
                fill="url(#stone-coming-soon-shine)"
                initial={{ x: -140 }}
                animate={{ x: 320 }}
                transition={{ duration: 2.2, delay: 2.6, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
              />
            </g>
          </g>
        )}

        {/* Cut lines */}
        <g fill="none" stroke="currentColor" strokeLinejoin="round" className="text-gold-300">
          {FACETS.map((d, index) => (
            <motion.path
              key={d}
              d={d}
              strokeWidth="0.75"
              strokeOpacity="0.55"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.5 + index * 0.08, ease: EASE }}
            />
          ))}
          <motion.path
            d={OUTLINE}
            strokeWidth="1.5"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </g>

        {/* Glints */}
        {!reduceMotion &&
          GLINTS.map((glint) => (
            <g key={`${glint.x}-${glint.y}`} transform={`translate(${glint.x} ${glint.y}) scale(${glint.scale})`}>
              <motion.path
                d={STAR}
                className="fill-gold-100"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90] }}
                transition={{ duration: 1.6, delay: glint.delay, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
              />
            </g>
          ))}
      </svg>
    </motion.div>
  );
}

/** Stands in for a letter "o" in the wordmark, so "Coming Soon" is literally spelled in diamonds. */
function DiamondGlyph({ delay }: { delay: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="1.5 2.5 21 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      className="mx-[0.03em] inline-block h-[0.58em] w-[0.61em] overflow-visible text-gold-400"
    >
      <motion.path
        d="M6 3h12l4 6-10 13L2 9Z"
        fill="currentColor"
        initial={{ fillOpacity: 0.1 }}
        animate={reduceMotion ? undefined : { fillOpacity: [0.1, 0.45, 0.1] }}
        transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      />
      <path d="M2 9h20M11 3 8 9l4 13 4-13-3-6" strokeWidth="0.9" />
    </svg>
  );
}

function CraftProgress({ stages, current }: { stages: string[]; current: number }) {
  const reduceMotion = useReducedMotion();
  // The rail runs between the centres of the first and last columns.
  const inset = 50 / stages.length;
  const filled = ((100 - inset * 2) * current) / (stages.length - 1);

  return (
    <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
      <span aria-hidden className="absolute top-[7px] h-px bg-white/15" style={{ left: `${inset}%`, right: `${inset}%` }} />
      <motion.span
        aria-hidden
        className="absolute top-[7px] h-px origin-left bg-gold-400"
        style={{ left: `${inset}%`, width: `${filled}%` }}
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
      />

      {stages.map((stage, index) => {
        const state = index < current ? "done" : index === current ? "current" : "pending";
        return (
          <li
            key={stage}
            aria-current={state === "current" ? "step" : undefined}
            className="relative flex flex-col items-center gap-3"
          >
            <span
              className={cn(
                "relative flex h-[15px] w-[15px] rotate-45 items-center justify-center border",
                state === "done" && "border-gold-400 bg-gold-400",
                state === "current" && "border-gold-300 bg-navy",
                state === "pending" && "border-white/25 bg-navy"
              )}
            >
              {state === "current" && (
                <>
                  <span className="h-[5px] w-[5px] bg-gold-300" />
                  {!reduceMotion && (
                    <motion.span
                      className="absolute inset-0 border border-gold-300"
                      animate={{ scale: [1, 2.1], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </>
              )}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-[10px] uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.2em]",
                state === "done" && "text-white/80",
                state === "current" && "font-medium text-gold-300",
                state === "pending" && "text-white/40"
              )}
            >
              {stage}
              <span className="sr-only">{state === "done" ? " — complete" : state === "current" ? " — in progress" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Placeholder for the loose-stone routes (`/diamonds`, `/gemstone` and their sub-routes) while
 * the inventory is being prepared — same navy/gold language as the rest of the site, with the
 * "coming soon" message told in a stone's own terms (cut, polished, graded…).
 */
export function StoneComingSoon({ category }: { category: StoneCategory }) {
  const copy = STONE_COMING_SOON[category];

  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <FacetBackdrop ornament={false} />

      <Container size="wide" className="pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-52">
        <Breadcrumb light items={[{ label: "Home", href: "/" }, { label: copy.label }]} />

        <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:mt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <FadeIn
            direction="none"
            duration={1}
            className="order-first mx-auto w-full max-w-[13rem] sm:max-w-[17rem] lg:order-last lg:max-w-md"
          >
            <FacetedStone />
          </FadeIn>

          <div className="text-center lg:text-left">
            <FadeIn direction="up">
              <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-gold-300 sm:text-sm">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
                {copy.label}
              </span>
              <h1 className="mt-5 font-display text-[2.5rem] leading-none min-[380px]:text-5xl sm:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
                <span className="sr-only">Coming Soon</span>
                <span aria-hidden className="whitespace-nowrap">
                  C<DiamondGlyph delay={0} />
                  ming S<DiamondGlyph delay={0.5} />
                  <DiamondGlyph delay={1} />n
                </span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <p className="mt-8 text-balance font-display text-2xl leading-snug sm:text-3xl">{copy.headline}</p>
              <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/65 sm:text-base lg:mx-0">
                {copy.description}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} className="mx-auto mt-10 max-w-lg lg:mx-0">
              <CraftProgress stages={copy.stages} current={copy.currentStage} />
              <p className="mt-6 text-xs leading-relaxed text-white/50">{copy.statusLine}</p>
            </FadeIn>

            <FadeIn
              direction="up"
              delay={0.3}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button href={copy.guide.href} variant="secondary" size="lg">
                {copy.guide.label}
              </Button>
              <Button href="/jewellery" variant="outline-light" size="lg">
                Shop Fine Jewellery
              </Button>
            </FadeIn>

            <FadeIn direction="up" delay={0.35} className="mt-7">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-gold-300"
              >
                {copy.expertLabel}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>
        </div>

        <FadeIn direction="up" className="mt-16 border-t border-white/10 pt-8 text-center sm:mt-20">
          <p className="text-balance font-display text-base italic text-white/45 sm:text-lg">“{copy.closingLine}”</p>
        </FadeIn>
      </Container>
    </section>
  );
}
