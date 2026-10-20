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
  const sections = visibleSections(data);  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };

  return (
      <div style={{ padding: "16mm 19mm" }}>
        <header style={{ textAlign: "center", marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "25pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10pt", fontStyle: "italic", color: theme.muted }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "7pt", display: "flex", justifyContent: "center" }}><ContactList items={contactItems(personal)} theme={theme} icon={false} /></div>
          <div style={{ height: "0.75pt", background: theme.line, marginTop: "9pt" }} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
