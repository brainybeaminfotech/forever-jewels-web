import { Breadcrumb } from "@/components/ui";
import { STONE_META, getRelatedStones } from "@/lib/stones";
import { StoneGallery } from "./StoneGallery";
import { StoneBuyBox } from "./StoneBuyBox";
import { StoneAccordions } from "./StoneAccordions";
import { RelatedStones } from "./RelatedStones";
import type { StoneListItem } from "@/types";

interface StoneDetailClientProps {
  stone: StoneListItem;
}

export function StoneDetailClient({ stone }: StoneDetailClientProps) {
  const meta = STONE_META[stone.category];
  const basePath = stone.category === "diamond" ? "/diamonds" : "/gemstone";
  const headline = stone.category === "gemstone" ? `${stone.caratWeight}ct ${stone.gemstoneType} ${stone.shape}` : `${stone.caratWeight}ct ${stone.shape} Diamond`;
  const related = getRelatedStones(stone);

  return (
    <div className="mx-auto max-w-360 px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pt-52">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: meta.label, href: basePath }, { label: headline }]} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <StoneGallery stone={stone} />
        <StoneBuyBox stone={stone} />
      </div>

      <StoneAccordions stone={stone} />
      <RelatedStones title="You May Also Like" stones={related} />
    </div>
  );
}
