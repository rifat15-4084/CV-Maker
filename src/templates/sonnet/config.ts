import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "sonnet",
  name: "Sonnet",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#9d174d",
  accentOptions: ["#e11d48","#db2777","#be123c","#f43f5e","#9d174d","#7c3aed"],
  fonts: fontsFor("playfair", "lora", "libre", "garamond"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
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
  description: "Editorial-creative CV with a large serif name, italic subtitle and generous classical spacing.",
  designNotes:
    "Single centred narrow measure (27mm margins) at relaxed density. Centred masthead with a 22mm monogram roundel, 33pt serif name, italic subtitle and symmetric hairline rules; headings use a double rule. Short sections split into two columns.",
};
