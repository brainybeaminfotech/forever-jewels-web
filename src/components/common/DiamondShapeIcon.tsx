import type { DiamondShape } from "@/types";

interface DiamondShapeIconProps {
  shape: DiamondShape;
  size?: number;
  className?: string;
}

const PATHS: Record<DiamondShape, React.ReactNode> = {
  round: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5M6 6l3.2 3.2M18 6l-3.2 3.2M6 18l3.2-3.2M18 18l-3.2-3.2" />
    </>
  ),
  princess: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 4l8 8M20 4l-8 8M4 20l8-8M20 20l-8-8" />
    </>
  ),
  cushion: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="6" />
      <rect x="8" y="8" width="8" height="8" rx="2.5" />
      <path d="M6.5 6.5l3 3M17.5 6.5l-3 3M6.5 17.5l3-3M17.5 17.5l-3-3" />
    </>
  ),
  emerald: (
    <>
      <path d="M8 4h8l4 4v8l-4 4H8l-4-4V8z" />
      <path d="M8 4l1.8 4M16 4l-1.8 4M8 20l1.8-4M16 20l-1.8-4M4 8l4 1.8M20 8l-4 1.8M4 16l4-1.8M20 16l-4-1.8" />
    </>
  ),
  oval: (
    <>
      <ellipse cx="12" cy="12" rx="6.5" ry="9" />
      <path d="M12 3v18M8 5.5l1.4 3.2M16 5.5l-1.4 3.2M8 18.5l1.4-3.2M16 18.5l-1.4-3.2" />
    </>
  ),
  radiant: (
    <>
      <path d="M7 4h10l3 3v10l-3 3H7l-3-3V7z" />
      <path d="M7 4l2 3M17 4l-2 3M7 20l2-3M17 20l-2-3M4 7l3 2M20 7l-3 2M4 17l3-2M20 17l-3-2" />
    </>
  ),
  asscher: (
    <>
      <path d="M8 4h8l4 4v8l-4 4H8l-4-4V8z" />
      <rect x="8.5" y="8.5" width="7" height="7" />
      <path d="M8 4l1.8 4M16 4l-1.8 4M8 20l1.8-4M16 20l-1.8-4M4 8l4 1.8M20 8l-4 1.8M4 16l4-1.8M20 16l-4-1.8" />
    </>
  ),
  marquise: (
    <>
      <path d="M12 3c3.5 3 6 6.5 6 9s-2.5 6-6 9c-3.5-3-6-6.5-6-9s2.5-6 6-9z" />
      <path d="M12 3v18M7.5 9l2 1.5M16.5 9l-2 1.5M7.5 15l2-1.5M16.5 15l-2-1.5" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20S4 14 4 8.8C4 6.1 6 4 8.5 4c1.6 0 2.9.8 3.5 2 .6-1.2 1.9-2 3.5-2C18 4 20 6.1 20 8.8 20 14 12 20 12 20z" />
      <path d="M8.5 4l3.5 6 3.5-6M4.6 9.5h6.9M12.5 9.5h6.9" />
    </>
  ),
  pear: (
    <>
      <path d="M12 3c3.2 2.2 6 5.3 6 9.2 0 4.3-2.9 7.8-6 8.8-3.1-1-6-4.5-6-8.8C6 8.3 8.8 5.2 12 3z" />
      <path d="M12 3v18M8.2 9l1.9 1.6M15.8 9l-1.9 1.6" />
    </>
  ),
};

export function DiamondShapeIcon({ shape, size = 24, className }: DiamondShapeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[shape]}
    </svg>
  );
}
