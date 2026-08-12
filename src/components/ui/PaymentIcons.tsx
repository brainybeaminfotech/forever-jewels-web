import { cn } from "@/lib/utils";

interface PaymentIconProps {
  className?: string;
}

export function VisaIcon({ className }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 48 32" role="img" aria-label="Visa" className={cn("h-6 w-auto", className)}>
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="13"
        fill="#ffffff"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardIcon({ className }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 48 32" role="img" aria-label="Mastercard" className={cn("h-6 w-auto", className)}>
      <rect width="48" height="32" rx="4" fill="#ffffff" />
      <circle cx="20" cy="16" r="9" fill="#EB001B" />
      <circle cx="28" cy="16" r="9" fill="#F79E1B" />
      <path d="M24 9.3a9 9 0 0 1 0 13.4 9 9 0 0 1 0-13.4Z" fill="#FF5F00" />
    </svg>
  );
}

export function AmexIcon({ className }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 48 32" role="img" aria-label="American Express" className={cn("h-6 w-auto", className)}>
      <rect width="48" height="32" rx="4" fill="#2E77BC" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

export function PaypalIcon({ className }: PaymentIconProps) {
  return (
    <svg viewBox="0 0 48 32" role="img" aria-label="PayPal" className={cn("h-6 w-auto", className)}>
      <rect width="48" height="32" rx="4" fill="#ffffff" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="12"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}
