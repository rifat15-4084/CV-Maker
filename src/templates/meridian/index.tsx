import { config } from "./config";
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
          {showPhoto ? <Photo src={personal.photo} theme={theme} size="30mm" initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "10.5pt", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div aria-hidden style={{ width: "18mm", height: "2pt", background: theme.accent }} />
        </header>

        <div style={{ marginTop: "9pt", paddingTop: "8pt", borderTop: `0.75pt solid ${theme.line}`, borderBottom: `0.75pt solid ${theme.line}`, paddingBottom: "7pt" }}>
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
