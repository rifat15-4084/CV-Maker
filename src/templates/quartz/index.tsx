import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const sections = visibleSections(data);  const options: SectionStyleOptions = { titleVariant: "boxed", entryLayout: "row", bulletMarker: "square" };

  return (
      <>
        <div style={{ background: theme.accent, color: theme.accentText, padding: "12mm 15mm", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10pt", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "11pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
          </div>
          <div style={{ fontSize: "9pt", display: "grid", gap: "3pt", textAlign: "right" }}>
            {contactItems(personal).slice(0, 4).map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        </div>
        <div style={{ padding: "12mm 15mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
