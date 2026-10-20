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
      <>
        <header style={{ padding: "15mm 18mm 10mm", borderBottom: `2pt solid ${theme.accent}` }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "27pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "10mm 18mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>
  );
}
