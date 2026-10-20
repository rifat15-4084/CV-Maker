import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "meridian-exec",
  name: "Meridian Exec",
  category: "Executive",
  thumbnail: null,
  defaultAccent: "#0f766e",
  accentOptions: ["#0f766e","#0891b2","#14b8a6","#059669","#155e75","#334155"],
  fonts: fontsFor("source", "playfair", "inter", "lora"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    },
    {
      "key": "timeline",
      "label": "Timeline rail for dates",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Executive CV with a tinted left identity aside, accent spine and timeline-led career history.",
  preview: {
    "header": "split",
    "sidebar": "left",
    "sidebarTinted": true,
    "accentRule": "block",
    "density": "normal"
  },
};
