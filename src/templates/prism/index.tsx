import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Chip, ChipRow, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const skillStyle = String(data.extra.skillLevelStyle ?? "dots") as "dots" | "chips";

  const options: SectionStyleOptions = { titleVariant: "block", entryLayout: "row", bulletMarker: "arrow" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 60mm", minHeight: "297mm" }}>
        <main style={{ padding: "15mm 12mm 14mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <div aria-hidden style={{ width: "10mm", height: "3pt", background: theme.accent, marginBottom: "8pt" }} />
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", color: theme.muted }}>{personal.jobTitle}</p> : null}
          </header>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={options} />
          <SectionBlock data={data} section="awards" theme={theme} options={options} />
          <SectionBlock data={data} section="references" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>

        <aside style={{ background: theme.tintSoft, padding: "15mm 8mm 14mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div>
            <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: theme.accentDark, marginBottom: "7pt" }}>Get in touch</h2>
            <ContactBlock data={data} theme={theme} columns={1} />
          </div>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
          {personal.tagline ? (
            <div style={{ borderTop: `0.75pt solid ${theme.line}`, paddingTop: "8pt" }}>
              <ChipRow><Chip theme={theme} variant="soft">{personal.tagline}</Chip></ChipRow>
            </div>
          ) : null}
        </aside>
      </div>
    </Sheet>
  );
}
