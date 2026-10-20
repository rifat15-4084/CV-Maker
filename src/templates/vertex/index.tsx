import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const skillStyle = String(data.extra.skillLevelStyle ?? "bars") as "bars" | "chips";

  const options: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "row",
    bulletMarker: "square",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ background: theme.accent, color: theme.accentText, padding: "14mm 14mm", display: "flex", gap: "10mm", alignItems: "center" }}>
        {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.85)" size="28mm" shape="square" initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
          {personal.tagline ? <p style={{ margin: "6pt 0 0", fontSize: "9.5pt", opacity: 0.9, maxWidth: "110mm" }}>{personal.tagline}</p> : null}
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 58mm", minHeight: "220mm" }}>
        <main style={{ padding: "12mm 6mm 14mm 14mm", minWidth: 0 }}>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={options} />
          <SectionBlock data={data} section="awards" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>

        <aside style={{ background: theme.tintSoft, borderLeft: `0.75pt solid ${theme.line}`, padding: "12mm 8mm 14mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div>
            <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: theme.accentDark, marginBottom: "7pt" }}>Details</h2>
            <ContactBlock data={data} theme={theme} />
          </div>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle, skillColumns: 1 }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="references" theme={theme} options={{ titleVariant: "sidebar", entryLayout: "stacked" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>
      </div>
    </Sheet>
  );
}
