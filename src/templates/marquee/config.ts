import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "marquee",
  name: "Marquee",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#e11d48",
  accentOptions: ["#e11d48","#db2777","#be123c","#f43f5e","#9d174d","#7c3aed"],
  fonts: fontsFor("montserrat", "space", "playfair", "dmsans"),
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
    }
  ],
  hasPhoto: true,
  description: "Bold creative CV with an oversized name treatment, a full-bleed accent band and a framed portrait.",
  designNotes:
    "Full-bleed accent header band over a single full-width body column. The band carries an oversized 40pt name with a letterspaced uppercase job title and a 34mm circle or square portrait ringed in translucent white; headings are accent underlines.",
};
