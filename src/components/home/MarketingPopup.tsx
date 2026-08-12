"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { Button, Input } from "@/components/ui";

const STORAGE_KEY = "fj_welcome_offer_dismissed";
const SHOW_DELAY_MS = 5000;
const OFFER_CODE = "FOREVER10";

const SPARKLES = [
  { top: "12%", left: "9%", size: 5, delay: 0 },
  { top: "22%", left: "88%", size: 4, delay: 0.6 },
  { top: "78%", left: "14%", size: 4, delay: 1.2 },
  { top: "85%", left: "82%", size: 6, delay: 1.8 },
  { top: "48%", left: "5%", size: 3, delay: 2.4 },
];

function Sparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-gold-300"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function CornerMarks() {
  const base = "absolute h-5 w-5 border-gold-400/60";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l border-t`} />
      <span className={`${base} right-3 top-3 border-r border-t`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
    </>
  );
}

function Flourish() {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 text-gold-500/70">
      <span className="h-px w-10 bg-gold-500/40" />
      <span className="h-2 w-2 rotate-45 border border-gold-400" />
      <span className="h-px w-10 bg-gold-500/40" />
    </div>
  );
}

export function MarketingPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const dismiss = useCallback(() => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, dismiss]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFER_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketing-popup-title"
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) dismiss();
          }}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, default: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            className="relative w-full max-w-md overflow-hidden bg-navy text-center text-white shadow-luxury lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl"
          >
            <Sparkles />
            <span className="pointer-events-none absolute inset-2.5 border border-white/10" />
            <CornerMarks />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 text-white/60 transition-colors duration-300 hover:text-gold-300"
            >
              <X size={18} />
            </button>

            <div className="relative px-8 py-12 sm:px-12 sm:py-14 xl:px-16 xl:py-16">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto max-w-xs xl:max-w-sm"
                >
                  <Flourish />
                  <h2 className="font-display text-2xl text-white sm:text-3xl xl:text-4xl">
                    Your Gift Is Ready
                  </h2>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-white/60 xl:text-base">
                    Use this code at checkout for 10% off your first order.
                  </p>

                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy discount code"
                    className="group mx-auto mt-7 flex items-center gap-3 border border-dashed border-gold-400/60 px-6 py-3 transition-colors duration-300 hover:border-gold-400"
                  >
                    <span className="font-display text-lg tracking-[0.35em] text-gold-300">
                      {OFFER_CODE}
                    </span>
                    {copied ? (
                      <Check size={16} className="text-gold-300" />
                    ) : (
                      <Copy size={16} className="text-white/50 group-hover:text-gold-300" />
                    )}
                  </button>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
                    {copied ? "Copied to clipboard" : "Tap to copy"}
                  </p>
                </motion.div>
              ) : (
                <div className="xl:grid xl:grid-cols-[auto_1fr] xl:items-center xl:gap-10 2xl:gap-14">
                  <div className="xl:border-r xl:border-white/10 xl:pr-10 2xl:pr-14">
                    <Flourish />
                    <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-400">
                      A Gift, For You
                    </span>

                    <div className="mt-4 flex items-baseline justify-center gap-1 text-gold-300">
                      <span className="font-display text-7xl leading-none sm:text-8xl 2xl:text-9xl">
                        10
                      </span>
                      <span className="font-display text-3xl sm:text-4xl 2xl:text-5xl">%</span>
                    </div>
                  </div>

                  <div className="mt-8 xl:mt-0 xl:text-left">
                    <p
                      id="marketing-popup-title"
                      className="font-display text-xl text-white sm:text-2xl 2xl:text-3xl"
                    >
                      Off Your First Order
                    </p>
                    <p className="mx-auto mt-4 max-w-xs text-sm text-white/60 xl:mx-0 xl:max-w-sm xl:text-base">
                      Join our circle for early access to new arrivals, private sales, and bespoke
                      offers from Forever Jewels.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="mx-auto mt-8 flex max-w-xs flex-col gap-4 xl:mx-0 xl:max-w-md xl:flex-row xl:items-center xl:gap-3"
                    >
                      <Input
                        variant="light"
                        type="email"
                        required
                        placeholder="Your email address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-label="Email address"
                        className="min-w-0 text-center xl:flex-1 xl:text-left"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="md"
                        fullWidth
                        className="xl:w-auto xl:shrink-0 xl:px-6 2xl:px-8"
                      >
                        Reveal My Code
                      </Button>
                    </form>

                    <p className="mx-auto mt-4 max-w-xs text-[11px] text-white/35 xl:mx-0 xl:max-w-md">
                      By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                    </p>

                    <button
                      type="button"
                      onClick={dismiss}
                      className="mt-5 text-xs text-white/45 underline underline-offset-4 transition-colors duration-300 hover:text-white"
                    >
                      No thanks, I&apos;ll pay full price
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
