import { cn } from "@/lib/utils";

interface StoneShapeIconProps {
  shape: string;
  className?: string;
}

const COMMON = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinejoin: "round" as const };

const PATHS: Record<string, React.ReactNode> = {
  round: <circle cx="12" cy="12" r="9" {...COMMON} />,
  oval: <ellipse cx="12" cy="12" rx="7" ry="9.5" {...COMMON} />,
  pear: <path d="M12 2.5c3.6 3.4 6.5 7.6 6.5 11.3a6.5 6.5 0 1 1-13 0c0-3.7 2.9-7.9 6.5-11.3Z" {...COMMON} />,
  heart: (
    <path
      d="M12 20.5S3 14.8 3 8.9A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 9 2.9c0 5.9-9 11.6-9 11.6Z"
      {...COMMON}
    />
  ),
  marquise: <ellipse cx="12" cy="12" rx="5" ry="10" {...COMMON} />,
  emerald: <path d="M8 3h8l4 4v10l-4 4H8l-4-4V7Z" {...COMMON} />,
  princess: <rect x="3.5" y="3.5" width="17" height="17" {...COMMON} />,
  radiant: <path d="M6 3h12l3 3v12l-3 3H6l-3-3V6Z" {...COMMON} />,
  cushion: <rect x="3.5" y="3.5" width="17" height="17" rx="6" {...COMMON} />,
  asscher: <path d="M7 3h10l4 4v10l-4 4H7l-4-4V7Z" {...COMMON} />,
  cabochon: <path d="M3 13a9 9 0 0 1 18 0v.5A5.5 5.5 0 0 1 15.5 19h-7A5.5 5.5 0 0 1 3 13.5Z" {...COMMON} />,
  button: <ellipse cx="12" cy="12" rx="8.5" ry="7.5" {...COMMON} />,
  drop: <path d="M12 3c3 4.5 6 8.7 6 12a6 6 0 1 1-12 0c0-3.3 3-7.5 6-12Z" {...COMMON} />,
  baroque: <path d="M6 8c1-3 4-5 7-4 3.5 1.2 5 4 4 7-.8 2.5-3 3-2 6 .7 2.3-1.3 4-3.5 3.3-3-1-6-1.6-7-5C3.6 12.7 5 10.5 6 8Z" {...COMMON} />,
  trillion: <path d="M12 3.5 21 18H3Z" {...COMMON} />,
};

const FALLBACK = <ellipse cx="12" cy="12" rx="8" ry="9" {...COMMON} />;

export function StoneShapeIcon({ shape, className }: StoneShapeIconProps) {
  const node = PATHS[shape.toLowerCase()] ?? FALLBACK;
  return (
    <svg viewBox="0 0 24 24" className={cn("h-full w-full", className)} aria-hidden="true">
      {node}
    </svg>
  );
}
