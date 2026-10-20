import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const MAIN_SECTIONS = [
  "experience",
  "education",
  "projects",
  "certifications",
  "awards",
  "references",
  "custom",
] as const;

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { density: "dense", font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const codeSummary = data.extra.codeSummary !== false;
  const chevron = data.extra.promptChevron !== false;

  const options: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "stacked",
    bulletMarker: "arrow",
    labels: { experience: "Experience", education: "Education", projects: "Selected Projects" },
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      {/* -------------------------------- header ----------------------------- */}
      <header
        style={{
          padding: "14mm 14mm 10mm",
          borderBottom: `2.5pt solid ${theme.accent}`,
          background: theme.tintSoft,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "8pt" }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: "9pt", color: theme.accentDark, marginBottom: "4pt" }}>
              {chevron ? "> " : ""}
              {personal.jobTitle || "engineer"}
            </div>
            <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {fullName(personal) || "Your Name"}
            </h1>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: "8.5pt",
              color: theme.muted,
              textAlign: "right",
              display: "grid",
              gap: "2pt",
            }}
          >
            {personal.email ? <span>{personal.email}</span> : null}
            {personal.phone ? <span>{personal.phone}</span> : null}
            {personal.address ? <span>{personal.address}</span> : null}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "9pt", fontFamily: MONO, fontSize: "8.5pt", color: theme.muted }}>
          {personal.website ? <span>{personal.website}</span> : null}
          {personal.linkedin ? <span>{personal.linkedin}</span> : null}
          {personal.github ? <span>{personal.github}</span> : null}
          {data.personal.extraLinks.map((link) => (
            <span key={link.id}>{link.url}</span>
          ))}
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 56mm", minHeight: "240mm" }}>
        {/* -------------------------------- main ------------------------------ */}
        <main style={{ padding: "12mm 8mm 14mm 14mm", minWidth: 0 }}>
          {data.summary ? (
            <section style={{ marginBottom: theme.sectionGap }}>
              <h2
                style={{
                  fontSize: "10pt",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: "6pt",
                  fontFamily: MONO,
                  color: theme.accentDark,
                }}
              >
                {chevron ? "> " : ""}about
              </h2>
              {codeSummary ? (
                <div
                  style={{
                    background: "#f1f5f9",
                    borderLeft: `3pt solid ${theme.accent}`,
                    padding: "7pt 9pt",
                    fontFamily: MONO,
                    fontSize: "9pt",
                    lineHeight: 1.6,
                    color: theme.ink,
                    whiteSpace: "pre-wrap",
                    borderRadius: "0 4pt 4pt 0",
                  }}
                >
                  {data.summary}
                </div>
              ) : (
                <p style={{ margin: 0, color: theme.muted, fontSize: "10pt" }}>{data.summary}</p>
              )}
            </section>
          ) : null}

          {MAIN_SECTIONS.map((section) => (
            <SectionBlock
              key={section}
              data={data}
              section={section}
              theme={theme}
              options={{
                ...options,
                labels: {
                  ...options.labels,
                  education: "Education",
                  projects: "Selected Projects",
                  certifications: "Certifications",
                },
              }}
            />
          ))}
        </main>

        {/* -------------------------------- rail ------------------------------ */}
        <aside
          style={{
            background: theme.tintSoft,
            borderLeft: `0.75pt solid ${theme.line}`,
            padding: "12mm 8mm 14mm",
            display: "grid",
            gap: "15pt",
            alignContent: "start",
          }}
        >
          <div>
            <h2 style={{ fontSize: "9pt", fontFamily: MONO, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accentDark, marginBottom: "7pt" }}>
              {chevron ? "> " : ""}contact
            </h2>
            <ContactBlock data={data} theme={theme} icon={false} />
          </div>

          <SectionBlock
            data={data}
            section="skills"
            theme={theme}
            options={{ titleVariant: "sidebar", skillStyle: "dots" }}
          />
          <SectionBlock
            data={data}
            section="languages"
            theme={theme}
            options={{ titleVariant: "sidebar" }}
          />
          <SectionBlock
            data={data}
            section="hobbies"
            theme={theme}
            options={{ titleVariant: "sidebar", chipVariant: "outline" }}
          />

          <div style={{ fontFamily: MONO, fontSize: "8pt", color: theme.faint, borderTop: `0.75pt solid ${theme.line}`, paddingTop: "7pt" }}>
            {contactItems(personal).length > 0 ? "references available on request" : null}
          </div>
        </aside>
      </div>
    </Sheet>
  );
}
