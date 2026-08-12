export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const HANDCRAFTED_STATS: StatItem[] = [
  { id: "stat-1", value: 18, suffix: "+", label: "Years of Craftsmanship" },
  { id: "stat-2", value: 24000, suffix: "+", label: "Diamonds Hand-Set" },
  { id: "stat-3", value: 99, suffix: "%", label: "Client Satisfaction" },
  { id: "stat-4", value: 12, suffix: "", label: "Master Jewelers On Staff" },
];
