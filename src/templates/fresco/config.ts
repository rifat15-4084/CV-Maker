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
  preview: {
    "header": "split",
    "sidebar": "right",
    "sidebarTinted": true,
    "photo": true,
    "photoShape": "circle",
    "density": "airy"
  },
};
