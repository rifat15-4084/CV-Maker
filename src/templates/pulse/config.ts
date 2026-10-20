import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "pulse",
  name: "Pulse",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#db2777",
  accentOptions: ["#db2777","#e11d48","#be185d","#c026d3","#9d174d","#7c3aed"],
  fonts: fontsFor("montserrat", "space", "dmsans", "inter"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "timeline",
      "label": "Timeline rail for dates",
      "type": "toggle"
    },
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Vibrant modern CV with a thick accent rule, timeline rails for experience and chip-style skills.",
  preview: {
    "header": "stacked",
    "sidebar": "none",
    "accentRule": "full",
    "density": "normal"
  },
};
