import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "kernel",
  name: "Kernel",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#7c3aed",
  accentOptions: ["#7c3aed","#8b5cf6","#6d28d9","#a855f7","#4c1d95","#2563eb"],
  fonts: fontsFor("ibmplex", "space", "ibmmono", "inter"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "skillLevelStyle",
      "label": "Skill level style",
      "type": "select",
      "options": [
        {
          "value": "bars",
          "label": "Bars"
        },
        {
          "value": "chips",
          "label": "Chips"
        },
        {
          "value": "hidden",
          "label": "Names only"
        }
      ]
    }
  ],
  hasPhoto: true,
  description: "Developer CV with a dark identity rail, square photo and a focused main column for stack and projects.",
  preview: {
    "header": "rail",
    "sidebar": "left",
    "photo": true,
    "photoShape": "square",
    "accentRule": "block",
    "density": "dense"
  },
};
