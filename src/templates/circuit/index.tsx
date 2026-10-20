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
        <header style={{ marginBottom: theme.sectionGap, display: "flex", alignItems: "center", gap: "8pt", flexWrap: "wrap" }}>
          <span aria-hidden style={{ width: "10pt", height: "10pt", borderRadius: "50%", background: theme.accent }} />
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ flexBasis: "100%", marginTop: "4pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
