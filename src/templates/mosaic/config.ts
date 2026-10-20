import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "mosaic",
  name: "Mosaic",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#0d9488",
  accentOptions: ["#0d9488", "#0f766e", "#0891b2", "#14b8a6", "#059669", "#155e75", "#334155"],
  fonts: fontsFor("dmsans", "space", "source", "inter"),
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
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Grid-led creative CV that tiles skills and languages beside a strong narrative column with crisp accents.",
  designNotes:
    "Two-column (1fr / 58mm) separated by a heavy 2pt accent rule above the grid. Left masthead; main headings are accent underlines and the right column uses spaced caps. The thick rule dividing header from body is the differentiator.",
};
