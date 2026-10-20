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
      <div style={{ display: "flex", minHeight: "297mm" }}>
        <div aria-hidden style={{ width: "6mm", background: theme.accent }} />
        <div style={{ flex: 1, padding: "18mm 16mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "32pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
            <div style={{ marginTop: "10pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          </header>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </div>
  );
}
