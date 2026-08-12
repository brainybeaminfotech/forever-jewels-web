"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { FadeIn } from "@/components/animations";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 900);
  }

  return (
    <FadeIn direction="up">
      <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600">Join Forever Jewels</span>
      <h1 className="mt-3 text-balance font-display text-3xl text-ink sm:text-4xl">Create Your Account</h1>
      <p className="mt-3 text-sm leading-relaxed text-warm-600">
        Save favourites, track orders, and get early access to new collections.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-600">Full Name</span>
          <Input type="text" name="name" required placeholder="Jane Doe" autoComplete="name" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-600">Email Address</span>
          <Input type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-600">Password</span>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-8"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-warm-400 hover:text-ink"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-600">Confirm Password</span>
          <Input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            minLength={6}
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {mismatch && <span className="text-xs text-red-600">Passwords do not match.</span>}
        </label>

        <label className="flex items-start gap-2.5 text-sm text-warm-600">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 border border-warm-300 accent-gold-500"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-ink hover:text-gold-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ink hover:text-gold-600">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={status === "loading"}>
          {status === "loading" ? "Creating Account…" : "Create Account"}
        </Button>

        {status === "success" && (
          <p className="text-center text-sm text-gold-700">Account created — welcome to Forever Jewels.</p>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-warm-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink hover:text-gold-600">
          Sign in
        </Link>
      </p>
    </FadeIn>
  );
}
