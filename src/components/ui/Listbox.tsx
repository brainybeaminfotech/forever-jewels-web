"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface ListboxOption {
  value: string;
  label: string;
}

interface ListboxProps {
  options: ListboxOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function Listbox({ options, value, onChange, label, className }: ListboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 whitespace-nowrap border border-warm-200 bg-white px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-gold-400"
      >
        {label && <span className="text-warm-500">{label}:</span>}
        <span className="font-medium">{current?.label ?? ""}</span>
        <ChevronDown size={14} className={cn("text-warm-500 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-40 mt-2 w-56 border border-warm-200 bg-white py-1.5 shadow-luxury-lg"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-warm-100",
                    option.value === value ? "text-gold-600" : "text-ink"
                  )}
                >
                  {option.label}
                  {option.value === value && <Check size={14} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
