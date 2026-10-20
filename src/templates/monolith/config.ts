import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "monolith",
  name: "Monolith",
  category: "Executive",
  thumbnail: null,
  defaultAccent: "#b45309",
  accentOptions: ["#b45309", "#0f172a", "#7f1d1d", "#1e3a8a", "#166534", "#4c1d95"],
  fonts: fontsFor("playfair", "libre", "lora", "merriweather"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "showTagline", label: "Show tagline under title", type: "toggle" },
    { key: "contactLayout", label: "Contact layout", type: "select", options: [
      { value: "row", label: "Three columns" },
      { value: "wrap", label: "Wrapped" },
    ] },
  ],
  hasPhoto: false,
  description:
    "Executive CV with a commanding dark header band, serif display type and a disciplined single-column body built for senior leadership roles.",
  preview: { header: "banner", sidebar: "none", accentRule: "full", density: "normal" },
};
