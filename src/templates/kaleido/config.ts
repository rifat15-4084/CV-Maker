import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "kaleido",
  name: "Kaleido",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#0891b2",
  accentOptions: ["#0891b2","#06b6d4","#0284c7","#0e7490","#155e75","#2563eb"],
  fonts: fontsFor("space", "montserrat", "dmsans", "inter"),
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
          "value": "bars",
          "label": "Bars"
        },
        {
          "value": "chips",
          "label": "Chips"
        }
      ]
    },
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
    }
  ],
  hasPhoto: false,
  description: "Colour-forward creative CV with alternating tinted section panels and dot-scale skills for a portfolio feel.",
  preview: {
    "header": "centered",
    "sidebar": "none",
    "accentRule": "underline",
    "density": "normal"
  },
};
