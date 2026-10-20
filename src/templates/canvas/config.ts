import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "canvas",
  name: "Canvas",
  category: "Creative",
  thumbnail: null,
  defaultAccent: "#e11d48",
  accentOptions: ["#e11d48", "#f97316", "#7c3aed", "#0891b2", "#65a30d", "#db2777"],
  fonts: fontsFor("space", "montserrat", "dmsans", "playfair"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "showPhoto", label: "Show photo", type: "toggle" },
    { key: "projectColumns", label: "Project grid columns", type: "select", options: [
      { value: "2", label: "Two columns" },
      { value: "1", label: "One column" },
    ] },
    { key: "coverTagline", label: "Show cover tagline", type: "toggle" },
  ],
  hasPhoto: true,
  description:
    "Creative layout with an overlapping accent panel, framed photo, boxed section headings and a two-column project grid for portfolio pieces.",
  preview: { header: "split", sidebar: "none", photo: true, photoShape: "square", accentRule: "block", density: "normal" },
};
