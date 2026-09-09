"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPARKLES = [
  { top: "14%", left: "7%", size: 4, delay: 0 },
  { top: "9%", left: "78%", size: 3, delay: 1.1 },
  { top: "38%", left: "93%", size: 5, delay: 2.2 },
  { top: "56%", left: "4%", size: 3, delay: 0.6 },
  { top: "72%", left: "88%", size: 4, delay: 1.7 },
  { top: "88%", left: "18%", size: 5, delay: 2.8 },
  { top: "27%", left: "46%", size: 3, delay: 3.4 },
];

/**
 * Decorative backdrop for dark (navy) sections: a faint gold facet lattice,
 * two slow-drifting glows, a slowly rotating brilliant-cut outline and a few
 * twinkling sparkles. Purely presentational — render inside a `relative`
 * parent, it positions itself absolutely and never captures pointer events.
 */
export function FacetBackdrop({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {/* Facet lattice */}
      <svg className="absolute inset-0 h-full w-full text-gold-400/[0.07]" aria-hidden>
        <defs>
          <pattern
            id="facet-lattice"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path
              d="M0 0H72V72H0z M0 36H72 M36 0V72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="facet-lattice-mask" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="facet-lattice-fade">
            <rect width="100%" height="100%" fill="url(#facet-lattice-mask)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#facet-lattice)" mask="url(#facet-lattice-fade)" />
      </svg>

      {/* Drifting glows */}
      <motion.span
        className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-gold-500/[0.09] blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute -right-48 bottom-0 h-[32rem] w-[32rem] rounded-full bg-gold-300/[0.07] blur-[140px]"
        animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, -60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Solitaire ring outline, gently swaying */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-10 h-[11rem] w-[11rem] -translate-x-1/2 text-gold-300/[0.09] sm:h-[15rem] sm:w-[15rem]"
        animate={reduceMotion ? undefined : { rotate: [-7, 7, -7], y: [0, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
          {/* Band */}
          <circle cx="100" cy="140" r="48" />
          <circle cx="100" cy="140" r="42" />
          {/* Prongs */}
          <path d="M74 54L84 92M126 54L116 92" />
          {/* Brilliant-cut stone */}
          <path d="M82 34h36l12 16H70z" />
          <path d="M70 50h60L100 92z" />
          <path d="M85 50L100 92M115 50L100 92" />
        </g>
      </motion.svg>

      {/* Sparkles */}
      {!reduceMotion &&
        SPARKLES.map((sparkle, index) => (
          <motion.span
            key={index}
            className="absolute bg-gold-200"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
              rotate: "45deg",
            }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.15, 0.4] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
