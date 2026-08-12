"use client";

import { useState } from "react";
import Image from "next/image";

interface StoneMediaProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

const FALLBACK_SRC = "/diamond-animation.gif";

export function StoneMedia({ src, alt, sizes, priority, className }: StoneMediaProps) {
  const [errored, setErrored] = useState(false);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setErrored(false);
  }

  const showFallback = !src || errored;

  return (
    <Image
      src={showFallback ? FALLBACK_SRC : src!}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
