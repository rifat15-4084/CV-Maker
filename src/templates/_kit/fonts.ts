import type { TemplateFontOption } from "../types";

/**
 * Font families used by templates. They are loaded once in the root layout
 * through a single Google Fonts stylesheet (runtime, no build-time fetch).
 */
export const FONT_LIBRARY: Record<string, TemplateFontOption> = {
  inter: { id: "inter", label: "Inter", stack: "Inter, ui-sans-serif, system-ui, sans-serif" },
  dmsans: { id: "dmsans", label: "DM Sans", stack: "'DM Sans', Arial, Helvetica, sans-serif" },
  space: {
    id: "space",
    label: "Space Grotesk",
    stack: "'Space Grotesk', Arial, Helvetica, sans-serif",
  },
  montserrat: {
    id: "montserrat",
    label: "Montserrat",
    stack: "Montserrat, Arial, Helvetica, sans-serif",
  },
  source: {
    id: "source",
    label: "Source Sans 3",
    stack: "'Source Sans 3', Arial, Helvetica, sans-serif",
  },
  ibmplex: { id: "ibmplex", label: "IBM Plex Sans", stack: "'IBM Plex Sans', Arial, sans-serif" },
  ibmmono: { id: "ibmmono", label: "IBM Plex Mono", stack: "'IBM Plex Mono', monospace" },
  playfair: { id: "playfair", label: "Playfair Display", stack: "'Playfair Display', Georgia, serif" },
  lora: { id: "lora", label: "Lora", stack: "Lora, Georgia, serif" },
  merriweather: { id: "merriweather", label: "Merriweather", stack: "Merriweather, Georgia, serif" },
  libre: {
    id: "libre",
    label: "Libre Baskerville",
    stack: "'Libre Baskerville', Georgia, serif",
  },
  garamond: { id: "garamond", label: "EB Garamond", stack: "'EB Garamond', Garamond, Georgia, serif" },
  system: { id: "system", label: "System Sans", stack: "ui-sans-serif, system-ui, sans-serif" },
  georgia: { id: "georgia", label: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
};

export function resolveFont(id?: string | null): string {
  return FONT_LIBRARY[id ?? "inter"]?.stack ?? FONT_LIBRARY.inter.stack;
}

export function fontsFor(...ids: string[]): TemplateFontOption[] {
  return ids.map((id) => FONT_LIBRARY[id]).filter(Boolean) as TemplateFontOption[];
}

/**
 * Resolves the font stack for a template: the user's saved choice wins when it
 * belongs to the template's palette, otherwise the template default is used.
 */
export function pickFont(current: string | undefined, options: TemplateFontOption[]): string {
  const match = options.find((option) => option.id === current);
  if (match) return match.stack;
  return (options[0] ?? FONT_LIBRARY.inter).stack;
}
