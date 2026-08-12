"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Diamond, Phone, Mail, X, LogIn, UserPlus, UserRound } from "lucide-react";
import { MAIN_NAVIGATION, MOBILE_UTILITY_LINKS } from "@/data/navigation";
import { SITE, SOCIAL_LINKS } from "@/constants/site";
import { DiamondShapeIcon, Logo } from "@/components/common";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-90 bg-navy/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-95 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-luxury-lg lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-warm-200 px-6 py-5">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-4">
              {MAIN_NAVIGATION.map((item) => {
                const isExpanded = expanded === item.label;
                return (
                  <div key={item.label} className="border-b border-warm-100">
                    <div className="flex items-center justify-between py-4">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-sm uppercase tracking-[0.15em] text-ink"
                      >
                        {item.label}
                      </Link>
                      {(item.children || item.megaMenu) && (
                        <button
                          type="button"
                          aria-label={`Toggle ${item.label} submenu`}
                          aria-expanded={isExpanded}
                          onClick={() => setExpanded(isExpanded ? null : item.label)}
                          className="flex h-8 w-8 items-center justify-center text-warm-500"
                        >
                          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                            <ChevronDown size={16} />
                          </motion.span>
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {item.children && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3 pb-4 pl-4">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={onClose}
                                className="text-sm text-warm-600 hover:text-gold-600"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence initial={false}>
                      {item.megaMenu && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-6 pb-5 pl-4">
                            {item.megaMenu.shapes && (
                              <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-warm-500">
                                  {item.megaMenu.shapesHeading}
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
                                  {item.megaMenu.shapes.map((shape) => (
                                    <Link
                                      key={shape.label}
                                      href={shape.href}
                                      onClick={onClose}
                                      className="flex items-center gap-2 text-sm text-warm-600 hover:text-gold-600"
                                    >
                                      <DiamondShapeIcon shape={shape.shape} size={20} className="shrink-0 text-warm-400" />
                                      {shape.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.megaMenu.columns.map((column) => (
                              <div key={column.heading}>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-warm-500">
                                  {column.heading}
                                </p>
                                <div className="mt-3 flex flex-col gap-3">
                                  {column.links.map((link) => (
                                    <Link
                                      key={link.label}
                                      href={link.href}
                                      onClick={onClose}
                                      className="flex items-center gap-2 text-sm text-warm-600 hover:text-gold-600"
                                    >
                                      {link.icon && <Diamond size={16} strokeWidth={1} className="shrink-0 text-warm-400" />}
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 px-6 py-4">
              {MOBILE_UTILITY_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="py-2 text-sm text-warm-600 hover:text-gold-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-warm-200 px-6 py-6">
              <Link href="/account" onClick={onClose} className="flex items-center gap-2 text-sm text-ink">
                <UserRound size={16} /> My Account
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-sm text-ink">
                <LogIn size={16} /> Login
              </Link>
              <Link href="/signup" className="flex items-center gap-2 text-sm text-ink">
                <UserPlus size={16} /> Register
              </Link>
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-sm text-warm-600">
                <Phone size={16} /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sm text-warm-600">
                <Mail size={16} /> {SITE.email}
              </a>
              <div className="flex gap-4 pt-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wide text-warm-500 hover:text-gold-600"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
