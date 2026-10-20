import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "orbit",
  name: "Orbit",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#06b6d4",
  accentOptions: ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"],
  fonts: fontsFor("dmsans", "inter", "space", "ibmplex"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "showPhoto", label: "Show photo", type: "toggle" },
    { key: "skillLevelStyle", label: "Skill level style", type: "select", options: [
      { value: "dots", label: "Dots" },
      { value: "bars", label: "Bars" },
      { value: "hidden", label: "Names only" },
    ] },
  ],
  hasPhoto: true,
  description:
    "Timeline-driven two-column CV with a gradient header, circular photo and a vertical rail that makes career progression obvious at a glance.",
  preview: { header: "band", sidebar: "none", photo: true, photoShape: "circle", accentRule: "full", density: "normal" },
};
