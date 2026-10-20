export const SITE_NAME = "CV Maker";
export const SITE_SHORT_NAME = "CV";
export const SITE_TAGLINE = "Make a CV that gets you hired";
export const SITE_DESCRIPTION =
  "CV Maker is a free CV builder with 60 print-ready templates, live preview, automatic saving in your browser and clean ATS-friendly PDF downloads.";

/** Shown in the footer as the person behind the project. */
export const AUTHOR_NAME = "MD Rifat Hasan";
export const AUTHOR_URL = "https://md-rifat-hasan.vercel.app";

export const SUPPORT_EMAIL = "support@cvmaker.app";

/** Absolute origin of the deployment, used for auth redirects and metadata. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/templates", label: "Templates" },
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "CV tips & guides" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms-of-service", label: "Terms of service" },
    ],
  },
];
