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
      <div style={{ display: "grid", gridTemplateColumns: "54mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.accent, color: theme.accentText, padding: "16mm 8mm", display: "grid", gap: "13pt", alignContent: "start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20pt", fontWeight: 800, lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "9.5pt", opacity: 0.92 }}>{personal.jobTitle}</p> : null}
          </div>
          <SheetSection title="Contact" variant="sidebar" theme={theme} accent="#ffffff" accentText="#ffffff"><ContactBlock data={data} theme={theme} accent="#ffffff" /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} accent="#ffffff" options={sideOptions} />)}
        </aside>
        <main style={{ padding: "16mm 15mm", minWidth: 0 }}>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>
  );
}
