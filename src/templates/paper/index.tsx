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
      <div style={{ padding: "18mm 18mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 700, letterSpacing: "-0.025em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "34mm 1fr", gap: "8mm", borderTop: `0.75pt solid ${theme.line}`, paddingTop: "10pt" }}>
          <div style={{ display: "grid", gap: "10pt", alignContent: "start", fontSize: "9pt" }}>
            <div>
              <div style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.faint, marginBottom: "5pt" }}>Contact</div>
              <ContactList items={contactItems(personal)} theme={theme} icon={false} />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
        </div>
      </div>
  );
}
