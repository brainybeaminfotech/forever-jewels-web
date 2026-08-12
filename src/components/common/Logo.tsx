"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  theme?: "dark" | "light";
}

export function Logo({ className, imgClassName, theme = "dark" }: LogoProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link href="/" onClick={handleClick} className={cn("inline-flex items-center", className)} aria-label={SITE.name}>
      <Image
        src={SITE.logo}
        alt={SITE.name}
        width={SITE.logoWidth}
        height={SITE.logoHeight}
        priority
        className={cn(
          "h-9 w-auto transition-[filter] duration-500 sm:h-10",
          theme === "light" && "brightness-0 invert",
          imgClassName
        )}
      />
    </Link>
  );
}
