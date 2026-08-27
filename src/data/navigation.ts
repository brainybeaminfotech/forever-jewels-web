import type { NavItem } from "@/types";

export const MAIN_NAVIGATION: NavItem[] = [
  {
    label: "Diamonds",
    href: "/diamonds",
    megaMenu: {
      shapesHeading: "Shop By Shape",
      shapes: [
        { label: "Round", href: "/diamonds/round", shape: "round" },
        { label: "Radiant", href: "/diamonds/radiant", shape: "radiant" },
        { label: "Princess", href: "/diamonds/princess", shape: "princess" },
        { label: "Asscher", href: "/diamonds/asscher", shape: "asscher" },
        { label: "Cushion", href: "/diamonds/cushion", shape: "cushion" },
        { label: "Marquise", href: "/diamonds/marquise", shape: "marquise" },
        { label: "Emerald", href: "/diamonds/emerald", shape: "emerald" },
        { label: "Heart", href: "/diamonds/heart", shape: "heart" },
        { label: "Oval", href: "/diamonds/oval", shape: "oval" },
        { label: "Pear", href: "/diamonds/pear", shape: "pear" },
      ],
      columns: [
        {
          heading: "Learn About",
          links: [
            { label: "Diamond Shapes", href: "/education/diamond-shapes" },
            { label: "4C's Of A Diamond", href: "/education/4cs" },
          ],
        },
      ],
      promo: {
        image: "/images/handcrafted-primary.webp",
        alt: "Hand-selected loose diamonds",
        href: "/diamonds/loose",
      },
    },
  },
  {
    label: "Gemstone",
    href: "/gemstone",
    megaMenu: {
      columns: [
        {
          heading: "Shop By Gemstone",
          links: [
            { label: "Ruby", href: "/gemstone/ruby" },
            { label: "Sapphire", href: "/gemstone/sapphire" },
            { label: "Emerald", href: "/gemstone/emerald" },
            { label: "Pearl", href: "/gemstone/pearl" },
            { label: "Topaz", href: "/gemstone/topaz" },
            { label: "Amethyst", href: "/gemstone/amethyst" },
          ],
        },
        {
          heading: "Learn About",
          links: [
            { label: "Gemstone Guide", href: "/education/gemstone-guide" },
            { label: "Birthstones By Month", href: "/education/birthstones" },
          ],
        },
      ],
      promo: {
        image: "/images/cat-pendants.jpg",
        alt: "Coloured gemstone jewellery",
        href: "/gemstone",
      },
    },
  },
  {
    label: "Jewellery",
    href: "/jewellery",
    megaMenu: {
      columns: [
        {
          heading: "Shop By Category",
          links: [
            { label: "Rings", href: "/jewellery/rings" },
            { label: "Earrings", href: "/jewellery/earrings" },
            {
              label: "Necklaces",
              href: "/jewellery/necklaces",
              children: [
                { label: "Single Stone Necklace", href: "/jewellery/necklaces?style=single-stone" },
                { label: "Bezel Chains", href: "/jewellery/necklaces?style=bezel-chains" },
                { label: "Diamond Beads", href: "/jewellery/necklaces?style=diamond-beads" },
                { label: "Floating Diamond Chains", href: "/jewellery/necklaces?style=floating-diamond-chains" },
              ],
            },
            { label: "Bracelets", href: "/jewellery/bracelets" },
            { label: "Pendants", href: "/jewellery/pendants" },
          ],
        },
        {
          heading: "Learn About",
          links: [
            { label: "Jewellery Care Guide", href: "/education/jewellery-care" },
            { label: "Metal Guide", href: "/education/metal-guide" },
          ],
        },
      ],
      promo: {
        image: "/images/cat-bracelets.jpg",
        alt: "Bracelet close-up",
        href: "/jewellery",
      },
    },
  },
  { label: "Education", href: "/education" },
  { label: "Ring Configurator", href: "/ring-configurator" },
];

export const MOBILE_UTILITY_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Book An Appointment", href: "/book-appointment" },
];
