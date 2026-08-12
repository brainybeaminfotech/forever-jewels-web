"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

export function MultiSelectDropdown({ label, options, selected, onChange, className }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap border bg-white px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:border-gold-400",
          selected.length > 0 ? "border-gold-400 text-ink" : "border-warm-200 text-ink"
        )}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={cn("text-warm-500 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-multiselectable="true"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-40 mt-2 max-h-72 w-60 overflow-y-auto border border-warm-200 bg-white py-1.5 shadow-luxury-lg"
          >
            {options.length === 0 && <li className="px-4 py-2.5 text-sm text-warm-400">No options</li>}
            {options.map((option) => {
              const active = selected.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => toggle(option.value)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-warm-100"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                          active ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 bg-white"
                        )}
                      >
                        {active && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className={active ? "text-ink" : "text-warm-600"}>{option.label}</span>
                    </span>
                    {typeof option.count === "number" && <span className="text-xs text-warm-400">{option.count}</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
