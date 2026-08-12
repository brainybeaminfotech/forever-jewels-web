export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: HeroCta;
  ctaSecondary: HeroCta;
  /** Which side of the frame the copy should sit on, to clear the image's subject. Defaults to "center". */
  align?: "left" | "right" | "center";
}
