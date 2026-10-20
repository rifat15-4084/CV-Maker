import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "atlas",
  name: "Atlas",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#0f766e",
  accentOptions: ["#0f766e", "#1d4ed8", "#9a3412", "#5b21b6", "#334155", "#b91c1c"],
  fonts: fontsFor("source", "inter", "dmsans", "lora"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "sectionDividers", label: "Show divider lines between sections", type: "toggle" },
    { key: "contactColumns", label: "Contact columns", type: "select", options: [
      { value: "2", label: "Two columns" },
      { value: "3", label: "Three columns" },
    ] },
  ],
  hasPhoto: false,
  description:
    "Corporate single-column CV with a bordered masthead, three-column contact strip and clearly ruled sections — safe and familiar for recruiters.",
  preview: { header: "banner", sidebar: "none", accentRule: "underline", density: "normal" },
};
