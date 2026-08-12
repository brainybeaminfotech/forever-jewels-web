import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide" | "full";
  as?: ElementType;
}

const sizes = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

export function Container({ children, className, size = "default", as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", sizes[size], className)}>{children}</Tag>;
}
