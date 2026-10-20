import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo } from "../_kit/primitives";
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
      <div style={{ display: "grid", gridTemplateColumns: "52mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: "#0f172a", color: "#e2e8f0", padding: "15mm 8mm", display: "grid", gap: "12pt", alignContent: "start" }}>
          {showPhoto ? <div style={{ display: "flex", justifyContent: "center" }}><Photo src={personal.photo} theme={theme} accent={theme.accent} size="30mm" shape="square" initialsText={`${personal.firstName}${personal.lastName}`} /></div> : null}
          <div>
            <div style={{ fontWeight: 800, fontSize: "15pt", lineHeight: 1.1 }}>{fullName(personal) || "Your Name"}</div>
            {personal.jobTitle ? <div style={{ fontSize: "9pt", color: theme.accent, marginTop: "3pt" }}>{personal.jobTitle}</div> : null}
          </div>
          <div>
            <h2 style={{ fontSize: "8.5pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accent, marginBottom: "6pt" }}>Contact</h2>
            <ContactBlock data={data} theme={theme} accent="#e2e8f0" />
          </div>
          {sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} accent="#e2e8f0" options={{ ...sideOptions, titleVariant: "sidebar" }} />)}
        </aside>
        <main style={{ padding: "15mm 14mm", minWidth: 0 }}>
          {mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </main>
      </div>
  );
}
