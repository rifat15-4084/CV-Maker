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
      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ textAlign: "center", marginBottom: theme.sectionGap, display: "grid", justifyItems: "center", gap: "5pt" }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "28pt", fontWeight: 700, letterSpacing: "0.01em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "10.5pt", letterSpacing: "0.16em", textTransform: "uppercase", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ height: "0.75pt", width: "100%", background: theme.line, margin: "3pt 0" }} />
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
