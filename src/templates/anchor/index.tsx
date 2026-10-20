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
      <div style={{ padding: "16mm 17mm" }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          <div aria-hidden style={{ height: "3pt", background: theme.accent, width: "40mm", margin: "8pt 0" }} />
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.muted, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
