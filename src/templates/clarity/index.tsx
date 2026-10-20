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
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <>
        <header style={{ background: theme.tint, padding: "14mm 17mm" }}>
          <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, letterSpacing: "-0.025em" }}>{fullName(personal) || "Your Name"}</h1>
          {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.8pt", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          <div style={{ marginTop: "9pt" }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
        </header>
        <div style={{ padding: "12mm 17mm 16mm" }}>{sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}</div>
      </>
  );
}
