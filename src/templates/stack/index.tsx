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
        <div style={{ padding: "12mm 16mm" }}>
          <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </div>
        <div style={{ borderTop: `2pt solid ${theme.accent}`, padding: "10mm 16mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
