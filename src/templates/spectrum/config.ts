import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "spectrum",
  name: "Spectrum",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#7c3aed",
  accentOptions: ["#7c3aed","#8b5cf6","#6d28d9","#a855f7","#4c1d95","#2563eb"],
  fonts: fontsFor("montserrat", "space", "dmsans", "inter"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionColumns",
      "label": "Body columns",
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
  hasPhoto: false,
  description: "Gradient masthead, two-column body and tinted info cards that group summary, skills and languages tight together.",
  preview: {
    "header": "band",
    "sidebar": "none",
    "accentRule": "full",
    "density": "normal"
  },
};
