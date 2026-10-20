import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "aurora",
  name: "Aurora",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0ea5e9",
  accentOptions: ["#0ea5e9", "#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"],
  fonts: fontsFor("inter", "dmsans", "source", "playfair"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "showPhoto", label: "Show photo in sidebar", type: "toggle" },
    { key: "showContactIcons", label: "Show contact icons", type: "toggle" },
  ],
  hasPhoto: true,
  description:
    "Modern two-column CV with a soft tinted sidebar, circular photo and crisp section rules — a strong all-rounder for most industries.",
  designNotes:
    "Two-column with a 64mm tinted left sidebar, full 297mm height. Main header is the name over an uppercase spaced job title with a 26mm accent rule; sidebar headings are spaced caps in the accent.",
};
