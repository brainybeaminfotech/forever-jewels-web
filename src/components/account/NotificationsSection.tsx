"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { Switch } from "@/components/ui";
import type { NotificationPrefs } from "@/types";

interface NotificationsSectionProps {
  prefs: NotificationPrefs;
  onChange: (prefs: NotificationPrefs) => void;
}

interface Row<K extends string> {
  key: K;
  label: string;
  description: string;
}

const EMAIL_ROWS: Row<keyof NotificationPrefs["email"]>[] = [
  { key: "orderUpdates", label: "Order Updates", description: "Shipping confirmations and delivery updates" },
  { key: "promotions", label: "Promotions & Offers", description: "Sales, exclusive offers, and member perks" },
  { key: "priceDrop", label: "Price Drop Alerts", description: "When a wishlist item goes on sale" },
  { key: "backInStock", label: "Back in Stock", description: "When a saved item is restocked" },
  { key: "newsletter", label: "Newsletter", description: "Style edits and new collection previews" },
];

export function NotificationsSection({ prefs, onChange }: NotificationsSectionProps) {
  const [savedFlash, setSavedFlash] = useState(false);

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  function updateEmail(key: string, value: boolean) {
    onChange({ ...prefs, email: { ...prefs.email, [key]: value } });
    flashSaved();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Notification Preferences</h2>
          <p className="mt-1 text-sm text-warm-600">Choose how Forever Jewels keeps you in the loop.</p>
        </div>
        <AnimatePresence>
          {savedFlash && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs text-gold-700"
            >
              <Check size={13} /> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="border border-warm-200 bg-white p-6 lg:max-w-2xl">
        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
          <Mail size={17} className="text-gold-600" /> Email Notifications
        </h3>
        <div className="mt-4 flex flex-col divide-y divide-warm-100">
          {EMAIL_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm text-ink">{row.label}</p>
                <p className="mt-0.5 text-xs text-warm-500">{row.description}</p>
              </div>
              <Switch checked={prefs.email[row.key] ?? false} onChange={(value) => updateEmail(row.key, value)} label={row.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
