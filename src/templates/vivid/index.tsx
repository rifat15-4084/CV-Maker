import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList } from "../_kit/primitives";
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
  const sideKeys = sections.filter((s) => (SIDE as readonly string[]).includes(s));  const options: SectionStyleOptions = { titleVariant: "block", entryLayout: "stacked", bulletMarker: "arrow" };

  return (
      <>
        <header style={{ padding: "15mm 16mm 5mm" }}>
          <h1 style={{ margin: 0, fontSize: "33pt", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "12pt", color: theme.accentDark, fontWeight: 700 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "4mm 16mm 15mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9mm" }}>
          <div style={{ minWidth: 0 }}>{mainKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
          <div style={{ minWidth: 0 }}>{sideKeys.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={sideOptions} />)}</div>
        </div>
      </>
  );
}
