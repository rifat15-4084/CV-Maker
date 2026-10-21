import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock } from "../_kit/sections";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, {
    font: pickFont(data.settings.font, config.fonts),
    headingFont: pickFont(data.settings.font, config.fonts),
  });
  const personal = data.personal;
  const sections = visibleSections(data);

  const contact = contactItems(personal);
  const contactRow = contact.map((item) => item.value).filter(Boolean).join(" · ");

  return (
    <div style={{ padding: "16mm 18mm" }}>
      <header style={{ textAlign: "center", marginBottom: theme.sectionGap }}>
        <div style={{ fontSize: "34pt", lineHeight: 1, fontWeight: 700, fontFamily: theme.headingFont }}>
          {fullName(personal) || "Your Name"}
        </div>
        <div style={{ margin: "8pt auto 6pt", width: "80%", borderTop: "2.5pt solid #111", borderBottom: "0.75pt solid #111", height: "4pt" }} />
        {personal.jobTitle ? (
          <div style={{ fontSize: "11pt", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#222" }}>
            {personal.jobTitle}
          </div>
        ) : null}
        <div style={{ fontSize: "9pt", marginTop: "6pt", color: "#555" }}>
          {contactRow || "email · phone · location"}
        </div>
      </header>

      <div style={{ textAlign: "left" }}>
        {sections.map((section) => (
          <SectionBlock
            key={section}
            data={data}
            section={section}
            theme={theme}
            options={{ titleVariant: "caps", entryLayout: "row", bulletMarker: "disc" }}
          />
        ))}
      </div>
    </div>
  );
}
