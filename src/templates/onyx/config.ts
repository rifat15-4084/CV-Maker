import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "onyx",
  name: "Onyx",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0f172a",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("space", "inter", "montserrat", "ibmplex"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "photoShape",
      "label": "Photo shape",
      "type": "select",
      "options": [
        {
          "value": "circle",
          "label": "Circle"
        },
        {
          "value": "square",
          "label": "Square"
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
  hasPhoto: true,
  description: "Bold dark-header modern CV with a large photo, white-on-dark identity block and a crisp single-column body.",
  designNotes:
    "Full-width dark (#0f172a) header flex band with the photo on the left, over a single white column. The band carries white-on-dark name text, an accent job title and inline contacts; headings are accent underlines. Photo is 30mm circle or square per setting.",
};
