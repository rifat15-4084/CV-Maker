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
        <div style={{ background: theme.accent, color: theme.accentText, padding: "11mm 16mm" }}>
          <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "11pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
        </div>
        <div style={{ padding: "11mm 16mm 16mm" }}>
          <div style={{ marginBottom: theme.sectionGap }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
