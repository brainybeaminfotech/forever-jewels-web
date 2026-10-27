import type { ContentSection } from "@/types";
import { SITE } from "@/constants/site";

export type EducationCategorySlug = "diamonds" | "gemstones" | "jewellery" | "buying" | "services";

export interface EducationCategory {
  slug: EducationCategorySlug;
  label: string;
  description: string;
}

export interface EducationArticle {
  slug: string;
  title: string;
  category: EducationCategorySlug;
  /** Hero image path (from `public/`) plus its alt text. */
  image: string;
  imageAlt: string;
  /** One-line summary used on the hub cards and as the page meta description. */
  excerpt: string;
  readMinutes: number;
  /** Optional hero/lead-in paragraph shown under the page title. */
  intro: string;
  sections: ContentSection[];
}

export const EDUCATION_CATEGORIES: EducationCategory[] = [
  {
    slug: "diamonds",
    label: "Diamond Education",
    description: "How diamonds are graded, cut, and priced — and what actually changes how a stone looks.",
  },
  {
    slug: "gemstones",
    label: "Gemstone Education",
    description: "Colour, hardness, treatment, and which stones survive daily wear.",
  },
  {
    slug: "jewellery",
    label: "Jewellery & Metals",
    description: "Golds, platinum, sizing, and keeping a piece looking the way it did on day one.",
  },
  {
    slug: "buying",
    label: "Buying Guides",
    description: "Practical guidance for choosing a ring, a budget, and a stone you will still like in ten years.",
  },
  {
    slug: "services",
    label: "Our Services",
    description: "The guarantees behind every piece — warranty, sourcing, resizing, shipping, and price matching.",
  },
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  /* ---------------------------------------------------------------- */
  /* Diamonds                                                          */
  /* ---------------------------------------------------------------- */
  {
    slug: "4cs",
    title: "The 4Cs of a Diamond",
    category: "diamonds",
    image: "/images/handcrafted-primary.png",
    imageAlt: "A loose round brilliant diamond held in tweezers under a jeweler's loupe",
    excerpt: "Cut, colour, clarity, and carat — what each one means, and which of them your eye actually notices.",
    readMinutes: 7,
    intro:
      "Every diamond is graded on four characteristics. They are not equally important, and spending evenly across all four is the most common way to overpay for a stone that looks ordinary.",
    sections: [
      {
        id: "cut",
        title: "Cut — the one that matters most",
        body: [
          "Cut describes how well a diamond's facets have been proportioned and finished, not its shape. It is the only C determined entirely by human skill, and it is the one that decides whether a stone looks alive or flat.",
          "A poorly cut stone leaks light through the bottom instead of returning it to your eye. Two diamonds of identical carat, colour, and clarity can look completely different because of it. If you have to compromise somewhere, do not compromise here.",
        ],
        bullets: [
          "Excellent / Ideal — maximum brilliance; worth the premium",
          "Very Good — visually close to Excellent for noticeably less",
          "Good and below — visible loss of light return, especially in larger stones",
        ],
      },
      {
        id: "colour",
        title: "Colour — how little you can get away with",
        body: [
          "Colour grades run from D (completely colourless) to Z (noticeably tinted). The scale measures the absence of yellow, and the differences between neighbouring grades are extremely subtle face-up.",
          "Most people cannot tell D from G without a side-by-side comparison against a white background. Because the setting influences perception, the metal you choose should decide how far down the scale you can go.",
        ],
        bullets: [
          "White gold or platinum — D to G keeps the stone reading icy",
          "Yellow or rose gold — H to J looks colourless in context and costs far less",
          "Fancy colours are graded on a separate scale, where saturation adds value rather than subtracting it",
        ],
      },
      {
        id: "clarity",
        title: "Clarity — aim for eye-clean, not flawless",
        body: [
          "Clarity grades the internal inclusions and surface blemishes formed as the crystal grew. Grading is done under 10× magnification, which is not how anyone will look at your ring.",
          "The useful target is 'eye-clean': no inclusions visible to the naked eye at normal viewing distance. That is usually VS2 or SI1, well below the flawless grades that carry the largest premiums.",
        ],
        bullets: [
          "FL / IF — flawless under magnification; a rarity premium, not a visual one",
          "VVS1–VS2 — eye-clean in essentially all cases",
          "SI1–SI2 — often eye-clean, but must be checked stone by stone",
          "I1 and below — inclusions typically visible without magnification",
        ],
      },
      {
        id: "carat",
        title: "Carat — weight, not size",
        body: [
          "A carat is 0.2 grams. It measures weight rather than the dimensions you actually see, so a deep-cut stone can weigh more while looking smaller from above than a well-proportioned one.",
          "Prices jump at the round numbers because demand does. A 0.90ct stone is materially cheaper than a 1.00ct of the same quality, and the diameter difference is roughly a third of a millimetre.",
        ],
      },
      {
        id: "priorities",
        title: "How to spend the budget",
        body: [
          "If you want one rule: buy the best cut you can, drop colour and clarity to the point where the stone is still eye-clean and looks white in its setting, and take the carat weight that is left over.",
          `Every ${SITE.name} stone lists its full grading report, and our advisors will tell you plainly when a higher grade will not be visible on the finger.`,
        ],
      },
    ],
  },
  {
    slug: "diamond-shapes",
    title: "A Guide to Diamond Shapes",
    category: "diamonds",
    image: "/images/collection-1.png",
    imageAlt: "A selection of diamonds cut in different shapes",
    excerpt: "How the ten classic shapes differ in brilliance, apparent size, and how forgiving they are of inclusions.",
    readMinutes: 6,
    intro:
      "Shape is the first thing most people decide and the thing that changes a ring's character most. It also quietly affects price, how large the stone looks, and which clarity grade you can safely buy.",
    sections: [
      {
        id: "brilliant",
        title: "Brilliant cuts",
        body: [
          "Brilliant cuts use triangular and kite-shaped facets arranged to maximise sparkle. Their busy light return is very good at disguising small inclusions and faint body colour, so you can usually buy a grade or two lower.",
        ],
        bullets: [
          "Round — the most brilliant and the most expensive per carat, because more rough is lost in cutting",
          "Oval — brilliant fire with an elongating shape that looks larger than its weight suggests",
          "Pear — a teardrop that flatters the finger; check the point is protected by the setting",
          "Marquise — maximum apparent size for the weight; watch for a dark 'bow-tie' across the centre",
          "Cushion — softened corners and a warmer, chunkier fire than a round",
          "Heart and Radiant — brilliant faceting in a distinctive outline",
        ],
      },
      {
        id: "step",
        title: "Step cuts",
        body: [
          "Step cuts use long, parallel facets that produce broad flashes rather than fine sparkle — the 'hall of mirrors' effect. That openness is elegant, but it hides nothing.",
          "Buy step cuts a grade higher in both clarity and colour than you would a brilliant, because inclusions and tint are far easier to see through those open tables.",
        ],
        bullets: [
          "Emerald — rectangular with cropped corners; the most architectural of the shapes",
          "Asscher — a square emerald cut with a deeper, more geometric profile",
          "Baguette — usually a side stone rather than a centre",
        ],
      },
      {
        id: "size",
        title: "Which shapes look biggest",
        body: [
          "For a fixed carat weight, elongated shapes cover more finger. Marquise, oval, and pear present the largest face-up area; round and princess the smallest. If apparent size matters more than tradition, an oval is the efficient choice.",
        ],
      },
      {
        id: "ratio",
        title: "Length-to-width ratio",
        body: [
          "For any non-round shape, the ratio between length and width determines whether it reads as classic or dramatic. It is a matter of taste, but there are ranges most people find balanced.",
        ],
        bullets: [
          "Oval — 1.30 to 1.50",
          "Emerald — 1.30 to 1.50",
          "Pear — 1.45 to 1.75",
          "Marquise — 1.85 to 2.10",
          "Cushion and Princess — 1.00 to 1.10 for square, higher for elongated",
        ],
      },
    ],
  },
  {
    slug: "lab-grown-vs-natural",
    title: "Lab-Grown vs Natural Diamonds",
    category: "diamonds",
    image: "/images/collection-2.png",
    imageAlt: "Two visually identical diamonds side by side",
    excerpt: "Chemically identical, differently priced, and different in one way that matters — resale.",
    readMinutes: 5,
    intro:
      "A lab-grown diamond is a diamond. It is the same crystal, the same hardness, and the same optical behaviour. The differences are origin, price, and what happens to its value later.",
    sections: [
      {
        id: "same",
        title: "What is genuinely the same",
        body: [
          "Lab-grown stones are carbon crystallised in the same cubic structure as mined diamonds. They measure 10 on the Mohs scale, refract light identically, and are graded on the same 4Cs by the same laboratories.",
          "No jeweller can distinguish them by eye or with a loupe. Identification requires specialist equipment that reads growth patterns and trace elements.",
        ],
      },
      {
        id: "different",
        title: "What is different",
        body: [
          "Origin is the honest difference: one formed over geological time and was mined, the other was grown in weeks in a reactor. Both are real diamonds; only one is rare.",
          "Price follows that rarity. A lab-grown stone typically costs substantially less than a natural of the same specification, which buys you a larger or better-graded stone for the same money.",
        ],
      },
      {
        id: "resale",
        title: "The resale question",
        body: [
          "This is the part worth being clear-eyed about. Natural diamonds hold a secondary market; lab-grown resale values have fallen as production has scaled, and there is no reason to expect that to reverse.",
          "If you are buying jewellery to wear, that may not matter at all. If you are thinking of the purchase as a store of value, it matters a great deal.",
        ],
      },
      {
        id: "choosing",
        title: "Choosing between them",
        body: [
          "Choose lab-grown if you want maximum visible stone for the budget and resale is irrelevant to you. Choose natural if origin and rarity are part of what you are buying, or if the piece is intended to be passed on.",
          `We sell both, graded to the same standard, and every listing states clearly which it is.`,
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Gemstones                                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: "gemstone-guide",
    title: "The Gemstone Guide",
    category: "gemstones",
    image: "/images/collection-3.png",
    imageAlt: "Coloured gemstones arranged on a light surface",
    excerpt: "How coloured stones are judged, which are tough enough for daily wear, and what treatment disclosure means.",
    readMinutes: 6,
    intro:
      "Coloured stones are not graded on the diamond scale. Colour carries most of the value, and durability varies enormously — which makes 'will this survive being worn every day?' the first question, not the last.",
    sections: [
      {
        id: "colour",
        title: "Colour is the value",
        body: [
          "Gemstone colour is assessed on hue, tone, and saturation. Hue is the colour itself, tone is how light or dark it sits, and saturation is how vivid it is versus how grey or brown.",
          "The most valuable stones sit at medium tone with strong saturation — rich enough to read clearly, not so dark that the stone closes up in low light.",
        ],
      },
      {
        id: "hardness",
        title: "Hardness and daily wear",
        body: [
          "The Mohs scale runs 1 to 10 and measures scratch resistance. For a ring worn every day, aim for 8 or above; softer stones are better suited to earrings and pendants, which take far less impact.",
        ],
        bullets: [
          "Sapphire and ruby — 9; excellent for daily wear",
          "Spinel and topaz — 8; very durable",
          "Emerald — 7.5 to 8, but typically included, which makes it more fragile than the number suggests",
          "Tanzanite, opal, and pearl — soft or brittle; reserve for occasional wear",
        ],
      },
      {
        id: "treatment",
        title: "Treatments and disclosure",
        body: [
          "Most coloured stones on the market are treated to improve colour or clarity. Heat treatment in sapphire and ruby is stable, permanent, and entirely standard. Others — fracture filling, dyeing, irradiation — are less stable and materially affect value.",
          "The rule that matters is disclosure. Any treatment should be stated plainly before you buy, because it changes both the price and how the stone must be cared for.",
        ],
      },
      {
        id: "cut",
        title: "Cut and windowing",
        body: [
          "Coloured stones are cut to show colour rather than maximise sparkle, so proportions vary more than in diamonds. The flaw to look for is a 'window' — a pale, washed-out patch in the centre where light passes straight through instead of reflecting back.",
        ],
      },
    ],
  },
  {
    slug: "birthstones",
    title: "Birthstones by Month",
    category: "gemstones",
    image: "/images/collection-4.png",
    imageAlt: "An assortment of coloured birthstone gems",
    excerpt: "The traditional stone for each month, what it is, and whether it stands up to everyday wear.",
    readMinutes: 4,
    intro:
      "Birthstones are a modern tradition built on much older lists, standardised in the twentieth century. They make a considered gift — but durability varies sharply from month to month.",
    sections: [
      {
        id: "list",
        title: "The twelve months",
        body: ["Each entry notes the stone's Mohs hardness, so you can judge what setting suits it."],
        bullets: [
          "January — Garnet (7 to 7.5); deep red, hard enough for rings",
          "February — Amethyst (7); purple quartz, good all-round durability",
          "March — Aquamarine (7.5 to 8); pale blue beryl, very wearable",
          "April — Diamond (10); the hardest natural material",
          "May — Emerald (7.5 to 8); beautiful but included, treat with care",
          "June — Pearl (2.5) or Alexandrite (8.5); pearl is soft and needs protecting",
          "July — Ruby (9); the most durable coloured stone alongside sapphire",
          "August — Peridot (6.5 to 7); olive green, better in earrings than rings",
          "September — Sapphire (9); available in every colour, not only blue",
          "October — Opal (5.5 to 6.5) or Tourmaline (7 to 7.5); opal is fragile and water-sensitive",
          "November — Topaz or Citrine (7 to 8); warm golden tones",
          "December — Tanzanite (6 to 7), Zircon, or Turquoise; tanzanite is soft, so avoid daily-wear rings",
        ],
      },
      {
        id: "gifting",
        title: "Choosing a setting for the stone",
        body: [
          "Match the setting to the hardness. Anything below 7 belongs in a pendant or earrings, or in a bezel setting that shields the girdle from knocks if it must be a ring.",
          "For softer stones, a protective bezel and a lower profile will do more for longevity than any amount of care.",
        ],
      },
    ],
  },
  {
    slug: "pearl-guide",
    title: "Understanding Pearls",
    category: "gemstones",
    image: "/category/neckalce.webp",
    imageAlt: "A strand of pearls photographed against a soft background",
    excerpt: "Types, lustre, and why pearls need more care than any other gem you will own.",
    readMinutes: 4,
    intro:
      "Pearls are the only gems produced by a living animal, and the only ones that are organic rather than mineral. That makes them uniquely beautiful and uniquely vulnerable.",
    sections: [
      {
        id: "types",
        title: "The main types",
        body: ["Almost every pearl sold today is cultured — grown with human intervention rather than found by chance."],
        bullets: [
          "Akoya — classic round white pearls with sharp, mirror-like lustre",
          "Freshwater — the most affordable, in the widest range of shapes and pastel colours",
          "Tahitian — naturally dark, from grey through green to aubergine",
          "South Sea — the largest and rarest, in white and deep gold",
        ],
      },
      {
        id: "quality",
        title: "Judging quality",
        body: [
          "Lustre is the single most important factor — the sharpness of the reflection on the surface. A pearl with strong lustre looks lit from within; a dull one cannot be rescued by size or shape.",
        ],
        bullets: [
          "Lustre — sharp reflections rather than a chalky surface",
          "Surface — the fewer blemishes the better, though some are normal",
          "Shape — perfectly round is rarest, but baroque shapes have real character",
          "Nacre thickness — thin nacre wears through and dulls within years",
        ],
      },
      {
        id: "care",
        title: "Caring for pearls",
        body: [
          "Nacre is soft and dissolves in acid, which includes perfume, hairspray, and ordinary perspiration. The old rule holds: pearls go on last and come off first.",
          "Wipe them with a soft damp cloth after wearing, store them flat and away from other jewellery, and have strands restrung every couple of years if worn often.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Jewellery & metals                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "metal-guide",
    title: "The Metal Guide",
    category: "jewellery",
    image: "/images/handcrafted-secondary.webp",
    imageAlt: "Yellow, white, and rose gold bands resting together",
    excerpt: "Gold purity, the three gold colours, platinum versus white gold, and which suits your wear.",
    readMinutes: 5,
    intro:
      "The metal decides a piece's colour, weight, durability, and a surprising amount of its price. It also affects which diamond colour grade you can sensibly buy.",
    sections: [
      {
        id: "karat",
        title: "Gold purity",
        body: [
          "Pure gold is 24K and too soft for jewellery, so it is alloyed for strength. The karat number tells you how much gold is present out of 24 parts.",
        ],
        bullets: [
          "22K — 91.6% gold; rich colour, soft, best for pieces that are not knocked about",
          "18K — 75% gold; the standard for fine jewellery, balancing colour against durability",
          "14K — 58.5% gold; harder and more affordable, with a slightly paler tone",
        ],
      },
      {
        id: "colours",
        title: "Yellow, white, and rose",
        body: [
          "All three start as the same gold; the alloy decides the colour. Yellow uses silver and copper, rose uses more copper, and white uses palladium or nickel and is usually rhodium-plated for a brighter finish.",
          "That plating is worth understanding: rhodium wears with time and needs reapplying every few years to keep white gold looking crisp. It is inexpensive, and we do it as part of servicing.",
        ],
      },
      {
        id: "platinum",
        title: "Platinum",
        body: [
          "Platinum is naturally white, so it never needs plating, and it is denser — a platinum ring feels noticeably heavier than the same design in gold. It is also hypoallergenic, which matters if nickel is a problem for you.",
          "Rather than wearing away, platinum displaces as it is scratched, developing a soft patina that many people prefer. It can be polished back at any time.",
        ],
      },
      {
        id: "choosing",
        title: "Which to choose",
        body: [
          "For daily-wear engagement rings, platinum or 18K is the sensible range. Choose 14K if the piece will take hard knocks or the budget is tight; choose 22K only for pieces worn occasionally.",
          "Remember the interaction with stone colour: yellow and rose gold let you buy a warmer diamond grade without it reading as tinted.",
        ],
      },
    ],
  },
  {
    slug: "jewellery-care",
    title: "Caring for Fine Jewellery",
    category: "jewellery",
    image: "/category/bravelet.webp",
    imageAlt: "A diamond bracelet being cleaned with a soft cloth",
    excerpt: "How to clean, store, and service your pieces — and the everyday habits that cause the most damage.",
    readMinutes: 4,
    intro:
      "Most damage we repair is not dramatic. It is accumulated: a loosened prong nobody checked, a chain thinned by daily friction, a stone dulled by hand cream.",
    sections: [
      {
        id: "cleaning",
        title: "Cleaning at home",
        body: [
          "For diamonds and hard coloured stones, warm water with a drop of unscented washing-up liquid and a soft toothbrush is all that is needed. Brush behind the stone, where the film that dulls sparkle collects, then rinse and pat dry.",
          "Do not do this with pearls, opals, emeralds, or turquoise. Porous and treated stones should only be wiped with a soft damp cloth.",
        ],
      },
      {
        id: "avoid",
        title: "What to avoid",
        body: ["A few habits account for most of the wear we see:"],
        bullets: [
          "Wearing rings while cleaning — chlorine and bleach attack alloys and can weaken prongs permanently",
          "Sleeping in earrings and bracelets, which bends posts and stretches links",
          "Applying lotion or perfume with jewellery on",
          "Ultrasonic cleaners on treated, fractured, or organic stones",
          "Removing rings by pulling on the head rather than the band",
        ],
      },
      {
        id: "storage",
        title: "Storage",
        body: [
          "Diamonds scratch everything, including other diamonds. Store pieces separately in soft pouches or a lined box with dividers, rather than loose together in a dish.",
          "Chains should be laid flat or hung. Silver benefits from an airtight bag; pearls need the opposite, as they dry out if sealed away.",
        ],
      },
      {
        id: "servicing",
        title: "Professional servicing",
        body: [
          `Have anything worn daily checked once a year. We inspect prongs, tighten stones, refinish surfaces, and re-plate white gold at no charge for pieces bought from us — see our lifetime warranty.`,
        ],
      },
    ],
  },
  {
    slug: "ring-size",
    title: "Finding Your Ring Size",
    category: "jewellery",
    image: "/category/ring.webp",
    imageAlt: "A ring being measured on a jeweler's sizing mandrel",
    excerpt: "How to measure accurately at home, when to size up, and how to do it without ruining a surprise.",
    readMinutes: 4,
    intro:
      "Ring size is the detail most often got wrong, usually because it was measured at the wrong time of day or with the wrong method.",
    sections: [
      {
        id: "measuring",
        title: "Measuring at home",
        body: [
          "Wrap a strip of paper snugly around the base of the finger, mark where it overlaps, and measure the length in millimetres — that is your circumference. Compare it against a standard conversion chart.",
          "Measure the finger the ring will actually be worn on. Your dominant hand is usually slightly larger, and fingers are not symmetrical between hands.",
        ],
      },
      {
        id: "timing",
        title: "When to measure",
        body: [
          "Fingers change size through the day and with temperature. Measure in the late afternoon or evening at normal room temperature — never when cold, straight after exercise, or after a salty meal.",
          "Take the measurement two or three times on different days and use the largest reading.",
        ],
      },
      {
        id: "fit",
        title: "Getting the fit right",
        body: [
          "A correct ring slides on with mild resistance and needs a gentle tug over the knuckle. If it spins freely it is too big; if it leaves a deep mark it is too tight.",
          "Wide bands sit tighter than narrow ones, so go up a half size for anything above about 6mm. Very large stones can also need a slightly larger size to rotate correctly.",
        ],
      },
      {
        id: "surprise",
        title: "If it is a surprise",
        body: [
          "Borrow a ring they already wear on that finger and have it measured, or press it into soap to take an impression. Failing that, ask someone whose hands are a similar size to try on a sizer.",
          "If you have to guess, guess large — sizing down is a simpler and less visible alteration than sizing up. Our first resize is complimentary either way.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Buying guides                                                     */
  /* ---------------------------------------------------------------- */
  {
    slug: "engagement-ring-guide",
    title: "The Engagement Ring Guide",
    category: "buying",
    image: "/category/ring.webp",
    imageAlt: "A solitaire diamond engagement ring in yellow gold",
    excerpt: "Setting styles, budget, and the order to make decisions in so you do not end up compromising the wrong thing.",
    readMinutes: 7,
    intro:
      "There is a sensible order to these decisions. Getting it wrong — starting from a budget number, or from a stone before you know the setting — is what leads to rings people quietly stop wearing.",
    sections: [
      {
        id: "order",
        title: "Decide in this order",
        body: [
          "Style first, then shape, then the metal, then the stone specification, and only then the budget trade-offs. The first three are about taste and will not change; the last is where you flex.",
        ],
      },
      {
        id: "settings",
        title: "Setting styles",
        body: ["The setting does more to define the ring's character than the stone does."],
        bullets: [
          "Solitaire — a single stone; timeless and shows the diamond most honestly",
          "Halo — a ring of small stones around the centre, adding apparent size and sparkle",
          "Three-stone — a larger centre flanked by two; often read as past, present, and future",
          "Pavé — small stones set along the band for continuous light",
          "Bezel — a metal rim around the stone; the most protective and the best choice for active hands",
          "Vintage — milgrain, engraving, and filigree detail for a heirloom feel",
        ],
      },
      {
        id: "budget",
        title: "Budget, honestly",
        body: [
          "The 'three months' salary' rule was invented by an advertising agency in the twentieth century. It is not a tradition and it is not guidance. Spend what fits your circumstances.",
          "To make a fixed budget go furthest: prioritise cut, buy just below a round carat weight, choose an eye-clean rather than flawless clarity, and let the metal set the colour grade you need.",
        ],
      },
      {
        id: "lifestyle",
        title: "Match the ring to the life",
        body: [
          "Consider how the ring will be worn before choosing a profile. Hands-on work, sport, and gloves all argue for a lower setting and a protective bezel or halo rather than tall solitaire prongs.",
          "A ring that is too delicate for its owner's life gets taken off, and rings that get taken off get lost.",
        ],
      },
      {
        id: "certification",
        title: "Insist on certification",
        body: [
          "Any centre stone of significance should carry an independent grading report from a recognised laboratory. It is your only objective evidence of what you bought.",
          `Every certified stone we sell links to its report, and we will walk you through it before you commit.`,
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Services                                                          */
  /* ---------------------------------------------------------------- */
  {
    slug: "warranty",
    title: "Our Lifetime Warranty",
    category: "services",
    image: "/images/product-1.jpg",
    imageAlt: "A jeweler inspecting a ring's prongs at the bench",
    excerpt: "What the lifetime warranty covers, what it does not, and how to make a claim.",
    readMinutes: 3,
    intro:
      "Every piece we make carries a lifetime warranty against manufacturing defects, together with the routine servicing that keeps it wearable.",
    sections: [
      {
        id: "covered",
        title: "What is covered",
        body: ["For as long as you own the piece, at no charge:"],
        bullets: [
          "Manufacturing defects in the setting, mount, or clasp",
          "Loose stones re-tightened and prongs re-tipped",
          "Professional cleaning and polishing",
          "Rhodium re-plating on white gold",
          "One standard resizing",
        ],
      },
      {
        id: "not-covered",
        title: "What is not covered",
        body: [
          "The warranty covers our workmanship, not accidents or ordinary life. Loss, theft, and accidental damage should be handled by a jewellery insurance policy, which we can help you arrange.",
        ],
        bullets: [
          "Normal wear — thinning bands, surface scratches, gradual patina",
          "Accidental damage, loss, or theft",
          "Damage from work carried out by another jeweller",
          "Stones chipped or lost through impact",
        ],
      },
      {
        id: "important",
        title: "One important condition",
        body: [
          "Having a piece worked on by another jeweller voids the warranty. That is not commercial protectiveness — we cannot stand behind a setting we did not touch. Bring it to us first, even if only for an opinion.",
        ],
      },
      {
        id: "claim",
        title: "Making a claim",
        body: [
          `Contact us with your order number and a photograph of the issue. We will arrange insured shipping in both directions, or you can arrange to bring the piece to us in person.`,
        ],
      },
    ],
  },
  {
    slug: "conflict-free",
    title: "Conflict-Free Sourcing",
    category: "services",
    image: "/images/product-2.jpg",
    imageAlt: "A certified loose diamond beside its grading report",
    excerpt: "What conflict-free actually means, why the Kimberley Process is not enough, and how we source.",
    readMinutes: 4,
    intro:
      "'Conflict-free' is used loosely across the industry. It is worth knowing what the term guarantees, because on its own it guarantees less than most people assume.",
    sections: [
      {
        id: "kimberley",
        title: "The Kimberley Process, and its limits",
        body: [
          "The Kimberley Process is an international certification scheme introduced in 2003 to stop rough diamonds funding armed conflict against legitimate governments. It has meaningfully reduced that trade.",
          "But its definition is narrow. It addresses rebel-financed conflict specifically, and does not by itself address labour conditions, environmental damage, or state-sponsored abuses. A stone can be Kimberley-certified and still come from a supply chain you would not choose.",
        ],
      },
      {
        id: "beyond",
        title: "What we do beyond it",
        body: [
          "We buy from a small number of suppliers we have worked with for years, and we favour sources that can demonstrate chain of custody from the mine rather than only at the point of export.",
          "Where we cannot establish provenance to our satisfaction, we do not buy the parcel. That costs us stones, which is the point.",
        ],
      },
      {
        id: "lab-grown",
        title: "Lab-grown as an option",
        body: [
          "Lab-grown diamonds sidestep mining entirely, which some clients prefer. They are not automatically the lower-impact choice — growth is energy-intensive, and that energy's source matters — but the supply chain is short and fully traceable.",
        ],
      },
      {
        id: "ask",
        title: "Ask us anything",
        body: [
          "If you want to know where a specific stone came from, ask. We will tell you what we know and be straightforward about the limits of what anyone can verify.",
        ],
      },
    ],
  },
  {
    slug: "resizing",
    title: "Free Resizing",
    category: "services",
    image: "/images/product-3.jpg",
    imageAlt: "A gold band being resized at the workbench",
    excerpt: "How resizing works, which rings can be resized, and what to do when one cannot.",
    readMinutes: 3,
    intro:
      "Fingers change with temperature, age, and the years. Your first resize with us is complimentary, and subsequent ones are charged at cost.",
    sections: [
      {
        id: "how",
        title: "How it works",
        body: [
          "A jeweller cuts the band at the base, adds or removes metal, then solders, reshapes, and refinishes it so the join is invisible. Most rings move up or down two sizes safely.",
          "Turnaround is usually seven to ten working days, and shipping is insured in both directions.",
        ],
      },
      {
        id: "limits",
        title: "What cannot be resized",
        body: ["Some designs cannot be altered without compromising them:"],
        bullets: [
          "Full eternity bands, where stones run the entire circumference",
          "Bands with channel-set or pavé stones running all the way round",
          "Rings with intricate engraving or patterning across the shank",
          "Tension settings, which rely on precise band tension to hold the stone",
        ],
      },
      {
        id: "alternatives",
        title: "If yours cannot be resized",
        body: [
          "For eternity bands, remaking at the correct size is usually the only proper answer, and we will credit the metal and stones from the original.",
          "For a temporary fix, sizing beads or a fitted insert can take up a half size without altering the band itself.",
        ],
      },
    ],
  },
  {
    slug: "price-match",
    title: "Price Match Guarantee",
    category: "services",
    image: "/images/product-4.jpg",
    imageAlt: "A diamond ring displayed beside its certification",
    excerpt: "When we will match a competitor's price on a comparable stone, and what comparable means.",
    readMinutes: 3,
    intro:
      "If you find the same stone cheaper elsewhere, tell us. We will match it where the comparison is genuinely like for like.",
    sections: [
      {
        id: "comparable",
        title: "What counts as comparable",
        body: [
          "Diamonds are only comparable when every grading variable matches. A stone that looks cheaper is very often a lower cut grade, a different laboratory's standards, or a different clarity.",
        ],
        bullets: [
          "Same shape and carat weight",
          "Same cut, colour, and clarity grades",
          "Graded by the same laboratory — standards differ measurably between them",
          "In stock and available to buy immediately from an authorised retailer",
        ],
      },
      {
        id: "excluded",
        title: "What we cannot match",
        body: [
          "We will not match prices from auction sites, private sellers, liquidation stock, or listings we cannot verify. Nor can we match bespoke commissions, since no two are the same piece.",
        ],
      },
      {
        id: "how",
        title: "How to claim",
        body: [
          `Send us a link or a screenshot showing the stone, its grading report number, and the price, before you order. We verify it the same day where we can and confirm in writing. Email ${SITE.email}.`,
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & Returns",
    category: "services",
    image: "/images/product-5.jpg",
    imageAlt: "A jewellery box packed for insured delivery",
    excerpt: "Delivery times, insurance, signature requirements, and how to return a piece.",
    readMinutes: 3,
    intro:
      "Everything ships fully insured and requires an adult signature. Nothing is left on a doorstep.",
    sections: [
      {
        id: "shipping",
        title: "Shipping",
        body: [
          "Ready-to-ship pieces leave within one to two business days. Made-to-order and bespoke commissions state their production time on the product page — typically three to five weeks.",
          "Every parcel is insured for its full value in transit and requires an adult signature on delivery. Packaging is deliberately unbranded for security.",
        ],
      },
      {
        id: "international",
        title: "International orders",
        body: [
          "We ship worldwide. Where you are the importer of record, duties and import taxes are payable by you and are not included at checkout — check your local thresholds before ordering, as they can be significant on jewellery.",
        ],
      },
      {
        id: "returns",
        title: "Returns",
        body: [
          "Ready-to-ship pieces can be returned within 30 days of delivery, unworn and in their original packaging with all certification included. Refunds are issued to the original payment method after inspection.",
          "Bespoke commissions, engraved pieces, non-standard resizes, and loose stones cut to order cannot be returned, as they hold no resale value.",
        ],
      },
      {
        id: "how",
        title: "Starting a return",
        body: [
          `Contact us with your order number and we will send an insured, prepaid return label. Do not ship jewellery back uninsured — if it is lost in transit without cover, we cannot refund it.`,
        ],
      },
    ],
  },
];

export function getEducationArticle(slug: string): EducationArticle | undefined {
  return EDUCATION_ARTICLES.find((article) => article.slug === slug);
}

export function getEducationArticlesByCategory(category: EducationCategorySlug): EducationArticle[] {
  return EDUCATION_ARTICLES.filter((article) => article.category === category);
}

export function getEducationCategory(slug: EducationCategorySlug): EducationCategory | undefined {
  return EDUCATION_CATEGORIES.find((category) => category.slug === slug);
}
