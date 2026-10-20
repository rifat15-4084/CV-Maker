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
  const sideOptions: SectionStyleOptions = { titleVariant: "sidebar", entryLayout: "stacked", skillStyle: "chips" };
  const sections = visibleSections(data);
  const MAIN = ["summary", "experience", "education", "projects", "certifications", "awards", "references", "custom"] as const;
  const SIDE = ["skills", "languages", "hobbies"] as const;
  const mainKeys = sections.filter((s) => (MAIN as readonly string[]).includes(s));
  const sideKeys = sections.filter((s) => (SIDE as readonly string[]).includes(s));  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "arrow" };

  return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 56mm", minHeight: "297mm" }}>
        <main style={{ padding: "15mm 12mm 15mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap, borderBottom: `2pt solid ${theme.accent}`, paddingBottom: "8pt" }}>
            <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.03em" }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10.5pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </header>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
        <aside style={{ background: theme.tintSoft, borderLeft: `0.75pt solid ${theme.line}`, padding: "15mm 8mm", display: "grid", gap: "13pt", alignContent: "start" }}>
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
      </div>
  );
}
