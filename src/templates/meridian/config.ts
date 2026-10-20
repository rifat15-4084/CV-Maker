import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "meridian",
  name: "Meridian",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#059669",
  accentOptions: ["#059669", "#166534", "#15803d", "#3f6212", "#047857", "#065f46", "#1e3a8a"],
  fonts: fontsFor("source", "inter", "lora", "dmsans"),
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
  description: "Centred identity block, three-column contact strip and a balanced single column with numbered section markers.",
  designNotes:
    "Single centred column. Centred name beside a 30mm circle photo with an 18mm accent rule beneath and two-column bordered contact strip; headings use numbered accent circle counters with uppercase text and a trailing hairline.",
};
