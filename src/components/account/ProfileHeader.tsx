"use client";

import { useState } from "react";
import { Check, Copy, Pencil } from "lucide-react";
import { Button } from "@/components/ui";
import type { CustomerProfile } from "@/types";
import { formatDate } from "@/utils/format";

interface ProfileHeaderProps {
  customer: CustomerProfile;
  onEditProfile: () => void;
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function ProfileHeader({ customer, onEditProfile }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(customer.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="relative overflow-hidden bg-navy shadow-luxury">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold-400/40 to-transparent" />

      <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-300 to-gold-600 font-display text-2xl text-navy ring-2 ring-gold-200/60 ring-offset-2 ring-offset-navy sm:h-24 sm:w-24 sm:text-3xl">
            {initials(customer.firstName, customer.lastName)}
          </span>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="font-display text-2xl text-white sm:text-3xl">
                {customer.firstName} {customer.lastName}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-white/60 sm:justify-start">
              <span>{customer.email}</span>
              <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
              <span>{customer.phone}</span>
              <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
              <span>Member since {formatDate(customer.memberSince)}</span>
            </div>

            <button
              type="button"
              onClick={copyId}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-gold-300 transition-colors hover:text-gold-200"
            >
              Customer ID: {customer.id}
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        <Button variant="outline-light" size="sm" icon={<Pencil size={14} />} onClick={onEditProfile} className="shrink-0">
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
