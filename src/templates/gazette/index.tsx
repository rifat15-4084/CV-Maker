import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock } from "../_kit/sections";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts), headingFont: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const sections = visibleSections(data);
  return (
    <div style={{ padding: "16mm 18mm" }}>
      <header style={{ marginBottom: theme.sectionGap }}>
        <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 700, lineHeight: 1 }}>{fullName(personal) || "Your Name"}</h1>
        {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: "#444" }}>{personal.jobTitle}</p> : null}
      </header>
      {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={{ titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" }} />)}
    </div>
  );
}
