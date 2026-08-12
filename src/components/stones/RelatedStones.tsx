import { StoneCard } from "./StoneCard";
import type { StoneListItem } from "@/types";

interface RelatedStonesProps {
  title: string;
  stones: StoneListItem[];
}

export function RelatedStones({ title, stones }: RelatedStonesProps) {
  if (stones.length === 0) return null;

  return (
    <div className="border-t border-warm-200 py-14">
      <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">{title}</h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-4">
        {stones.map((stone) => (
          <StoneCard key={stone.id} stone={stone} />
        ))}
      </div>
    </div>
  );
}
