import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "prism",
  name: "Prism",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#6366f1",
  accentOptions: ["#7c3aed","#8b5cf6","#6d28d9","#a855f7","#4c1d95","#2563eb"],
  fonts: fontsFor("space", "montserrat", "inter", "georgia"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "skillLevelStyle",
      "label": "Skill level style",
      "type": "select",
      "options": [
        {
          "value": "dots",
          "label": "Dots"
        },
        {
          "value": "chips",
          "label": "Chips"
        }
      ]
    },
    {
      "key": "contactColumns",
      "label": "Contact columns",
      "type": "select",
      "options": [
        {
          "value": "1",
          "label": "One column"
        },
        {
          "value": "2",
          "label": "Two columns"
        }
      ]
    }
  ],
  hasPhoto: false,
  description: "Refined two-column design with a slim accent spine, right-aligned dates and a skills matrix in the sidebar.",
  preview: {
    "header": "split",
    "sidebar": "right",
    "photo": false,
    "accentRule": "block",
    "density": "normal"
  },
};
