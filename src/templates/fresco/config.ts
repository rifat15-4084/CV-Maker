import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "fresco",
  name: "Fresco",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#ea580c",
  accentOptions: ["#b45309","#d97706","#f59e0b","#ea580c","#92400e","#78350f"],
  fonts: fontsFor("playfair", "space", "montserrat", "lora"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: true,
  description: "Painterly creative CV with a serif display masthead, tinted side panel and softly rounded section blocks.",
  designNotes:
    "Two-column with a 62mm tinted right sidebar separated by a hairline. Split header puts a large 32pt serif name and job title in the main column; headings are accent underlines in main and spaced caps in the sidebar. Sidebar holds a 32mm circle photo.",
};
