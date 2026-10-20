import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { Icon } from "../_kit/primitives";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <>
        <header style={{ background: `linear-gradient(120deg, ${theme.accent}, ${theme.accentDark})`, color: theme.accentText, padding: "15mm 16mm" }}>
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
      </>
  );
}
