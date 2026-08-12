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
          heading: "Create Your Own Ring",
          links: [
            { label: "Start With An Earth-Mined Diamond", href: "/diamonds/natural", icon: "diamond-earth" },
            { label: "Start With A Lab-Grown Diamond", href: "/diamonds/lab-grown", icon: "diamond-lab" },
            { label: "Start With A Setting", href: "/design-your-own", icon: "setting" },
          ],
        },
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
          heading: "Shop By Jewellery",
          links: [
            { label: "Gemstone Rings", href: "/gemstone/rings" },
            { label: "Gemstone Earrings", href: "/gemstone/earrings" },
            { label: "Gemstone Necklaces", href: "/gemstone/necklaces" },
            { label: "Gemstone Bracelets", href: "/gemstone/bracelets" },
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
            { label: "Necklaces", href: "/jewellery/necklaces" },
            { label: "Bracelets", href: "/jewellery/bracelets" },
            { label: "Pendants", href: "/jewellery/pendants" },
          ],
        },
        {
          heading: "Shop By Occasion",
          links: [
            { label: "Everyday", href: "/jewellery/everyday" },
            { label: "Gifting", href: "/jewellery/gifting" },
            { label: "Bridal", href: "/jewellery/bridal" },
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
  { label: "Create Your Own", href: "/design-your-own" },
];

export const MOBILE_UTILITY_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Book An Appointment", href: "/book-appointment" },
];
