"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface ProductSectionProps {
  title: ReactNode;
  /** Short line under the heading, e.g. "Every measurement, as supplied by our atelier." */
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Disclosure section for the product detail page.
 *
 * Deliberately separate from `FilterSection`, which is shared with the filter sidebar and
 * is intentionally compact — the PDP wants a larger heading and far more vertical room.
 * The whole header row is the button so clicking anywhere in it toggles the section.
 */
export function ProductSection({ title, description, children, defaultOpen = true }: ProductSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-warm-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 py-7 text-left sm:py-8"
      >
        <span>
          <span className="font-display text-xl text-ink transition-colors group-hover:text-gold-600 sm:text-2xl">
            {title}
          </span>
          {description && <span className="mt-1.5 block text-sm text-warm-500">{description}</span>}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-warm-200 text-warm-500 transition-colors group-hover:border-gold-400 group-hover:text-gold-600">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 sm:pb-12">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
