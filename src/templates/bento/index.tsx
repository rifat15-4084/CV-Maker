import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
import { ContactBlock, SectionBlock, SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import type { SectionKey } from "@/lib/cv/schema";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sideOptions: SectionStyleOptions = { titleVariant: "sidebar", entryLayout: "stacked", skillStyle: "chips" };
  const sections = visibleSections(data);
  const MAIN = ["summary", "experience", "education", "projects", "certifications", "awards", "references", "custom"] as const;
  const mainKeys = sections.filter((s) => (MAIN as readonly string[]).includes(s));
  const cardKeys: SectionKey[] = sections.filter((s) => s === "summary" || s === "skills" || s === "languages" || s === "hobbies");
  return (
      <>
        <header style={{ background: theme.tint, padding: "13mm 15mm", borderBottom: `3pt solid ${theme.accent}` }}>
          <h1 style={{ margin: 0, fontSize: "29pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
        </header>
        <div style={{ padding: "11mm 15mm 15mm", display: "grid", gridTemplateColumns: "1fr 60mm", gap: "9mm" }}>
          <div style={{ minWidth: 0 }}>
            {mainKeys.filter((s) => !cardKeys.includes(s)).map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
          </div>
          <div style={{ display: "grid", gap: theme.gap, alignContent: "start" }}>
            {cardKeys.map((section) => (
              <div key={section} className="cv-avoid-break" style={{ background: theme.tintSoft, border: `0.75pt solid ${theme.tintStrong}`, borderRadius: theme.radius, padding: "8pt 9pt" }}>
                <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>{SECTION_LABELS[section]}</h2>
                <SectionContent data={data} section={section} theme={theme} options={sideOptions} />
              </div>
            ))}
            <div className="cv-avoid-break" style={{ background: theme.tintSoft, border: `0.75pt solid ${theme.tintStrong}`, borderRadius: theme.radius, padding: "8pt 9pt" }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>Contact</h2>
              <ContactBlock data={data} theme={theme} />
            </div>
          </div>
        </div>
      </>
  );
}
