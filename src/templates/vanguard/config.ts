import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "vanguard",
  name: "Vanguard",
  category: "Executive",
  thumbnail: null,
  defaultAccent: "#0f172a",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("montserrat", "playfair", "source", "inter"),
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
  description: "Commanding executive CV with a dark masthead, portrait and restrained monochrome authority.",
  preview: {
    "header": "banner",
    "sidebar": "none",
    "photo": true,
    "photoShape": "square",
    "accentRule": "full",
    "density": "normal"
  },
};
