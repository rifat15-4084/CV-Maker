import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "nimbus",
  name: "Nimbus",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0891b2",
  accentOptions: ["#0891b2","#06b6d4","#0284c7","#0e7490","#155e75","#2563eb"],
  fonts: fontsFor("dmsans", "source", "inter", "ibmplex"),
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
  description: "Cloud-soft two-column modern CV with a tinted sidebar, circular photo and stacked sidebar facts.",
  preview: {
    "header": "split",
    "sidebar": "left",
    "sidebarTinted": true,
    "photo": true,
    "photoShape": "circle",
    "density": "normal"
  },
};
