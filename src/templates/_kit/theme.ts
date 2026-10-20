import type { CVData, CVSettings } from "@/lib/cv/schema";
import { resolveFont } from "./fonts";
import { isLight, mixWithBlack, mixWithWhite, readableOn, rgba } from "./color";

export type Density = "compact" | "normal" | "relaxed" | "dense";

export interface TemplateTheme {
  accent: string;
  accentText: string;
  accentDark: string;
  tint: string;
  tintStrong: string;
  tintSoft: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  paper: string;
  font: string;
  headingFont: string;
  bodySize: string;
  lineHeight: number;
  gap: string;
  sectionGap: string;
  radius: string;
  density: Density;
  spacing: CVSettings["spacing"];
}

const BODY_SIZES: Record<Density, string> = {
  compact: "9.5pt",
  normal: "10.5pt",
  relaxed: "11pt",
  dense: "9.75pt",
};

const LINE_HEIGHTS: Record<Density, number> = {
  compact: 1.4,
  normal: 1.55,
  relaxed: 1.65,
  dense: 1.45,
};

const GAPS: Record<Density, string> = {
  compact: "4pt",
  normal: "6pt",
  relaxed: "8pt",
  dense: "5pt",
};

const SECTION_GAPS: Record<Density, string> = {
  compact: "9pt",
  normal: "13pt",
  relaxed: "17pt",
  dense: "11pt",
};

/**
 * Turns a template config + saved settings into the concrete colour/typography
 * values every template renders with. Keeping this in one place means a
 * template author only writes layout, never colour maths.
 */
export function createTheme(
  data: CVData,
  options: {
    accent?: string;
    density?: Density;
    font?: string;
    headingFont?: string;
    paper?: string;
    radius?: string;
    bodySize?: string;
  } = {},
): TemplateTheme {
  const settings = data.settings;
  const accent = options.accent ?? settings.accent ?? "#0ea5e9";
  const density: Density = options.density ?? (settings.spacing === "relaxed" ? "relaxed" : settings.spacing === "compact" ? "compact" : "normal");
  const accentDark = isLight(accent) ? mixWithBlack(accent, 0.28) : accent;

  return {
    accent,
    accentText: readableOn(accent),
    accentDark,
    tint: rgba(accent, 0.1),
    tintStrong: rgba(accent, 0.18),
    tintSoft: rgba(accent, 0.06),
    ink: "#0f172a",
    muted: "#475569",
    faint: "#64748b",
    line: "#e2e8f0",
    paper: options.paper ?? "#ffffff",
    font: options.font ?? resolveFont(settings.font),
    headingFont: options.headingFont ?? options.font ?? resolveFont(settings.font),
    bodySize: options.bodySize ?? BODY_SIZES[density],
    lineHeight: LINE_HEIGHTS[density],
    gap: GAPS[density],
    sectionGap: SECTION_GAPS[density],
    radius: options.radius ?? "6pt",
    density,
    spacing: settings.spacing ?? "normal",
  };
}

export function darken(hex: string, amount: number) {
  return mixWithBlack(hex, amount);
}

export function lighten(hex: string, amount: number) {
  return mixWithWhite(hex, amount);
}
