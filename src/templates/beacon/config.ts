import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "beacon",
  name: "Beacon",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#0f766e",
  accentOptions: ["#0f766e","#0891b2","#14b8a6","#059669","#155e75","#334155"],
  fonts: fontsFor("ibmplex", "source", "inter", "dmsans"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
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
  hasPhoto: false,
  description: "Confident professional CV with a header beacon rule, a summary band and clearly ruled experience entries.",
  designNotes:
    "Full-width header band closed by a 3pt accent bottom rule, over a single padded column. The 'beacon' rule under the masthead is the signature; headings are accent underlines.",
};
