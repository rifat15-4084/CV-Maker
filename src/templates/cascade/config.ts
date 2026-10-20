import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "cascade",
  name: "Cascade",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0284c7",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("inter", "system", "dmsans", "ibmplex"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "timeline",
      "label": "Show timeline rail for experience",
      "type": "toggle"
    }
  ],
  hasPhoto: true,
  description: "Left-tinted sidebar with white-on-accent header card, cascading timeline entries and generous whitespace between sections.",
  preview: {
    "header": "split",
    "sidebar": "left",
    "sidebarTinted": true,
    "photo": true,
    "photoShape": "circle",
    "accentRule": "underline",
    "density": "airy"
  },
};
