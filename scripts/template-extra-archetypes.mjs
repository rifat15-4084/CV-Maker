/**
 * Extra template archetypes — the second wave of generated templates.
 *
 * Each entry is a genuinely different layout (header structure, column model,
 * sidebar treatment, section chrome, typography). `scripts/scaffold-templates.mjs`
 * turns every entry into a `config.ts` + `index.tsx` pair.
 *
 * Shape matches `template-archetypes.mjs`:
 *   { id, name, category, accent, accentOptions, fonts, hasPhoto,
 *     extraFields, description, preview, component }
 *
 * This file is kept separate from `template-archetypes.mjs` purely for size.
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
  cyan: ["#0891b2", "#06b6d4", "#0284c7", "#0e7490", "#155e75", "#2563eb"],
  pink: ["#db2777", "#e11d48", "#be185d", "#c026d3", "#9d174d", "#7c3aed"],
};

const EXTRA = {
  photo: { key: "showPhoto", label: "Show photo", type: "toggle" },
  photoShape: { key: "photoShape", label: "Photo shape", type: "select", options: [
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
  ] },
  skillBars: { key: "skillLevelStyle", label: "Skill level style", type: "select", options: [
    { value: "bars", label: "Bars" },
    { value: "chips", label: "Chips" },
    { value: "hidden", label: "Names only" },
  ] },
  skillDots: { key: "skillLevelStyle", label: "Skill level style", type: "select", options: [
    { value: "dots", label: "Dots" },
    { value: "bars", label: "Bars" },
    { value: "chips", label: "Chips" },
  ] },
  skillColumns: { key: "skillColumns", label: "Skill columns", type: "select", options: [
    { value: "1", label: "One column" },
    { value: "2", label: "Two columns" },
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
  timeline: { key: "timeline", label: "Timeline rail for dates", type: "toggle" },
};

/* -------------------------------------------------------------------------- */
/* Shared source fragments used inside the generated files.                    */
/* -------------------------------------------------------------------------- */

/** Constant declarations shared by most generated templates, filtered to what a body uses. */
function declsFor(body, prelude) {
  const source = body + prelude;
  const uses = (token) => new RegExp(`\\b${token}\\b`).test(source);

  const lines = [
    `  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });`,
    `  const personal = data.personal;`,
  ];
  if (uses("showPhoto")) lines.push(`  const showPhoto = data.extra.showPhoto !== false;`);
  if (uses("photoShape"))
    lines.push(`  const photoShape = (data.extra.photoShape === "square" ? "square" : "circle") as "circle" | "square";`);
  // `options`/`sideOptions` are only declared when the body does not define its own.
  if (uses("options") && !/const options:/.test(prelude))
    lines.push(`  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };`);
  if (uses("sideOptions") && !/const sideOptions:/.test(prelude))
    lines.push(`  const sideOptions: SectionStyleOptions = { titleVariant: "sidebar", entryLayout: "stacked", skillStyle: "chips" };`);
  if (uses("sections") || uses("mainKeys") || uses("sideKeys") || uses("cardKeys"))
    lines.push(`  const sections = visibleSections(data);`);
  if (uses("mainKeys") || uses("cardKeys"))
    lines.push(`  const MAIN = ["summary", "experience", "education", "projects", "certifications", "awards", "references", "custom"] as const;`);
  if (uses("sideKeys")) lines.push(`  const SIDE = ["skills", "languages", "hobbies"] as const;`);
  if (uses("mainKeys")) lines.push(`  const mainKeys = sections.filter((s) => (MAIN as readonly string[]).includes(s));`);
  if (uses("sideKeys")) lines.push(`  const sideKeys = sections.filter((s) => (SIDE as readonly string[]).includes(s));`);
  if (uses("cardKeys"))
    lines.push(`  const cardKeys: SectionKey[] = sections.filter((s) => s === "summary" || s === "skills" || s === "languages" || s === "hobbies");`);
  return lines.join("\n");
}


/** Builds the import block from only the kit symbols a given body actually uses. */
function importsFor(body, prelude) {
  const source = body + prelude + declsFor(body, prelude);
  const uses = (token) => new RegExp(`\\b${token}\\b`).test(source);

  const helpers = ["contactItems", "fullName", "visibleSections"].filter(uses);
  const sections = ["ContactBlock", "SectionBlock", "SectionContent"].filter(uses);
  const primitives = ["ContactList", "Icon", "Photo", "Sheet", "SheetSection"].filter(uses);
  const sectionImports = [...sections];
  if (uses("SectionStyleOptions")) sectionImports.push("type SectionStyleOptions");

  const lines = [
    `import { config } from "./config";`,
    `import { createTheme } from "../_kit/theme";`,
    `import { pickFont } from "../_kit/fonts";`,
    `import { ${helpers.join(", ")} } from "../_kit/helpers";`,
    `import { ${sectionImports.join(", ")} } from "../_kit/sections";`,
  ];
  if (primitives.length) lines.push(`import { ${primitives.join(", ")} } from "../_kit/primitives";`);
  if (uses("SECTION_LABELS")) lines.push(`import { SECTION_LABELS } from "@/lib/cv/defaults";`);
  if (uses("SectionKey")) lines.push(`import type { SectionKey } from "@/lib/cv/schema";`);
  lines.push(`import type { TemplateProps } from "../types";`);
  lines.push("");
  lines.push(`export { config };`);
  lines.push("");
  return lines.join("\n");
}

/**
 * Wrap a JSX body into a full component source string.
 * `prelude` is injected after the shared declarations (e.g. to override
 * `options`) and is also scanned for symbol usage.
 */
function component(body, prelude = "") {
  return `${importsFor(body, prelude)}
export function Template({ data }: TemplateProps) {
${declsFor(body, prelude)}${prelude}
  return (
${body}
  );
}
`;
}

export const EXTRA_ARCHETYPES = [
  /* ================================ MODERN ================================ */
  {
    id: "eon",
    name: "Eon",
    category: "Modern",
    accent: "#0ea5e9",
    accentOptions: ACCENTS.blue,
    fonts: ["inter", "dmsans", "source", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Airy modern CV with a slim left accent spine, generous whitespace and a calm, single-column reading flow.",
    preview: { header: "stacked", sidebar: "none", accentRule: "block", density: "airy" },
    component: component(
      `      <div style={{ display: "flex", minHeight: "297mm" }}>
        <div aria-hidden style={{ width: "6mm", background: theme.accent }} />
        <div style={{ flex: 1, padding: "18mm 16mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "32pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
            <div style={{ marginTop: "10pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          </header>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </div>`,
    ),
  },
  {
    id: "bento",
    name: "Bento",
    category: "Modern",
    accent: "#7c3aed",
    accentOptions: ACCENTS.violet,
    fonts: ["dmsans", "inter", "space", "montserrat"],
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.dividers],
    description:
      "Card-based modern CV that groups summary, skills and languages into soft tinted tiles beside the main column.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: theme.tint, padding: "13mm 15mm", borderBottom: \`3pt solid \${theme.accent}\` }}>
          <h1 style={{ margin: 0, fontSize: "29pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ padding: "11mm 15mm 15mm", display: "grid", gridTemplateColumns: "1fr 60mm", gap: "9mm" }}>
          <div style={{ minWidth: 0 }}>
            {mainKeys.filter((s) => !cardKeys.includes(s)).map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
          </div>
          <div style={{ display: "grid", gap: theme.gap, alignContent: "start" }}>
            {cardKeys.map((section) => (
              <div key={section} className="cv-avoid-break" style={{ background: theme.tintSoft, border: \`0.75pt solid \${theme.tintStrong}\`, borderRadius: theme.radius, padding: "8pt 9pt" }}>
                <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>{SECTION_LABELS[section]}</h2>
                <SectionContent data={data} section={section} theme={theme} options={sideOptions} />
              </div>
            ))}
            <div className="cv-avoid-break" style={{ background: theme.tintSoft, border: \`0.75pt solid \${theme.tintStrong}\`, borderRadius: theme.radius, padding: "8pt 9pt" }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>Contact</h2>
              <ContactBlock data={data} theme={theme} />
            </div>
          </div>
        </div>
      </>`,
    ),
  },
  {
    id: "nimbus",
    name: "Nimbus",
    category: "Modern",
    accent: "#0891b2",
    accentOptions: ACCENTS.cyan,
    fonts: ["dmsans", "source", "inter", "ibmplex"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.dividers],
    description:
      "Cloud-soft two-column modern CV with a tinted sidebar, circular photo and stacked sidebar facts.",
    preview: { header: "split", sidebar: "left", sidebarTinted: true, photo: true, photoShape: "circle", density: "normal" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "60mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.tintSoft, padding: "16mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          {showPhoto ? <div style={{ display: "flex", justifyContent: "center" }}><Photo src={personal.photo} theme={theme} size="34mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /></div> : null}
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
        <main style={{ padding: "16mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
            {personal.tagline ? <p style={{ margin: "7pt 0 0", fontSize: "9.8pt", color: theme.muted }}>{personal.tagline}</p> : null}
          </header>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>`,
    ),
  },
  {
    id: "zenith",
    name: "Zenith",
    category: "Modern",
    accent: "#4f46e5",
    accentOptions: ACCENTS.violet,
    fonts: ["space", "montserrat", "inter", "dmsans"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Gradient masthead over a clean single column with numbered section markers and a relaxed measure.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: \`linear-gradient(120deg, \${theme.accent}, \${theme.accentDark})\`, color: theme.accentText, padding: "15mm 16mm" }}>
          <h1 style={{ margin: 0, fontSize: "31pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "10pt", fontSize: "8.8pt" }}>
            {contactItems(personal).map((item) => <span key={item.key} style={{ display: "flex", alignItems: "center", gap: "4pt" }}><Icon name={item.icon} size={10} />{item.value}</span>)}
          </div>
        </header>
        <div style={{ padding: "12mm 16mm 16mm" }}>
          {sections.map((section, index) => (
            <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "7pt", fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7pt" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15pt", height: "15pt", borderRadius: "50%", background: theme.accent, color: theme.accentText, fontSize: "8pt" }}>{index + 1}</span>
                {SECTION_LABELS[section]}
                <span aria-hidden style={{ flex: 1, height: "0.75pt", background: theme.line }} />
              </h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
      </>`,
    ),
  },
  {
    id: "quartz",
    name: "Quartz",
    category: "Modern",
    accent: "#0f766e",
    accentOptions: ACCENTS.teal,
    fonts: ["ibmplex", "source", "inter", "dmsans"],
    hasPhoto: false,
    extraFields: [EXTRA.skillColumns, EXTRA.dividers],
    description:
      "Crystalline two-column CV with a solid accent header bar, boxed headings and a grouped skills matrix.",
    preview: { header: "band", sidebar: "none", accentRule: "block", density: "normal" },
    component: component(
      `      <>
        <div style={{ background: theme.accent, color: theme.accentText, padding: "12mm 15mm", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10pt", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "11pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
          </div>
          <div style={{ fontSize: "9pt", display: "grid", gap: "3pt", textAlign: "right" }}>
            {contactItems(personal).slice(0, 4).map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        </div>
        <div style={{ padding: "12mm 15mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
      `  const options: SectionStyleOptions = { titleVariant: "boxed", entryLayout: "row", bulletMarker: "square" };\n`,
    ),
  },
  {
    id: "pulse",
    name: "Pulse",
    category: "Modern",
    accent: "#db2777",
    accentOptions: ACCENTS.pink,
    fonts: ["montserrat", "space", "dmsans", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.timeline, EXTRA.dividers],
    description:
      "Vibrant modern CV with a thick accent rule, timeline rails for experience and chip-style skills.",
    preview: { header: "stacked", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <div aria-hidden style={{ width: "30mm", height: "4pt", background: theme.accent, marginBottom: "9pt" }} />
          <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "check", timeline: data.extra.timeline !== false };\n`,
    ),
  },
  {
    id: "mercury",
    name: "Mercury",
    category: "Modern",
    accent: "#1d4ed8",
    accentOptions: ACCENTS.blue,
    fonts: ["inter", "source", "ibmplex", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Fluent single-column modern CV with an inline accent bar beside each heading and mirrored contact columns.",
    preview: { header: "stacked", sidebar: "none", accentRule: "block", density: "normal" },
    component: component(
      `      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ display: "grid", gap: "6pt", marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ height: "0.75pt", background: theme.line }} />
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "rule", entryLayout: "row", bulletMarker: "disc" };\n`,
    ),
  },
  {
    id: "onyx",
    name: "Onyx",
    category: "Modern",
    accent: "#0f172a",
    accentOptions: ACCENTS.slate,
    fonts: ["space", "inter", "montserrat", "ibmplex"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.photoShape, EXTRA.skillBars],
    description:
      "Bold dark-header modern CV with a large photo, white-on-dark identity block and a crisp single-column body.",
    preview: { header: "banner", sidebar: "none", photo: true, photoShape: "square", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: "#0f172a", color: "#f8fafc", padding: "14mm 16mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent={theme.accent} size="30mm" shape={photoShape} initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, color: theme.accent }}>{personal.jobTitle}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "9pt", fontSize: "8.8pt", opacity: 0.9 }}>
              {contactItems(personal).map((item) => <span key={item.key}>{item.value}</span>)}
            </div>
          </div>
        </header>
        <div style={{ padding: "12mm 16mm 16mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },

  /* =============================== CREATIVE =============================== */
  {
    id: "marquee",
    name: "Marquee",
    category: "Creative",
    accent: "#e11d48",
    accentOptions: ACCENTS.rose,
    fonts: ["montserrat", "space", "playfair", "dmsans"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.photoShape],
    description:
      "Bold creative CV with an oversized name treatment, a full-bleed accent band and a framed portrait.",
    preview: { header: "band", sidebar: "none", photo: true, photoShape: "square", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <div style={{ background: theme.accent, color: theme.accentText, padding: "16mm 15mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.92)" size="34mm" shape={photoShape} initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <div>
            <h1 style={{ margin: 0, fontSize: "40pt", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.98 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "6pt 0 0", fontSize: "12pt", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
          </div>
        </div>
        <div style={{ padding: "12mm 15mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },
  {
    id: "vivid",
    name: "Vivid",
    category: "Creative",
    accent: "#c026d3",
    accentOptions: ACCENTS.pink,
    fonts: ["space", "montserrat", "dmsans", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.dividers],
    description:
      "Energetic creative CV with colour-blocked headings, a two-column body and playful chip clusters.",
    preview: { header: "split", sidebar: "none", accentRule: "block", density: "normal" },
    component: component(
      `      <>
        <header style={{ padding: "15mm 16mm 5mm" }}>
          <h1 style={{ margin: 0, fontSize: "33pt", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "12pt", color: theme.accentDark, fontWeight: 700 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "4mm 16mm 15mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9mm" }}>
          <div style={{ minWidth: 0 }}>{mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
          <div style={{ minWidth: 0 }}>{sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}</div>
        </div>
      </>`,
      `  const options: SectionStyleOptions = { titleVariant: "block", entryLayout: "stacked", bulletMarker: "arrow" };\n`,
    ),
  },
  {
    id: "fresco",
    name: "Fresco",
    category: "Creative",
    accent: "#ea580c",
    accentOptions: ACCENTS.amber,
    fonts: ["playfair", "space", "montserrat", "lora"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.dividers],
    description:
      "Painterly creative CV with a serif display masthead, tinted side panel and softly rounded section blocks.",
    preview: { header: "split", sidebar: "right", sidebarTinted: true, photo: true, photoShape: "circle", density: "airy" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "1fr 62mm", minHeight: "297mm" }}>
        <main style={{ padding: "16mm 8mm 16mm 16mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "32pt", fontWeight: 700, lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600, letterSpacing: "0.05em" }}>{personal.jobTitle}</p> : null}
          </header>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
        <aside style={{ background: theme.tintSoft, borderLeft: \`0.75pt solid \${theme.line}\`, padding: "16mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          {showPhoto ? <div style={{ display: "flex", justifyContent: "center" }}><Photo src={personal.photo} theme={theme} size="32mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /></div> : null}
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
      </div>`,
    ),
  },
  {
    id: "origami",
    name: "Origami",
    category: "Creative",
    accent: "#7c3aed",
    accentOptions: ACCENTS.violet,
    fonts: ["montserrat", "space", "playfair", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Angular creative CV with a solid accent aside, geometric heading markers and a strong left colour edge.",
    preview: { header: "rail", sidebar: "left", accentRule: "block", density: "normal" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "54mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.accent, color: theme.accentText, padding: "16mm 8mm", display: "grid", gap: "13pt", alignContent: "start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20pt", fontWeight: 800, lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "9.5pt", opacity: 0.92 }}>{personal.jobTitle}</p> : null}
          </div>
          <SheetSection title="Contact" variant="sidebar" theme={theme} accent="#ffffff" accentText="#ffffff"><ContactBlock data={data} theme={theme} accent="#ffffff" /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} accent="#ffffff" options={sideOptions} />)}
        </aside>
        <main style={{ padding: "16mm 15mm", minWidth: 0 }}>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>`,
    ),
  },
  {
    id: "kaleido",
    name: "Kaleido",
    category: "Creative",
    accent: "#0891b2",
    accentOptions: ACCENTS.cyan,
    fonts: ["space", "montserrat", "dmsans", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.skillDots, EXTRA.twoCol],
    description:
      "Colour-forward creative CV with alternating tinted section panels and dot-scale skills for a portfolio feel.",
    preview: { header: "centered", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: "6pt", marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "32pt", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ height: "0.75pt", width: "100%", background: theme.line, marginTop: "4pt" }} />
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </header>
        {sections.map((section, index) => (
          <div key={section} className="cv-avoid-break" style={{ background: index % 2 === 0 ? theme.tintSoft : "transparent", borderRadius: theme.radius, padding: "7pt 9pt", marginBottom: theme.gap }}>
            <SectionBlock data={data} section={section} theme={theme} options={options} style={{ marginBottom: 0 }} />
          </div>
        ))}
      </div>`,
    ),
  },
  {
    id: "mosaic",
    name: "Mosaic",
    category: "Creative",
    accent: "#0d9488",
    accentOptions: ACCENTS.teal,
    fonts: ["dmsans", "space", "source", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.dividers],
    description:
      "Grid-led creative CV that tiles skills and languages beside a strong narrative column with crisp accents.",
    preview: { header: "split", sidebar: "right", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ marginBottom: theme.sectionGap, display: "grid", gap: "5pt" }}>
          <h1 style={{ margin: 0, fontSize: "31pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 58mm", gap: "9mm", borderTop: \`2pt solid \${theme.accent}\`, paddingTop: "10pt" }}>
          <div style={{ minWidth: 0 }}>{mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
          <div style={{ minWidth: 0 }}>
            <SheetSection title="Contact" variant="caps" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
            {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
          </div>
        </div>
      </div>`,
    ),
  },
  {
    id: "sonnet",
    name: "Sonnet",
    category: "Creative",
    accent: "#9d174d",
    accentOptions: ACCENTS.rose,
    fonts: ["playfair", "lora", "libre", "garamond"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Editorial-creative CV with a large serif name, italic subtitle and generous classical spacing.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "airy" },
    component: component(
      `      <div style={{ padding: "18mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap, borderBottom: \`0.75pt solid \${theme.line}\`, paddingBottom: "10pt" }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "34pt", fontWeight: 700, lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "6pt 0 0", fontSize: "11pt", fontStyle: "italic", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "plain", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },

  /* ================================ MINIMAL =============================== */
  {
    id: "nordic",
    name: "Nordic",
    category: "Minimal",
    accent: "#475569",
    accentOptions: ACCENTS.slate,
    fonts: ["inter", "ibmplex", "source", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers],
    description:
      "Scandinavian minimal CV: vast whitespace, a single hairline rule and near-weightless typography.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "airy" },
    component: component(
      `      <div style={{ padding: "22mm 20mm" }}>
        <header style={{ marginBottom: "14pt" }}>
          <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.muted }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
          <div aria-hidden style={{ height: "0.75pt", background: theme.line, marginTop: "10pt" }} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "paper",
    name: "Paper",
    category: "Minimal",
    accent: "#334155",
    accentOptions: ACCENTS.slate,
    fonts: ["source", "inter", "lora", "garamond"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers],
    description:
      "Quiet paper-white minimal CV with a label-and-content grid and no colour beyond a single thin rule.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "18mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 700, letterSpacing: "-0.025em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "34mm 1fr", gap: "8mm", borderTop: \`0.75pt solid \${theme.line}\`, paddingTop: "10pt" }}>
          <div style={{ display: "grid", gap: "10pt", alignContent: "start", fontSize: "9pt" }}>
            <div>
              <div style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.faint, marginBottom: "5pt" }}>Contact</div>
              <ContactList items={contactItems(personal)} theme={theme} icon={false} />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
        </div>
      </div>`,
    ),
  },
  {
    id: "linen",
    name: "Linen",
    category: "Minimal",
    accent: "#78350f",
    accentOptions: ACCENTS.amber,
    fonts: ["lora", "garamond", "source", "libre"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Warm minimal CV with a subtle tinted band, serif body and restrained letter-spaced headings.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <>
        <div style={{ background: theme.tintSoft, padding: "16mm 18mm 8mm", borderBottom: \`0.75pt solid \${theme.line}\` }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "29pt", fontWeight: 600, lineHeight: 1.05 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "10.5pt", color: theme.accentDark, letterSpacing: "0.14em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </div>
        <div style={{ padding: "10mm 18mm 18mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>`,
    ),
  },
  {
    id: "mono-min",
    name: "Mono",
    category: "Minimal",
    accent: "#111827",
    accentOptions: ACCENTS.slate,
    fonts: ["ibmmono", "ibmplex", "inter", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Typewriter-minimal CV built on a monospace grid with tight, technical spacing and no ornament.",
    preview: { header: "stacked", sidebar: "none", accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ padding: "16mm 18mm", fontFamily: theme.font }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "24pt", fontWeight: 700, letterSpacing: "-0.02em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "clarity",
    name: "Clarity",
    category: "Minimal",
    accent: "#0ea5e9",
    accentOptions: ACCENTS.blue,
    fonts: ["dmsans", "inter", "source", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.skillBars],
    description:
      "Clear minimal CV with a soft tinted contact strip, one accent colour and light, tidy section rules.",
    preview: { header: "band", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: theme.tint, padding: "14mm 17mm" }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, letterSpacing: "-0.025em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.8pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "12mm 17mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>`,
    ),
  },
  {
    id: "axis",
    name: "Axis",
    category: "Minimal",
    accent: "#0f172a",
    accentOptions: ACCENTS.slate,
    fonts: ["inter", "ibmplex", "dmsans", "system"],
    hasPhoto: false,
    extraFields: [EXTRA.timeline, EXTRA.dividers],
    description:
      "Grid-aligned minimal CV with a strict left axis, timeline dots and a consistent vertical rhythm.",
    preview: { header: "stacked", sidebar: "none", accentRule: "block", density: "normal" },
    component: component(
      `      <div style={{ padding: "17mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap, paddingBottom: "9pt", borderBottom: \`2pt solid \${theme.accent}\` }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "rule", entryLayout: "row", bulletMarker: "dash", timeline: data.extra.timeline !== false };\n`,
    ),
  },

  /* ============================= PROFESSIONAL ============================= */
  {
    id: "sterling",
    name: "Sterling",
    category: "Professional",
    accent: "#1e3a8a",
    accentOptions: ACCENTS.navy,
    fonts: ["source", "inter", "ibmplex", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.contactColumns],
    description:
      "Corporate professional CV with a bordered masthead, rule-separated sections and a formal tone throughout.",
    preview: { header: "banner", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ border: \`1pt solid \${theme.line}\`, borderTop: \`4pt solid \${theme.accent}\`, padding: "9pt 11pt", marginBottom: theme.sectionGap, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10pt", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24pt", fontWeight: 800, letterSpacing: "-0.02em" }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "2pt 0 0", fontSize: "10.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </div>
          <ContactList items={contactItems(personal)} theme={theme} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "beacon",
    name: "Beacon",
    category: "Professional",
    accent: "#0f766e",
    accentOptions: ACCENTS.teal,
    fonts: ["ibmplex", "source", "inter", "dmsans"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.skillBars],
    description:
      "Confident professional CV with a header beacon rule, a summary band and clearly ruled experience entries.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ padding: "15mm 16mm 11mm", borderBottom: \`3pt solid \${theme.accent}\` }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600, letterSpacing: "0.03em" }}>{personal.jobTitle}</p> : null}
          {personal.tagline ? <p style={{ margin: "7pt 0 0", fontSize: "9.8pt", color: theme.muted, maxWidth: "150mm" }}>{personal.tagline}</p> : null}
        </header>
        <div style={{ padding: "11mm 16mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>`,
    ),
  },
  {
    id: "compass",
    name: "Compass",
    category: "Professional",
    accent: "#334155",
    accentOptions: ACCENTS.slate,
    fonts: ["source", "inter", "dmsans", "system"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.contactColumns],
    description:
      "Balanced professional CV with a round photo, two-column contact header and measured section spacing.",
    preview: { header: "split", sidebar: "none", photo: true, photoShape: "circle", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ display: "flex", gap: "9mm", alignItems: "center", marginBottom: theme.sectionGap }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} size="30mm" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
            <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          </div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "ledger",
    name: "Ledger",
    category: "Professional",
    accent: "#1d4ed8",
    accentOptions: ACCENTS.blue,
    fonts: ["ibmplex", "source", "inter", "ibmmono"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Structured professional CV with a table-like header block and aligned, uniformly spaced experience rows.",
    preview: { header: "rail", sidebar: "none", accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ marginBottom: theme.sectionGap, borderBottom: \`2pt solid \${theme.accent}\`, paddingBottom: "8pt" }}>
          <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "summit",
    name: "Summit",
    category: "Professional",
    accent: "#166534",
    accentOptions: ACCENTS.green,
    fonts: ["montserrat", "source", "inter", "dmsans"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.skillColumns],
    description:
      "Achievement-focused professional CV with a strong top band and a two-column skills grid.",
    preview: { header: "band", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <div style={{ background: theme.accent, color: theme.accentText, padding: "11mm 16mm" }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "11pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
        </div>
        <div style={{ padding: "11mm 16mm 16mm" }}>
          <div style={{ marginBottom: theme.sectionGap }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },
  {
    id: "anchor",
    name: "Anchor",
    category: "Professional",
    accent: "#0f172a",
    accentOptions: ACCENTS.slate,
    fonts: ["source", "ibmplex", "inter", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.contactColumns],
    description:
      "Solid professional CV with a heavy anchor rule under the name and dependable, restrained structure.",
    preview: { header: "stacked", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <div style={{ padding: "16mm 17mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          <div aria-hidden style={{ height: "3pt", background: theme.accent, width: "40mm", margin: "8pt 0" }} />
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.muted, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "harbor",
    name: "Harbor",
    category: "Professional",
    accent: "#172554",
    accentOptions: ACCENTS.navy,
    fonts: ["source", "inter", "dmsans", "ibmplex"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Steady professional CV with a tinted header block, ruled body sections and a calm navy palette.",
    preview: { header: "band", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: theme.tintSoft, padding: "14mm 16mm", borderBottom: \`0.75pt solid \${theme.line}\` }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "11mm 16mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>`,
    ),
  },
  {
    id: "cornerstone",
    name: "Cornerstone",
    category: "Professional",
    accent: "#78350f",
    accentOptions: ACCENTS.amber,
    fonts: ["libre", "source", "lora", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Traditional professional CV with a serif masthead, centred contact line and firmly ruled sections.",
    preview: { header: "centered", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ textAlign: "center", marginBottom: theme.sectionGap, display: "grid", justifyItems: "center", gap: "5pt" }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "28pt", fontWeight: 700, letterSpacing: "0.01em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "10.5pt", letterSpacing: "0.16em", textTransform: "uppercase", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ height: "0.75pt", width: "100%", background: theme.line, margin: "3pt 0" }} />
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },

  /* ================================= EXECUTIVE ============================ */
  {
    id: "regency",
    name: "Regency",
    category: "Executive",
    accent: "#1e3a8a",
    accentOptions: ACCENTS.navy,
    fonts: ["playfair", "libre", "lora", "source"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Regal executive CV with a serif display name, centred masthead and a commanding single-column body.",
    preview: { header: "banner", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ padding: "18mm 18mm 12mm", textAlign: "center", borderBottom: \`1pt solid \${theme.accent}\` }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "34pt", fontWeight: 700, letterSpacing: "0.01em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "6pt 0 0", fontSize: "11pt", letterSpacing: "0.22em", textTransform: "uppercase", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ padding: "10mm 18mm 16mm" }}>
          <div style={{ marginBottom: theme.sectionGap, display: "flex", justifyContent: "center" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },
  {
    id: "vanguard",
    name: "Vanguard",
    category: "Executive",
    accent: "#0f172a",
    accentOptions: ACCENTS.slate,
    fonts: ["montserrat", "playfair", "source", "inter"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.dividers],
    description:
      "Commanding executive CV with a dark masthead, portrait and restrained monochrome authority.",
    preview: { header: "banner", sidebar: "none", photo: true, photoShape: "square", accentRule: "full", density: "normal" },
    component: component(
      `      <>
        <header style={{ background: "#0f172a", color: "#f8fafc", padding: "15mm 17mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent={theme.accent} size="32mm" shape="square" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: "32pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accent }}>{personal.jobTitle}</p> : null}
          </div>
        </header>
        <div style={{ padding: "11mm 17mm 16mm" }}>
          <div style={{ marginBottom: theme.sectionGap }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },
  {
    id: "chancellor",
    name: "Chancellor",
    category: "Executive",
    accent: "#7f1d1d",
    accentOptions: ACCENTS.rose,
    fonts: ["playfair", "libre", "garamond", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Classical executive CV with a deep burgundy accent, centred masthead and a distinguished single column.",
    preview: { header: "stacked", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <div style={{ padding: "18mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "30pt", fontWeight: 700, letterSpacing: "0.02em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "10.5pt", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt", display: "flex", justifyContent: "center" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "double", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "meridian-exec",
    name: "Meridian Exec",
    category: "Executive",
    accent: "#0f766e",
    accentOptions: ACCENTS.teal,
    fonts: ["source", "playfair", "inter", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.timeline],
    description:
      "Executive CV with a tinted left identity aside, accent spine and timeline-led career history.",
    preview: { header: "split", sidebar: "left", sidebarTinted: true, accentRule: "block", density: "normal" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "58mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.tintSoft, padding: "16mm 9mm", display: "grid", gap: "14pt", alignContent: "start", borderRight: \`2pt solid \${theme.accent}\` }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "19pt", fontWeight: 800, lineHeight: 1.08 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "9.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </div>
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
        <main style={{ padding: "16mm 15mm", minWidth: 0 }}>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc", timeline: data.extra.timeline !== false };\n`,
    ),
  },

  /* ================================== TECH =============================== */
  {
    id: "runtime",
    name: "Runtime",
    category: "Tech",
    accent: "#2563eb",
    accentOptions: ACCENTS.blue,
    fonts: ["ibmmono", "ibmplex", "inter", "space"],
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.skillColumns],
    description:
      "Systems-style tech CV with monospace meta and a tinted sidebar holding stack, skills and links.",
    preview: { header: "rail", sidebar: "right", sidebarTinted: true, accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "1fr 56mm", minHeight: "297mm" }}>
        <main style={{ padding: "15mm 12mm 15mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap, borderBottom: \`2pt solid \${theme.accent}\`, paddingBottom: "8pt" }}>
            <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </header>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
        <aside style={{ background: theme.tintSoft, borderLeft: \`0.75pt solid \${theme.line}\`, padding: "15mm 8mm", display: "grid", gap: "13pt", alignContent: "start" }}>
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "arrow" };\n`,
    ),
  },
  {
    id: "byte",
    name: "Byte",
    category: "Tech",
    accent: "#22c55e",
    accentOptions: ACCENTS.green,
    fonts: ["ibmmono", "space", "ibmplex", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.twoCol, EXTRA.dividers],
    description:
      "Terminal-flavoured tech CV with a prompt line, crisp monospace dates and a compact single column.",
    preview: { header: "stacked", sidebar: "none", accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ padding: "15mm 16mm", fontFamily: theme.font }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <div style={{ fontSize: "9pt", color: theme.faint }}>~/cv $ whoami</div>
          <h1 style={{ margin: "4pt 0 0", fontSize: "25pt", fontWeight: 700, letterSpacing: "-0.02em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "arrow", labels: { experience: "experience.log", education: "education.log", projects: "projects.log" } };\n`,
    ),
  },
  {
    id: "kernel",
    name: "Kernel",
    category: "Tech",
    accent: "#7c3aed",
    accentOptions: ACCENTS.violet,
    fonts: ["ibmplex", "space", "ibmmono", "inter"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.skillBars],
    description:
      "Developer CV with a dark identity rail, square photo and a focused main column for stack and projects.",
    preview: { header: "rail", sidebar: "left", photo: true, photoShape: "square", accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ display: "grid", gridTemplateColumns: "52mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: "#0f172a", color: "#e2e8f0", padding: "15mm 8mm", display: "grid", gap: "12pt", alignContent: "start" }}>
          {showPhoto ? <div style={{ display: "flex", justifyContent: "center" }}><Photo src={personal.photo} theme={theme} accent={theme.accent} size="30mm" shape="square" initialsText={\`\${personal.firstName}\${personal.lastName}\`} /></div> : null}
          <div>
            <div style={{ fontWeight: 800, fontSize: "15pt", lineHeight: 1.1 }}>{fullName(personal) || "Your Name"}</div>
            {personal.jobTitle ? <div style={{ fontSize: "9pt", color: theme.accent, marginTop: "3pt" }}>{personal.jobTitle}</div> : null}
          </div>
          <div>
            <h2 style={{ fontSize: "8.5pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accent, marginBottom: "6pt" }}>Contact</h2>
            <ContactBlock data={data} theme={theme} accent="#e2e8f0" />
          </div>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} accent="#e2e8f0" options={{ ...sideOptions, titleVariant: "sidebar" }} />)}
        </aside>
        <main style={{ padding: "15mm 14mm", minWidth: 0 }}>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>`,
    ),
  },
  {
    id: "circuit",
    name: "Circuit",
    category: "Tech",
    accent: "#06b6d4",
    accentOptions: ACCENTS.cyan,
    fonts: ["space", "dmsans", "ibmplex", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Modern tech CV with a node marker at the name, crisp rules and a clean single-column body.",
    preview: { header: "stacked", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ marginBottom: theme.sectionGap, display: "flex", alignItems: "center", gap: "8pt", flexWrap: "wrap" }}>
          <span aria-hidden style={{ width: "10pt", height: "10pt", borderRadius: "50%", background: theme.accent }} />
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ flexBasis: "100%", marginTop: "4pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "stack",
    name: "Stack",
    category: "Tech",
    accent: "#0ea5e9",
    accentOptions: ACCENTS.blue,
    fonts: ["ibmplex", "source", "inter", "ibmmono"],
    hasPhoto: false,
    extraFields: [EXTRA.skillColumns, EXTRA.twoCol],
    description:
      "Layered tech CV with a stacked header band, grouped skill matrix and tight, engineering-style spacing.",
    preview: { header: "band", sidebar: "none", accentRule: "block", density: "dense" },
    component: component(
      `      <>
        <div style={{ padding: "12mm 16mm" }}>
          <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </div>
        <div style={{ borderTop: \`2pt solid \${theme.accent}\`, padding: "10mm 16mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>`,
    ),
  },
  {
    id: "dotmatrix",
    name: "Dotmatrix",
    category: "Tech",
    accent: "#a855f7",
    accentOptions: ACCENTS.violet,
    fonts: ["ibmmono", "space", "ibmplex", "inter"],
    hasPhoto: false,
    extraFields: [EXTRA.skillDots, EXTRA.twoCol],
    description:
      "Playful tech CV with dotted markers, monospace headings and a compact technical density.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "15mm 16mm", fontFamily: theme.font }}>
        <header style={{ marginBottom: theme.sectionGap, display: "grid", gap: "4pt" }}>
          <h1 style={{ margin: 0, fontSize: "24pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "10pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "6pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },

  /* =============================== ACADEMIC ============================= */
  {
    id: "thesis",
    name: "Thesis",
    category: "Academic",
    accent: "#1e3a8a",
    accentOptions: ACCENTS.navy,
    fonts: ["garamond", "lora", "libre", "source"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Academic CV styled like a paper: centred serif masthead, publication-style entries and a dense column.",
    preview: { header: "centered", sidebar: "none", accentRule: "underline", density: "dense" },
    component: component(
      `      <div style={{ padding: "16mm 19mm" }}>
        <header style={{ textAlign: "center", marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "25pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10pt", fontStyle: "italic", color: theme.muted }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "7pt", display: "flex", justifyContent: "center" }}><ContactList items={contactItems(personal)} theme={theme} icon={false} /></div>
          <div style={{ height: "0.75pt", background: theme.line, marginTop: "9pt" }} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "archivist",
    name: "Archivist",
    category: "Academic",
    accent: "#3f6212",
    accentOptions: ACCENTS.green,
    fonts: ["libre", "garamond", "source", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Archival academic CV with restrained colour, reference-friendly entry spacing and a formal masthead.",
    preview: { header: "rail", sidebar: "left", accentRule: "block", density: "dense" },
    component: component(
      `      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "26pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "rule", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "codex",
    name: "Codex",
    category: "Academic",
    accent: "#4c1d95",
    accentOptions: ACCENTS.violet,
    fonts: ["lora", "garamond", "libre", "merriweather"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Scholarly CV with a bold serif name, doubling section rules and a formal, classical rhythm.",
    preview: { header: "stacked", sidebar: "none", accentRule: "full", density: "normal" },
    component: component(
      `      <div style={{ padding: "17mm 19mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "29pt", fontWeight: 700, letterSpacing: "0.01em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
      `  const options: SectionStyleOptions = { titleVariant: "double", entryLayout: "row", bulletMarker: "dash" };\n`,
    ),
  },
  {
    id: "lexicon",
    name: "Lexicon",
    category: "Academic",
    accent: "#0f172a",
    accentOptions: ACCENTS.slate,
    fonts: ["merriweather", "source", "garamond", "libre"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Dictionary-clean academic CV with a small-caps name, tight leading and clearly labelled sections.",
    preview: { header: "stacked", sidebar: "none", accentRule: "underline", density: "dense" },
    component: component(
      `      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap, borderBottom: \`0.75pt solid \${theme.line}\`, paddingBottom: "8pt" }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "24pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10pt", color: theme.muted }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "7pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "athenaeum",
    name: "Athenaeum",
    category: "Academic",
    accent: "#7f1d1d",
    accentOptions: ACCENTS.rose,
    fonts: ["garamond", "libre", "lora", "source"],
    hasPhoto: true,
    extraFields: [EXTRA.photo, EXTRA.dividers],
    description:
      "Refined academic CV with a framed photo, deep accent rules and a restrained research-focused layout.",
    preview: { header: "split", sidebar: "none", photo: true, photoShape: "square", accentRule: "underline", density: "normal" },
    component: component(
      `      <div style={{ padding: "16mm 19mm" }}>
        <header style={{ display: "flex", gap: "9mm", alignItems: "center", marginBottom: theme.sectionGap }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} size="30mm" shape={photoShape} initialsText={\`\${personal.firstName}\${personal.lastName}\`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "27pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
            <div style={{ marginTop: "7pt" }}><ContactList items={contactItems(personal)} theme={theme} /></div>
          </div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>`,
    ),
  },
  {
    id: "lectern",
    name: "Lectern",
    category: "Academic",
    accent: "#0f766e",
    accentOptions: ACCENTS.teal,
    fonts: ["source", "garamond", "inter", "lora"],
    hasPhoto: false,
    extraFields: [EXTRA.dividers, EXTRA.twoCol],
    description:
      "Teaching-focused academic CV with a calm header rule, ordered sections and a two-column contact strip.",
    preview: { header: "band", sidebar: "none", accentRule: "underline", density: "normal" },
    component: component(
      `      <>
        <header style={{ padding: "15mm 18mm 10mm", borderBottom: \`2pt solid \${theme.accent}\` }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "27pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "10mm 18mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>`,
    ),
  },
];

