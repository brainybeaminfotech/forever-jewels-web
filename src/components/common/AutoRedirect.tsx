"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRedirectProps {
  to: string;
  delay: number;
}

export function AutoRedirect({ to, delay }: AutoRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push(to), delay);
    return () => clearTimeout(timer);
  }, [to, delay, router]);

  return null;
}
