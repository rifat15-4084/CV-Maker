import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "vivid",
  name: "Vivid",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#c026d3",
  accentOptions: ["#db2777","#e11d48","#be185d","#c026d3","#9d174d","#7c3aed"],
  fonts: fontsFor("space", "montserrat", "dmsans", "inter"),
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
  description: "Energetic creative CV with colour-blocked headings, a two-column body and playful chip clusters.",
  designNotes:
    "Two-column (1fr 1fr) under a top header block. Left masthead with an oversized 33pt name and a bold accent job title; headings render as solid accent bars stacked in the main column and spaced caps in the side column. The colour-blocked headings are the signature.",
};
