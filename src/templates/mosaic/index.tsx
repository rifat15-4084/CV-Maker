import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sideOptions: SectionStyleOptions = { titleVariant: "sidebar", entryLayout: "stacked", skillStyle: "chips" };
  const sections = visibleSections(data);
  const MAIN = ["summary", "experience", "education", "projects", "certifications", "awards", "references", "custom"] as const;
  const SIDE = ["skills", "languages", "hobbies"] as const;
  const mainKeys = sections.filter((s) => (MAIN as readonly string[]).includes(s));
  const sideKeys = sections.filter((s) => (SIDE as readonly string[]).includes(s));
  return (
      <div style={{ padding: "15mm 16mm" }}>
        <header style={{ marginBottom: theme.sectionGap, display: "grid", gap: "5pt" }}>
          <h1 style={{ margin: 0, fontSize: "31pt", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: 0, fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 58mm", gap: "9mm", borderTop: `2pt solid ${theme.accent}`, paddingTop: "10pt" }}>
          <div style={{ minWidth: 0 }}>{mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
          <div style={{ minWidth: 0 }}>
            <SheetSection title="Contact" variant="caps" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
            {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
          </div>
        </div>
      </div>
  );
}
