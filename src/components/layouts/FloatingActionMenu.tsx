"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, CalendarClock, MessageSquareText, Plus } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui";
import { CONTACT_ACTIONS } from "@/constants/site";
import { cn } from "@/lib/utils";

const actions = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: CONTACT_ACTIONS.whatsapp,
    icon: WhatsAppIcon,
    tone: "bg-[#25D366] text-white",
    external: true,
  },
  {
    key: "email",
    label: "Email",
    href: CONTACT_ACTIONS.email,
    icon: Mail,
    tone: "bg-navy text-white",
    external: true,
  },
  {
    key: "inquiry",
    label: "Inquiry",
    href: CONTACT_ACTIONS.inquiry,
    icon: MessageSquareText,
    tone: "bg-white text-ink border border-warm-200",
    external: false,
  },
] as const;

export function FloatingActionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-[75] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
              hidden: { transition: { staggerChildren: 0.05 } },
            }}
            className="flex flex-col items-end gap-3"
          >
            {[...actions].reverse().map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.key}
                  variants={{
                    hidden: { opacity: 0, y: 16, scale: 0.7 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="rounded-full bg-navy/90 px-3 py-1.5 text-xs font-medium text-white shadow-luxury whitespace-nowrap">
                    {action.label}
                  </span>
                  <Link
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    aria-label={action.label}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full shadow-luxury transition-transform duration-300 hover:scale-110",
                      action.tone
                    )}
                  >
                    <Icon size={20} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-ink shadow-gold"
      >
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-400/60" />
        )}
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.3 }}>
          <Plus size={24} />
        </motion.span>
      </motion.button>
    </div>
  );
}
