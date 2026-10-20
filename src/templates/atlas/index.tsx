import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList, Divider, Sheet } from "../_kit/primitives";
import { contactItems, visibleSections } from "../_kit/helpers";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showDividers = data.extra.sectionDividers !== false;
  const contact = contactItems(personal);

  const options: SectionStyleOptions = {
    titleVariant: "underline",
    entryLayout: "row",
    bulletMarker: "disc",
    skillStyle: "columns",
    separator: true,
    labels: { summary: "Professional Summary" },
  };

  const sections = visibleSections(data);

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ padding: "14mm 16mm 16mm" }}>
        {/* -------------------------------- header --------------------------- */}
        <header
          style={{
            border: `1.25pt solid ${theme.line}`,
            borderTop: `4pt solid ${theme.accent}`,
            borderRadius: "2pt",
            padding: "10mm 10mm 8mm",
            marginBottom: "12pt",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8pt", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                {fullName(personal) || "Your Name"}
              </h1>
              {personal.jobTitle ? (
                <p
                  style={{
                    margin: "5pt 0 0",
                    fontSize: "11pt",
                    fontWeight: 600,
                    color: theme.accentDark,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {personal.jobTitle}
                </p>
              ) : null}
            </div>
            {personal.tagline ? (
              <p style={{ margin: 0, fontSize: "9.5pt", color: theme.faint, maxWidth: "70mm", textAlign: "right" }}>
                {personal.tagline}
              </p>
            ) : null}
          </div>
          <div style={{ marginTop: "9pt", paddingTop: "8pt", borderTop: `0.75pt solid ${theme.line}` }}>
            <ContactList
              items={contact}
              theme={theme}
              columns={data.extra.contactColumns === "3" ? 2 : 2}            />
          </div>
        </header>

        {/* ------------------------------- sections -------------------------- */}
        {sections.map((section, index) => (
          <div key={section}>
            {showDividers && index > 0 && section !== "custom" ? <Divider theme={theme} /> : null}
            <SectionBlock data={data} section={section} theme={theme} options={options} />
          </div>
        ))}
      </div>
    </Sheet>
  );
}
