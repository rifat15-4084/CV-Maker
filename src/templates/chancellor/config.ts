import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "chancellor",
  name: "Chancellor",
  category: "Executive",
  thumbnail: null,
  defaultAccent: "#7f1d1d",
  accentOptions: ["#7f1d1d", "#e11d48", "#db2777", "#be123c", "#f43f5e", "#9d174d", "#7c3aed"],
  fonts: fontsFor("playfair", "libre", "garamond", "lora"),
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
  description: "Classical executive CV with a deep burgundy accent, centred masthead and a distinguished single column.",
  designNotes:
    "Single centred column with generous padding. Centred serif masthead (30pt name, letterspaced uppercase accent job title, centred two-column contacts); headings use a double rule (2pt accent top, hairline bottom).",
};
