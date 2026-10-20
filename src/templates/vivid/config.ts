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
  preview: {
    "header": "split",
    "sidebar": "none",
    "accentRule": "block",
    "density": "normal"
  },
};
