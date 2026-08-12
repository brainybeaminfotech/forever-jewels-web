import { cn } from "@/lib/utils";

export type SocialName = "Instagram" | "Facebook" | "Pinterest" | "YouTube" | "X" | "LinkedIn";

interface SocialIconProps {
  name: SocialName;
  size?: number;
  className?: string;
}

/**
 * Minimal hand-drawn brand glyphs — lucide-react intentionally ships no
 * brand/logo icons, so these small stand-ins keep the footer dependency-free.
 */
const paths: Record<SocialName, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.3.2-.5.5-.5Z" />
  ),
  Pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 18c1-3 1.5-5.2 2-7.4.4-1.6 2.8-1.7 3.4-.2.4 1-.1 2.4-.7 3.6-.6 1.3.4 2.5 1.7 2.2 1.8-.4 3-2.6 3-4.7 0-2.7-2.3-4.9-5.4-4.9-3.5 0-5.9 2.5-5.9 5.4 0 1.1.4 2 1 2.7" />
    </>
  ),
  YouTube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  X: <path d="M5 5l14 14M19 5 5 19" />,
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8 11v6M12 11v6M12 13.5c0-1.4 1-2.5 2.2-2.5S16.5 12 16.5 13.5V17" />
    </>
  ),
};

export function SocialIcon({ name, size = 15, className }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
