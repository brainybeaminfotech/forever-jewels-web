"use client";

import { motion } from "framer-motion";
import { ACCOUNT_SECTIONS } from "@/lib/account";
import type { AccountSectionId } from "@/types";
import { cn } from "@/lib/utils";

interface AccountNavProps {
  active: AccountSectionId;
  onChange: (id: AccountSectionId) => void;
}

export function AccountNav({ active, onChange }: AccountNavProps) {
  return (
    <>
      <div className="-mx-5 mb-8 overflow-x-auto no-scrollbar px-5 sm:-mx-8 sm:px-8 lg:hidden">
        <div className="flex w-max gap-2">
          {ACCOUNT_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === active;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onChange(section.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-xs font-medium transition-colors duration-300",
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-warm-200 text-warm-600 hover:border-gold-400 hover:text-ink"
                )}
              >
                <Icon size={14} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="hidden lg:block">
        <nav className="sticky top-44 flex max-h-[calc(100vh-11rem)] flex-col gap-1 overflow-y-auto border border-warm-200 bg-white p-2">
          {ACCOUNT_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === active;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onChange(section.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-300",
                  isActive ? "bg-warm-50 text-ink" : "text-warm-600 hover:bg-warm-50 hover:text-ink"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="account-nav-indicator"
                    className="absolute inset-y-1 left-0 w-0.5 bg-gold-500"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <Icon size={17} className={cn("shrink-0", isActive ? "text-gold-600" : "text-warm-400")} />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
