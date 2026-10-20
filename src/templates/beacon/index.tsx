import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <>
        <header style={{ padding: "15mm 16mm 11mm", borderBottom: `3pt solid ${theme.accent}` }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600, letterSpacing: "0.03em" }}>{personal.jobTitle}</p> : null}
          {personal.tagline ? <p style={{ margin: "7pt 0 0", fontSize: "9.8pt", color: theme.muted, maxWidth: "150mm" }}>{personal.tagline}</p> : null}
        </header>
        <div style={{ padding: "11mm 16mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>
  );
}
