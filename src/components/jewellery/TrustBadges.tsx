import { BadgeCheck, ShieldCheck, Leaf, Ruler, ShieldQuestion, Truck } from "lucide-react";

const TRUST_POINTS = [
  { label: "Certified Diamonds", icon: BadgeCheck },
  { label: "Lifetime Warranty", icon: ShieldCheck },
  { label: "Conflict-Free Sourcing", icon: Leaf },
  { label: "Free Resizing", icon: Ruler },
  { label: "Price Match Guarantee", icon: ShieldQuestion },
  { label: "Free Shipping & Returns", icon: Truck },
];

export function TrustBadges() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-y-10 gap-x-6 border-t border-warm-200 py-14 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
      {TRUST_POINTS.map(({ label, icon: Icon }) => (
        <div key={label} className="flex flex-col items-center gap-3 text-center">
          <Icon size={26} className="text-gold-600" strokeWidth={1.25} />
          <p className="text-xs uppercase tracking-[0.1em] text-warm-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
