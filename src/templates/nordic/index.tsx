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
  const sections = visibleSections(data);  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };

  return (
      <div style={{ padding: "22mm 20mm" }}>
        <header style={{ marginBottom: "14pt" }}>
          <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.muted }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "8pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} /></div>
          <div aria-hidden style={{ height: "0.75pt", background: theme.line, marginTop: "10pt" }} />
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
