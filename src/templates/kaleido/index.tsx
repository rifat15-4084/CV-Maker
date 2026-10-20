import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <div style={{ padding: "15mm 16mm" }}>
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
      </div>
  );
}
