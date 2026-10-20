import type { SectionKey } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "scholar",
  name: "Scholar",
  category: "Academic",
  thumbnail: null,
  defaultAccent: "#1e3a8a",
  accentOptions: ["#1e3a8a", "#7f1d1d", "#166534", "#4c1d95", "#0f172a", "#7c2d12"],
  fonts: fontsFor("garamond", "libre", "lora", "source"),
  supportedSections: [
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages",
    "awards",
    "references",
    "custom",
  ] as SectionKey[],
  extraFields: [
    { key: "profileHeading", label: "Profile heading", type: "text", help: "Shown above the summary" },
    { key: "showContactInline", label: "Contact on one centred line", type: "toggle" },
  ],
  hasPhoto: false,
  description:
    "Traditional academic CV: centred serif masthead, dense single column, publication-style entries and restrained colour.",
  preview: { header: "centered", sidebar: "none", density: "dense", accentRule: "underline" },
};
