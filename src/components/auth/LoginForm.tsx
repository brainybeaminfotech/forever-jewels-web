"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { FadeIn } from "@/components/animations";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 900);
  }

  return (
    <FadeIn direction="up">
      <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600">Welcome Back</span>
      <h1 className="mt-3 text-balance font-display text-3xl text-ink sm:text-4xl">Sign In to Your Account</h1>
      <p className="mt-3 text-sm leading-relaxed text-warm-600">
        Access your wishlist, order history, and personalised recommendations.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
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
              autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-warm-600">
            <input type="checkbox" name="remember" className="h-4 w-4 border border-warm-300 accent-gold-500" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-warm-600 hover:text-gold-600">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={status === "loading"}>
          {status === "loading" ? "Signing In…" : "Sign In"}
        </Button>

        {status === "success" && (
          <p className="text-center text-sm text-gold-700">Welcome back — you&apos;re signed in.</p>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-warm-600">
        New to Forever Jewels?{" "}
        <Link href="/signup" className="font-medium text-ink hover:text-gold-600">
          Create an account
        </Link>
      </p>
    </FadeIn>
  );
}
