import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sideOptions: SectionStyleOptions = { titleVariant: "sidebar", entryLayout: "stacked", skillStyle: "chips" };
  const sections = visibleSections(data);
  const MAIN = ["summary", "experience", "education", "projects", "certifications", "awards", "references", "custom"] as const;
  const SIDE = ["skills", "languages", "hobbies"] as const;
  const mainKeys = sections.filter((s) => (MAIN as readonly string[]).includes(s));
  const sideKeys = sections.filter((s) => (SIDE as readonly string[]).includes(s));
  return (
      <div style={{ display: "grid", gridTemplateColumns: "60mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.tintSoft, padding: "16mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          {showPhoto ? <div style={{ display: "flex", justifyContent: "center" }}><Photo src={personal.photo} theme={theme} size="34mm" initialsText={`${personal.firstName}${personal.lastName}`} /></div> : null}
          <SheetSection title="Contact" variant="sidebar" theme={theme}><ContactBlock data={data} theme={theme} /></SheetSection>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}
        </aside>
        <main style={{ padding: "16mm 15mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "11pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
            {personal.tagline ? <p style={{ margin: "7pt 0 0", fontSize: "9.8pt", color: theme.muted }}>{personal.tagline}</p> : null}
          </header>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>
  );
}
