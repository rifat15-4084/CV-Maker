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
  const sections = visibleSections(data);  const options: SectionStyleOptions = { titleVariant: "rule", entryLayout: "row", bulletMarker: "disc" };

  return (
      <div style={{ padding: "16mm 18mm" }}>
        <header style={{ display: "grid", gap: "6pt", marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ height: "0.75pt", background: theme.line }} />
          <ContactList items={contactItems(personal)} theme={theme} columns={2} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
