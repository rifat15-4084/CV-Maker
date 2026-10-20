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
        <div style={{ background: theme.tintSoft, padding: "16mm 18mm 8mm", borderBottom: `0.75pt solid ${theme.line}` }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "29pt", fontWeight: 600, lineHeight: 1.05 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "10.5pt", color: theme.accentDark, letterSpacing: "0.14em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </div>
        <div style={{ padding: "10mm 18mm 18mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>
  );
}
