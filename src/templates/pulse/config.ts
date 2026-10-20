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
  designNotes:
    "Full-height 14mm accent spine down the left with the name set vertically (writing-mode: vertical-rl) inside it, plus a horizontal name in the content column. Headings use an accent left border; experience uses a timeline rail and contacts render as an outlined pill strip.",
};
