import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "dotmatrix",
  name: "Dotmatrix",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#a855f7",
  accentOptions: ["#7c3aed","#8b5cf6","#6d28d9","#a855f7","#4c1d95","#2563eb"],
  fonts: fontsFor("ibmmono", "space", "ibmplex", "inter"),
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
  description: "Playful tech CV with dotted markers, monospace headings and a compact technical density.",
  designNotes:
    "Full-bleed tinted header band over a single padded column. The band renders a radial-gradient halftone dot screen behind a reversed-out name; headings are spaced caps with dotted 1pt rules between sections.",
};
