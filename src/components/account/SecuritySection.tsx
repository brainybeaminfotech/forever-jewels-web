"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button, Input } from "@/components/ui";

export function SecuritySection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success">("idle");

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordStatus("loading");
    const form = event.currentTarget;
    setTimeout(() => {
      setPasswordStatus("success");
      form.reset();
      setTimeout(() => setPasswordStatus("idle"), 2500);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl text-ink">Account Security</h2>
        <p className="mt-1 text-sm text-warm-600">Keep your account protected.</p>
      </div>

      <div className="border border-warm-200 bg-white p-6 lg:max-w-md">
        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
          <KeyRound size={17} className="text-gold-600" /> Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="mt-5 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Current Password</span>
            <div className="relative">
              <Input type={showCurrent ? "text" : "password"} required minLength={6} className="pr-8" autoComplete="current-password" />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-0 -translate-y-1/2 text-warm-400 hover:text-ink"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">New Password</span>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} required minLength={6} className="pr-8" autoComplete="new-password" />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-0 -translate-y-1/2 text-warm-400 hover:text-ink"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Confirm New Password</span>
            <Input type={showNew ? "text" : "password"} required minLength={6} autoComplete="new-password" />
          </label>
          <Button type="submit" variant="primary" size="md" disabled={passwordStatus === "loading"}>
            {passwordStatus === "loading" ? "Updating…" : "Update Password"}
          </Button>
          {passwordStatus === "success" && <p className="text-sm text-gold-700">Your password has been updated.</p>}
        </form>
      </div>
    </div>
  );
}
