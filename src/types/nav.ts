export type NavLinkIcon = "diamond-earth" | "diamond-lab" | "setting";

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  icon?: NavLinkIcon;
  /** Finer-grained sub-links shown in a flyout when this link is hovered/focused (desktop) or as a nested accordion level (mobile). */
  children?: NavChild[];
}

export type DiamondShape =
  | "round"
  | "princess"
  | "cushion"
  | "emerald"
  | "oval"
  | "radiant"
  | "asscher"
  | "marquise"
  | "heart"
  | "pear";

export interface NavShapeLink {
  label: string;
  href: string;
  shape: DiamondShape;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavChild[];
}

export interface MegaMenuPromo {
  image: string;
  alt: string;
  href?: string;
}

export interface MegaMenu {
  shapesHeading?: string;
  shapes?: NavShapeLink[];
  columns: MegaMenuColumn[];
  promo?: MegaMenuPromo;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  megaMenu?: MegaMenu;
}
