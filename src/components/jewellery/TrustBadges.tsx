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
    <div className="grid grid-cols-2 gap-6 border-t border-warm-200 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {TRUST_POINTS.map(({ label, icon: Icon }) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center">
          <Icon size={22} className="text-gold-600" strokeWidth={1.5} />
          <p className="text-xs text-warm-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
