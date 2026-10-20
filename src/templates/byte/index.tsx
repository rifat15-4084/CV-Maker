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
  const sections = visibleSections(data);  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "arrow", labels: { experience: "experience.log", education: "education.log", projects: "projects.log" } };

  return (
      <div style={{ padding: "15mm 16mm", fontFamily: theme.font }}>
        <header style={{ marginBottom: theme.sectionGap }}>
          <div style={{ fontSize: "9pt", color: theme.faint }}>~/cv $ whoami</div>
          <h1 style={{ margin: "4pt 0 0", fontSize: "25pt", fontWeight: 700, letterSpacing: "-0.02em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "3pt 0 0", fontSize: "10pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
