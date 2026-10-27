import { SITE } from "@/constants/site";
import type { ContentSection } from "@/types";

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
}

export const COMPANY_VALUES: CompanyValue[] = [
  {
    id: "craft",
    title: "Craft Before Volume",
    description:
      "Every piece is finished by hand in our New Jersey atelier. We would rather release a dozen pieces we are proud of than a hundred we are not.",
  },
  {
    id: "provenance",
    title: "Honest Provenance",
    description:
      "Every centre stone arrives with independent certification, and every setting is traceable back to the bench that made it. Nothing is sourced from a supply chain we cannot walk ourselves.",
  },
  {
    id: "transparency",
    title: "Transparent Pricing",
    description:
      "The price you see is the price of the metal, the stones, and the hours — not a markup built to survive a permanent sale. We publish our specifications in full.",
  },
  {
    id: "permanence",
    title: "Built to Outlast Us",
    description:
      "Complimentary resizing, cleaning, and prong checks for life. A piece bought here should still be worn three generations from now.",
  },
];

/* ------------------------------------------------------------------ */
/* Our Story                                                           */
/* ------------------------------------------------------------------ */

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const STORY_TIMELINE: TimelineEntry[] = [
  {
    id: "founded",
    year: "2008",
    title: "A Bench and a Loupe",
    description:
      "Forever Jewels began as a single workbench in a shared workshop, taking commissions for engagement rings that the larger houses would not attempt.",
  },
  {
    id: "atelier",
    year: "2012",
    title: "The Atelier Opens",
    description:
      "Four master jewelers joined the bench and we moved into a proper atelier — casting, setting, and polishing brought under one roof so nothing left the building unfinished.",
  },
  {
    id: "sourcing",
    year: "2016",
    title: "Direct Sourcing",
    description:
      "We began buying rough directly and cutting to our own specifications, which let us guarantee provenance on every centre stone rather than trusting a paper trail.",
  },
  {
    id: "lab-grown",
    year: "2020",
    title: "Lab-Grown, Properly Done",
    description:
      "We added certified lab-grown diamonds — graded to the same standard as our natural stones, and priced honestly rather than as a discount gimmick.",
  },
  {
    id: "today",
    year: "Today",
    title: "Still the Same Bench",
    description:
      "Thousands of commissions later, every piece is still finished by hand by the people whose names are on the bench. That has never been negotiable.",
  },
];

/* ------------------------------------------------------------------ */
/* Careers                                                             */
/* ------------------------------------------------------------------ */

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "bench-jeweler",
    title: "Bench Jeweler",
    department: "Atelier",
    location: "New Jersey",
    type: "Full-time",
    description:
      "Hand-fabricate and finish fine jewellery, from wax to final polish. Five or more years at the bench, with demonstrable stone-setting work.",
  },
  {
    id: "diamond-setter",
    title: "Diamond Setter",
    department: "Atelier",
    location: "New Jersey",
    type: "Full-time",
    description:
      "Micro-pavé, channel, and bezel setting on platinum and gold. Precision under magnification matters more here than speed.",
  },
  {
    id: "client-advisor",
    title: "Client Advisor",
    department: "Retail",
    location: "New Jersey",
    type: "Full-time",
    description:
      "Guide clients through bespoke commissions from first consultation to collection. Experience in fine jewellery or a comparable considered-purchase category.",
  },
  {
    id: "cad-designer",
    title: "CAD Designer",
    department: "Design",
    location: "Remote / New Jersey",
    type: "Full-time",
    description:
      "Translate sketches and client briefs into production-ready CAD. Strong RhinoGold or MatrixGold portfolio required.",
  },
  {
    id: "ecommerce-manager",
    title: "Ecommerce Manager",
    department: "Digital",
    location: "New Jersey",
    type: "Full-time",
    description:
      "Own the online storefront end to end — merchandising, product data, and the conversion path from first visit to fitting.",
  },
];

export interface Benefit {
  id: string;
  title: string;
  description: string;
}

export const CAREER_BENEFITS: Benefit[] = [
  {
    id: "apprenticeship",
    title: "Funded Apprenticeships",
    description: "We pay for bench training and certification, including GIA coursework, for anyone who wants it.",
  },
  {
    id: "health",
    title: "Full Health Coverage",
    description: "Medical, dental, and vision from your first day, with the premium covered for you and your dependents.",
  },
  {
    id: "profit",
    title: "Profit Sharing",
    description: "Everyone who touches the work shares in the year it produces — bench, retail, and back office alike.",
  },
  {
    id: "leave",
    title: "Genuine Time Off",
    description: "Twenty-five days of paid leave plus public holidays, and we expect you to take all of it.",
  },
];

/* ------------------------------------------------------------------ */
/* Legal                                                               */
/* ------------------------------------------------------------------ */

/** Legal documents are just content sections — kept as an alias for readability. */
export type LegalSection = ContentSection;

export const LEGAL_LAST_UPDATED = "1 January 2026";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: [
      `By accessing or using ${SITE.name}'s website, placing an order, or creating an account, you agree to be bound by these Terms & Conditions and by our Privacy Policy. If you do not agree with any part of them, please do not use this site.`,
      "We may revise these terms from time to time. The version published on this page at the moment you place an order is the version that governs that order.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility and Accounts",
    body: [
      "You must be at least 18 years old, or the age of majority where you live, to place an order or hold an account with us.",
      "You are responsible for keeping your account credentials confidential and for all activity that takes place under your account. Tell us promptly if you believe your account has been used without your permission.",
    ],
  },
  {
    id: "products",
    title: "3. Products, Pricing and Availability",
    body: [
      "We photograph every piece in our own studio and describe its specifications as accurately as we can. Natural stones vary, and colour reproduction differs between screens, so slight variation between the photograph and the delivered piece is normal and is not a defect.",
      "Prices are shown in the currency selected on site and exclude taxes and duties unless stated otherwise. Precious metal and gemstone prices move, and we reserve the right to change prices before an order is accepted.",
      "If a piece is listed at a materially incorrect price or is unavailable after you order, we will contact you and offer either a corrected order or a full refund. We do not fulfil obviously erroneous pricing.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders and Payment",
    body: [
      "Your order is an offer to buy. A contract forms only when we send an order confirmation. We may decline an order — for example where we cannot verify payment or the piece is no longer available.",
      "Bespoke and made-to-order commissions require payment in full before work begins, as the piece cannot be resold.",
    ],
  },
  {
    id: "shipping",
    title: "5. Shipping and Risk",
    body: [
      "Delivery estimates shown at checkout are estimates, not guarantees. Made-to-order pieces state their production time on the product page.",
      "All shipments are fully insured in transit and require an adult signature. Risk passes to you on delivery. Where you are the importer of record, any duties or import taxes are your responsibility.",
    ],
  },
  {
    id: "returns",
    title: "6. Returns, Exchanges and Repairs",
    body: [
      "Ready-to-ship pieces may be returned within 30 days of delivery, unworn and in their original packaging with all certification. Refunds are issued to the original payment method once the piece has been inspected.",
      "The following cannot be returned, because they are made to your specification and hold no resale value:",
    ],
    bullets: [
      "Bespoke and custom commissions",
      "Engraved or otherwise personalised pieces",
      "Rings resized beyond our standard complimentary adjustment",
      "Loose stones cut to a specific order",
    ],
  },
  {
    id: "warranty",
    title: "7. Warranty",
    body: [
      "Every piece carries a lifetime warranty against manufacturing defects, together with complimentary cleaning, prong checks, and one standard resizing.",
      "The warranty does not cover ordinary wear, accidental damage, loss, or work carried out by a third-party jeweler. Having a piece worked on elsewhere voids it.",
    ],
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    body: [
      `All designs, photography, text, and marks on this site are owned by ${SITE.name} or used under licence, and may not be reproduced, or used to train a machine-learning model, without our written permission.`,
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, our total liability arising out of any order is limited to the amount you paid for the piece concerned. We are not liable for indirect or consequential loss.",
      "Nothing in these terms excludes liability for fraud, for death or personal injury caused by negligence, or for anything else that cannot lawfully be excluded.",
    ],
  },
  {
    id: "law",
    title: "10. Governing Law and Contact",
    body: [
      "These terms are governed by the laws of the State of New York, and the courts of New York shall have exclusive jurisdiction.",
      `Questions about these terms can be sent to ${SITE.email}.`,
    ],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    body: [
      `This policy explains what personal information ${SITE.name} collects, why we collect it, and what you can do about it. We collect the minimum needed to sell, deliver, and service fine jewellery — and we do not sell your data to anyone.`,
    ],
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    body: ["We collect information you give us directly, and a smaller amount automatically as you browse:"],
    bullets: [
      "Contact and identity details — name, email, phone, billing and shipping addresses",
      "Order history, wishlist, and saved designs",
      "Correspondence with our client advisors, including appointment and commission notes",
      "Device and usage data — browser, approximate location, and the pages you view",
    ],
  },
  {
    id: "payment",
    title: "3. Payment Information",
    body: [
      "We never see or store your full card number. Payments are processed by PCI-DSS compliant providers who pass us only a payment reference and the last four digits, so that you and our advisors can identify the transaction.",
    ],
  },
  {
    id: "use",
    title: "4. How We Use Your Information",
    body: ["We use your information to:"],
    bullets: [
      "Process orders, arrange insured delivery, and handle returns and repairs",
      "Provide warranty service and keep a record of the pieces you own",
      "Answer enquiries and manage appointments and commissions",
      "Send marketing you have asked for — and only until you ask us to stop",
      "Detect fraud and meet our legal and tax obligations",
    ],
  },
  {
    id: "sharing",
    title: "5. Who We Share It With",
    body: [
      "We share personal information only with the parties needed to complete what you asked us to do: payment processors, insured shipping carriers, independent gemological laboratories, and the technology providers that run our site and email.",
      "Each is bound by contract to use the information only on our instructions. We do not sell personal information, and we do not share it with advertisers for their own purposes.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies",
    body: [
      "Essential cookies keep your cart and session working and cannot be switched off. Analytics and preference cookies are optional — you can decline them when you first visit and change your choice at any time in your browser settings.",
    ],
  },
  {
    id: "retention",
    title: "7. How Long We Keep It",
    body: [
      "Order and warranty records are kept for as long as the warranty runs, because it is a lifetime warranty and we need the record to honour it. Financial records are kept for seven years to meet tax law. Marketing contact details are deleted promptly once you unsubscribe.",
    ],
  },
  {
    id: "rights",
    title: "8. Your Rights",
    body: ["Depending on where you live, you may have the right to:"],
    bullets: [
      "Ask for a copy of the information we hold about you",
      "Have inaccurate information corrected",
      "Ask us to delete information we no longer need to keep",
      "Object to or restrict how we use it, and withdraw consent for marketing",
      "Receive your information in a portable format",
    ],
  },
  {
    id: "security",
    title: "9. Security",
    body: [
      "Traffic to this site is encrypted in transit, access to client records is restricted to staff who need it, and our payment flow is handled entirely by certified processors. No system is perfectly secure, but we will tell you and the relevant regulator promptly if a breach affects you.",
    ],
  },
  {
    id: "children",
    title: "10. Children",
    body: [
      "This site is not directed at children under 13 and we do not knowingly collect their information. If you believe a child has given us personal information, contact us and we will delete it.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    body: [
      `To exercise any of these rights, or to ask how your information is handled, write to ${SITE.email}. We respond within 30 days.`,
    ],
  },
];
