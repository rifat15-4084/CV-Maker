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
  designNotes:
    "Full-width gradient accent header band over a single column. The band holds a 32mm circle portrait in a white ring with a 30pt name and inline icon contacts; headings use an accent left border. Vertical timeline rails with accent dots mark experience and education.",
};
