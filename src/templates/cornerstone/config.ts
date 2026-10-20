import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "cornerstone",
  name: "Cornerstone",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#78350f",
  accentOptions: ["#b45309","#d97706","#f59e0b","#ea580c","#92400e","#78350f"],
  fonts: fontsFor("libre", "source", "lora", "inter"),
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
  description: "Traditional professional CV with a serif masthead, centred contact line and firmly ruled sections.",
  designNotes:
    "Single centred column. Centred grid masthead — serif name, letterspaced uppercase accent job title, then a full-width hairline over centred two-column contacts; headings are accent underlines.",
};
