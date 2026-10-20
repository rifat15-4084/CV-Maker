/**
 * Archetype definitions for the generated templates.
 *
 * Each entry describes a GENUINELY different layout (not a recolour):
 * different header structure, column model, sidebar treatment, section chrome
 * and typography. `scripts/scaffold-templates.mjs` turns these into a template
 * folder (`config.ts` + `index.tsx`).
 */

const ACCENTS = {
  blue: ["#2563eb", "#1d4ed8", "#3b82f6", "#0ea5e9", "#4f46e5", "#334155"],
  teal: ["#0f766e", "#0891b2", "#14b8a6", "#059669", "#155e75", "#334155"],
  violet: ["#7c3aed", "#8b5cf6", "#6d28d9", "#a855f7", "#4c1d95", "#2563eb"],
  rose: ["#e11d48", "#db2777", "#be123c", "#f43f5e", "#9d174d", "#7c3aed"],
  amber: ["#b45309", "#d97706", "#f59e0b", "#ea580c", "#92400e", "#78350f"],
  slate: ["#334155", "#0f172a", "#475569", "#1e293b", "#0f766e", "#1e3a8a"],
  green: ["#166534", "#15803d", "#3f6212", "#047857", "#065f46", "#1e3a8a"],
  navy: ["#1e3a8a", "#172554", "#1d4ed8", "#0f172a", "#1e40af", "#312e81"],
};

const EXTRA = {
  photo: { key: "showPhoto", label: "Show photo", type: "toggle" },
  photoLeft: { key: "photoPosition", label: "Photo position", type: "select", options: [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ] },
  skillBars: { key: "skillLevelStyle", label: "Skill level style", type: "select", options: [
    { value: "bars", label: "Bars" },
    { value: "chips", label: "Chips" },
    { value: "hidden", label: "Names only" },
  ] },
  skillDots: { key: "skillLevelStyle", label: "Skill level style", type: "select", options: [
    { value: "dots", label: "Dots" },
    { value: "chips", label: "Chips" },
  ] },
  contactColumns: { key: "contactColumns", label: "Contact columns", type: "select", options: [
    { value: "1", label: "One column" },
    { value: "2", label: "Two columns" },
  ] },
  dividers: { key: "sectionDividers", label: "Divider lines between sections", type: "toggle" },
  twoCol: { key: "sectionColumns", label: "Body columns", type: "select", options: [
    { value: "1", label: "One column" },
    { value: "2", label: "Two columns" },
  ] },
};

export const ARCHETYPES = [
  /* ----------------------------------------------------------------- Modern */
  {
    id: "lumen",
    name: "Lumen",
    category: "Modern",
    accent: "#0ea5e9",
    accentOptions: ACCENTS.blue,
    fonts: ["inter", "dmsans", "source", "system"],
    description:
      "Soft-modern layout with a tinted full-width sidebar, glowing accent rule under the name and bar-style skill emphasis.",
    preview: { header: "split", sidebar: "left", photo: true, photoShape: "circle", accentRule: "underline", density: "normal" },
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.contactColumns],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;

  const options: SectionStyleOptions = {
    titleVariant: "underline",
    entryLayout: "row",
    bulletMarker: "disc",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "62mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.tintSoft, padding: "15mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          {showPhoto ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo src={personal.photo} theme={theme} size="32mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} />
            </div>
          ) : null}
          <SheetSection title="Contact" variant="sidebar" theme={theme}>
            <ContactBlock data={data} theme={theme} columns={1} />
          </SheetSection>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle: "bars" }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>

        <main style={{ padding: "15mm 14mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              {fullName(personal) || "Your Name"}
            </h1>
            {personal.jobTitle ? (
              <p style={{ margin: "4pt 0 0", fontSize: "11pt", fontWeight: 600, color: theme.accentDark }}>{personal.jobTitle}</p>
            ) : null}
            <div aria-hidden style={{ width: "24mm", height: "2.5pt", background: theme.accent, marginTop: "8pt", borderRadius: "2pt" }} />
            {personal.tagline ? (
              <p style={{ margin: "8pt 0 0", fontSize: "9.8pt", color: theme.muted }}>{personal.tagline}</p>
            ) : null}
          </header>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="awards" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="references" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "vertex",
    name: "Vertex",
    category: "Modern",
    accent: "#4f46e5",
    accentOptions: ACCENTS.violet,
    fonts: ["space", "montserrat", "dmsans", "inter"],
    description:
      "Two-column modern CV with a colour-block header, angular accents and a compact right rail for skills and languages.",
    preview: { header: "band", sidebar: "right", sidebarTinted: true, accentRule: "block", density: "normal" },
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.skillBars],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const skillStyle = String(data.extra.skillLevelStyle ?? "bars") as "bars" | "chips";

  const options: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "row",
    bulletMarker: "square",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ background: theme.accent, color: theme.accentText, padding: "14mm 14mm", display: "flex", gap: "10mm", alignItems: "center" }}>
        {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.85)" size="28mm" shape="square" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
          {personal.tagline ? <p style={{ margin: "6pt 0 0", fontSize: "9.5pt", opacity: 0.9, maxWidth: "110mm" }}>{personal.tagline}</p> : null}
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 58mm", minHeight: "220mm" }}>
        <main style={{ padding: "12mm 6mm 14mm 14mm", minWidth: 0 }}>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={options} />
          <SectionBlock data={data} section="awards" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>

        <aside style={{ background: theme.tintSoft, borderLeft: \`0.75pt solid \${theme.line}\`, padding: "12mm 8mm 14mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div>
            <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: theme.accentDark, marginBottom: "7pt" }}>Details</h2>
            <ContactBlock data={data} theme={theme} />
          </div>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle, skillColumns: 1 }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="references" theme={theme} options={{ titleVariant: "sidebar", entryLayout: "stacked" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "horizon",
    name: "Horizon",
    category: "Modern",
    accent: "#0891b2",
    accentOptions: ACCENTS.teal,
    fonts: ["dmsans", "inter", "source", "ibmplex"],
    description:
      "Wide-scan header across the top of the page, then a calm two-column body separated by a hairline rule — airy and contemporary.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "airy" },
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Icon, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts), density: "relaxed" });
  const personal = data.personal;
  const contact = contactItems(personal);
  const dividers = data.extra.sectionDividers !== false;
  const sections = visibleSections(data);
  const mainSections = sections.filter((s) => s !== "skills" && s !== "languages");
  const sideSections = sections.filter((s) => s === "skills" || s === "languages");

  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ padding: "16mm 16mm 10mm", borderBottom: \`3pt solid \${theme.accent}\` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10pt", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </div>
          <div style={{ display: "grid", gap: "3pt", fontSize: "9pt", color: theme.muted, textAlign: "right" }}>
            {contact.slice(0, 4).map((item) => (
              <span key={item.key} style={{ display: "flex", gap: "5pt", alignItems: "center", justifyContent: "flex-end" }}>
                <span style={{ color: theme.accent, display: "flex" }}><Icon name={item.icon} size={10} /></span>
                {item.value}
              </span>
            ))}
          </div>
        </div>
        {contact.length > 4 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "9pt", fontSize: "8.8pt", color: theme.faint }}>
            {contact.slice(4).map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        ) : null}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 52mm", gap: "12mm", padding: "12mm 16mm 16mm" }}>
        <div style={{ minWidth: 0 }}>
          {mainSections.map((section, index) => (
            <div key={section}>
              {dividers && index > 0 ? <div aria-hidden style={{ height: "0.75pt", background: theme.line, marginBottom: theme.sectionGap }} /> : null}
              <SectionBlock data={data} section={section} theme={theme} options={options} />
            </div>
          ))}
        </div>
        <aside style={{ display: "grid", gap: theme.sectionGap, alignContent: "start", borderLeft: \`0.75pt solid \${theme.line}\`, paddingLeft: "8mm" }}>
          {sideSections.map((section) => (
            <SectionBlock key={section} data={data} section={section} theme={theme} options={{ ...options, skillStyle: "bars" }} />
          ))}
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "caps", chipVariant: "outline" }} />
          {personal.tagline ? (
            <SheetSection title="In short" variant="caps" theme={theme}>
              <p style={{ margin: 0, fontSize: "9.5pt", color: theme.muted, fontStyle: "italic" }}>{personal.tagline}</p>
            </SheetSection>
          ) : null}
        </aside>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "meridian",
    name: "Meridian",
    category: "Modern",
    accent: "#059669",
    accentOptions: ACCENTS.green,
    fonts: ["source", "inter", "lora", "dmsans"],
    description:
      "Centred identity block, three-column contact strip and a balanced single column with numbered section markers.",
    preview: { header: "centered", sidebar: "none", accentRule: "underline", density: "normal" },
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.dividers],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { ContactList, Photo, Sheet } from "../_kit/primitives";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const dividers = data.extra.sectionDividers !== false;
  const sections = visibleSections(data);

  const options: SectionStyleOptions = { entryLayout: "row", bulletMarker: "disc", skillStyle: "chips" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ padding: "15mm 18mm 16mm" }}>
        <header style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: "7pt" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} size="30mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "10.5pt", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div aria-hidden style={{ width: "18mm", height: "2pt", background: theme.accent }} />
        </header>

        <div style={{ marginTop: "9pt", paddingTop: "8pt", borderTop: \`0.75pt solid \${theme.line}\`, borderBottom: \`0.75pt solid \${theme.line}\`, paddingBottom: "7pt" }}>
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </div>

        <div style={{ marginTop: "14pt" }}>
          {sections.map((section, index) => (
            <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "7pt", fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7pt" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14pt", height: "14pt", borderRadius: "50%", background: theme.tint, color: theme.accentDark, fontSize: "8pt" }}>
                  {index + 1}
                </span>
                {SECTION_LABELS[section]}
                {dividers ? <span aria-hidden style={{ flex: 1, height: "0.75pt", background: theme.line }} /> : null}
              </h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "spectrum",
    name: "Spectrum",
    category: "Modern",
    accent: "#7c3aed",
    accentOptions: ACCENTS.violet,
    fonts: ["montserrat", "space", "dmsans", "inter"],
    description:
      "Gradient masthead, two-column body and tinted info cards that group summary, skills and languages tight together.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "normal" },
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.skillBars],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { Icon, Sheet } from "../_kit/primitives";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const contact = contactItems(personal);
  const sections = visibleSections(data);
  const cardSections = sections.filter((s) => s === "summary" || s === "skills" || s === "languages" || s === "hobbies");
  const listSections = sections.filter((s) => !cardSections.includes(s));

  const options: SectionStyleOptions = { entryLayout: "row", bulletMarker: "disc", skillStyle: "bars" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ background: \`linear-gradient(115deg, \${theme.accent}, \${theme.accentDark})\`, color: theme.accentText, padding: "15mm 16mm" }}>
        <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
        {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "10pt", fontSize: "8.8pt" }}>
          {contact.map((item) => (
            <span key={item.key} style={{ display: "flex", alignItems: "center", gap: "4pt" }}>
              <Icon name={item.icon} size={10} />
              {item.value}
            </span>
          ))}
        </div>
      </header>

      <div style={{ padding: "12mm 16mm 16mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm" }}>
        <div style={{ minWidth: 0 }}>
          {cardSections.map((section) => (
            <section key={section} className="cv-avoid-break" style={{ background: theme.tintSoft, border: \`0.75pt solid \${theme.tintStrong}\`, borderRadius: theme.radius, padding: "8pt 9pt", marginBottom: theme.gap }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>{SECTION_LABELS[section]}</h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
        <div style={{ minWidth: 0 }}>
          {listSections.map((section) => (
            <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, paddingBottom: "3pt", borderBottom: \`2pt solid \${theme.accent}\`, marginBottom: "7pt" }}>{SECTION_LABELS[section]}</h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "cascade",
    name: "Cascade",
    category: "Modern",
    accent: "#0284c7",
    accentOptions: ACCENTS.blue,
    fonts: ["inter", "system", "dmsans", "ibmplex"],
    description:
      "Left-tinted sidebar with white-on-accent header card, cascading timeline entries and generous whitespace between sections.",
    preview: { header: "split", sidebar: "left", sidebarTinted: true, photo: true, photoShape: "circle", accentRule: "underline", density: "airy" },
    hasPhoto: true,
    extraFields: [EXTRA.photo, { key: "timeline", label: "Show timeline rail for experience", type: "toggle" }],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts), density: "relaxed" });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const timeline = data.extra.timeline !== false;

  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc", timeline };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "66mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: "#f8fafc", borderRight: \`0.75pt solid \${theme.line}\`, padding: "14mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div style={{ background: theme.accent, color: theme.accentText, borderRadius: theme.radius, padding: "10pt 9pt", display: "grid", justifyItems: "center", gap: "7pt" }}>
            {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.9)" size="30mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "11pt" }}>{fullName(personal) || "Your Name"}</div>
              {personal.jobTitle ? <div style={{ fontSize: "8.8pt", opacity: 0.9 }}>{personal.jobTitle}</div> : null}
            </div>
          </div>
          <SheetSection title="Contact" variant="sidebar" theme={theme}>
            <ContactBlock data={data} theme={theme} />
          </SheetSection>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle: "dots" }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>

        <main style={{ padding: "16mm 14mm 14mm", minWidth: 0 }}>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={{ ...options, timeline: false }} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="awards" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="references" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>
      </div>
    </Sheet>
  );
}
`,
  },
  {
    id: "prism",
    name: "Prism",
    category: "Modern",
    accent: "#6366f1",
    accentOptions: ACCENTS.violet,
    fonts: ["space", "montserrat", "inter", "georgia"],
    description:
      "Refined two-column design with a slim accent spine, right-aligned dates and a skills matrix in the sidebar.",
    preview: { header: "split", sidebar: "right", photo: false, accentRule: "block", density: "normal" },
    hasPhoto: false,
    extraFields: [EXTRA.skillDots, EXTRA.contactColumns],
    component: `import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Chip, ChipRow, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const skillStyle = String(data.extra.skillLevelStyle ?? "dots") as "dots" | "chips";

  const options: SectionStyleOptions = { titleVariant: "block", entryLayout: "row", bulletMarker: "arrow" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 60mm", minHeight: "297mm" }}>
        <main style={{ padding: "15mm 12mm 14mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <div aria-hidden style={{ width: "10mm", height: "3pt", background: theme.accent, marginBottom: "8pt" }} />
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", color: theme.muted }}>{personal.jobTitle}</p> : null}
          </header>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={options} />
          <SectionBlock data={data} section="awards" theme={theme} options={options} />
          <SectionBlock data={data} section="references" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>

        <aside style={{ background: theme.tintSoft, padding: "15mm 8mm 14mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div>
            <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: theme.accentDark, marginBottom: "7pt" }}>Get in touch</h2>
            <ContactBlock data={data} theme={theme} columns={1} />
          </div>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
          {personal.tagline ? (
            <div style={{ borderTop: \`0.75pt solid \${theme.line}\`, paddingTop: "8pt" }}>
              <ChipRow><Chip theme={theme} variant="soft">{personal.tagline}</Chip></ChipRow>
            </div>
          ) : null}
        </aside>
      </div>
    </Sheet>
  );
}
`,
  },
];
