import type { CVData, SectionKey } from "@/lib/cv/schema";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import { formatDateRange, formatMonthYear, LANGUAGE_LEVEL_LABELS, PROFICIENCY_LABELS } from "@/lib/cv/format";
import type { TemplateTheme } from "./theme";
import { contactItems, fullName, show, visibleSections } from "./helpers";
import {
  BulletList,
  ChipRow,
  Chip,
  ContactList,
  DefinitionRows,
  Entry,
  InfoRows,
  Paragraph,
  SheetSection,
  SkillBars,
  SkillChips,
  SkillColumns,
  SkillDots,
  type BulletMarker,
  type EntryLayout,
  type EntryRail,
  type SectionTitleVariant,
} from "./primitives";

export interface SectionStyleOptions {
  titleVariant?: SectionTitleVariant;
  entryLayout?: EntryLayout;
  bulletMarker?: BulletMarker;
  skillStyle?: "chips" | "bars" | "dots" | "columns";
  skillColumns?: 1 | 2;
  separator?: boolean;
  chipVariant?: "soft" | "solid" | "outline";
  /** Draw a vertical timeline rail next to list entries. */
  timeline?: boolean;
  /** Extra label overrides, e.g. { experience: "Work History" }. */
  labels?: Partial<Record<SectionKey, string>>;
}

export function sectionLabel(section: SectionKey, options?: SectionStyleOptions) {
  return options?.labels?.[section] ?? SECTION_LABELS[section];
}

function railFor(index: number, total: number): EntryRail {
  if (total <= 1) return "start";
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "middle";
}

/** Content only (no title) — lets templates build custom section chrome. */
export function SectionContent({
  data,
  section,
  theme,
  accent,
  options = {},
}: {
  data: CVData;
  section: SectionKey;
  theme: TemplateTheme;
  accent?: string;
  options?: SectionStyleOptions;
}) {
  if (!show(data, section)) return null;
  const layout = options.entryLayout ?? "stacked";
  const marker = options.bulletMarker ?? "disc";
  if (section === "custom") {
    return (
      <>
        {data.customSections
          .filter((custom) => custom.items.length > 0)
          .map((custom) => (
            <div key={custom.id} className="cv-avoid-break" style={{ marginBottom: theme.sectionGap }}>
              <div className="cv-entry-title" style={{ fontWeight: 700, fontSize: "11pt", marginBottom: "5pt" }}>
                {custom.title || "Additional"}
              </div>
              <InfoRows
                theme={theme}
                accent={accent}
                layout={layout}
                items={custom.items.map((item) => ({
                  id: item.id,
                  title: item.heading,
                  subtitle: item.subheading || undefined,
                  meta: item.date || undefined,
                  description: item.description || undefined,
                }))}
              />
            </div>
          ))}
      </>
    );
  }
  return <>{renderContent(data, section, theme, { accent, options, layout, marker })}</>;
}

/** Renders one CV section with a consistent title + content style. */
export function SectionBlock({
  data,
  section,
  theme,
  accent,
  options = {},
  style,
}: {
  data: CVData;
  section: SectionKey;
  theme: TemplateTheme;
  accent?: string;
  options?: SectionStyleOptions;
  style?: React.CSSProperties;
}) {
  if (!show(data, section)) return null;

  const titleVariant = options.titleVariant ?? "underline";
  const layout = options.entryLayout ?? "stacked";
  const marker = options.bulletMarker ?? "disc";

  if (section === "custom") {
    return (
      <>
        {data.customSections
          .filter((custom) => custom.items.length > 0)
          .map((custom) => (
            <SheetSection
              key={custom.id}
              title={custom.title || "Additional"}
              variant={titleVariant}
              theme={theme}
              accent={accent}
              style={style}
            >
              <InfoRows
                theme={theme}
                accent={accent}
                layout={layout}
                items={custom.items.map((item) => ({
                  id: item.id,
                  title: item.heading,
                  subtitle: item.subheading || undefined,
                  meta: item.date || undefined,
                  description: item.description || undefined,
                }))}
              />
              {custom.items.map((item) =>
                item.bullets.filter(Boolean).length ? (
                  <BulletList key={item.id} items={item.bullets} theme={theme} accent={accent} marker={marker} />
                ) : null,
              )}
            </SheetSection>
          ))}
      </>
    );
  }

  const content = renderContent(data, section, theme, { accent, options, layout, marker });

  if (!content) return null;

  return (
    <SheetSection
      title={sectionLabel(section, options)}
      variant={titleVariant}
      theme={theme}
      accent={accent}
      style={style}
    >
      {content}
    </SheetSection>
  );
}

/** Every visible section, in the user's configured order. */
export function SectionStack({
  data,
  theme,
  accent,
  options = {},
  exclude = [],
  only,
}: {
  data: CVData;
  theme: TemplateTheme;
  accent?: string;
  options?: SectionStyleOptions;
  exclude?: SectionKey[];
  only?: SectionKey[];
}) {
  const keys = (only ?? visibleSections(data)).filter((key) => !exclude.includes(key));
  return (
    <>
      {keys.map((key) => (
        <SectionBlock key={key} data={data} section={key} theme={theme} accent={accent} options={options} />
      ))}
    </>
  );
}

function renderContent(
  data: CVData,
  section: SectionKey,
  theme: TemplateTheme,
  ctx: {
    accent?: string;
    options: SectionStyleOptions;
    layout: EntryLayout;
    marker: BulletMarker;
  },
) {
  const { accent, options, layout, marker } = ctx;

  switch (section) {
    case "summary":
      return <Paragraph theme={theme}>{data.summary}</Paragraph>;

    case "experience":
      return (
        <div style={{ display: "grid", gap: theme.gap }}>
          {data.experience.map((item, index) => (
            <Entry
              key={item.id}
              theme={theme}
              accent={accent}
              layout={layout}
              rail={options.timeline ? railFor(index, data.experience.length) : "none"}
              title={item.role || "Job title"}
              subtitle={[item.company, item.location].filter(Boolean).join(" · ") || undefined}
              meta={
                [
                  item.employmentType && item.employmentType !== "full-time"
                    ? item.employmentType.replace("-", " ")
                    : "",
                  item.description,
                ]
                  .filter(Boolean)
                  .join(" — ") || undefined
              }
              date={formatDateRange(item.startDate, item.endDate, item.current, true)}
              bullets={item.bullets}
              bulletMarker={marker}
            />
          ))}
        </div>
      );

    case "education":
      return (
        <div style={{ display: "grid", gap: theme.gap }}>
          {data.education.map((item, index) => (
            <Entry
              key={item.id}
              theme={theme}
              accent={accent}
              layout={layout}
              rail={options.timeline ? railFor(index, data.education.length) : "none"}
              title={item.degree || item.field || "Degree"}
              subtitle={[item.school, item.location].filter(Boolean).join(" · ") || undefined}
              meta={[item.field, item.grade].filter(Boolean).join(" · ") || undefined}
              date={formatDateRange(item.startDate, item.endDate, item.current, true)}
              description={item.description || undefined}
              bullets={item.bullets}
              bulletMarker={marker}
            />
          ))}
        </div>
      );

    case "skills": {
      const style = options.skillStyle ?? "chips";
      if (style === "bars")
        return <SkillBars items={data.skills} theme={theme} accent={accent} columns={options.skillColumns ?? 1} />;
      if (style === "dots") return <SkillDots items={data.skills} theme={theme} accent={accent} />;
      if (style === "columns")
        return <SkillColumns items={data.skills} theme={theme} accent={accent} columns={options.skillColumns === 1 ? 2 : 2} />;
      return (
        <SkillChips
          items={data.skills}
          theme={theme}
          accent={accent}
          variant={options.chipVariant ?? "soft"}
        />
      );
    }

    case "projects":
      return (
        <div style={{ display: "grid", gap: theme.gap }}>
          {data.projects.map((item) => (
            <Entry
              key={item.id}
              theme={theme}
              accent={accent}
              layout={layout}
              title={item.name || "Project"}
              subtitle={[item.role, item.tech].filter(Boolean).join(" · ") || undefined}
              meta={item.link || undefined}
              date={formatDateRange(item.startDate, item.endDate, false, true) || undefined}
              description={item.description || undefined}
              bullets={item.bullets}
              bulletMarker={marker}
            />
          ))}
        </div>
      );

    case "certifications":
      return (
        <InfoRows
          theme={theme}
          accent={accent}
          layout={layout}
          separator={options.separator}
          items={data.certifications.map((item) => ({
            id: item.id,
            title: item.name || "Certification",
            subtitle: item.issuer || undefined,
            meta: [formatMonthYear(item.date), item.credentialId].filter(Boolean).join(" · ") || undefined,
            description: item.url || undefined,
          }))}
        />
      );

    case "languages":
      if (options.skillStyle === "chips" || options.chipVariant === "solid") {
        return (
          <ChipRow>
            {data.languages.map((item) => (
              <Chip key={item.id} theme={theme} accent={accent} variant={options.chipVariant ?? "soft"}>
                {item.name} — {LANGUAGE_LEVEL_LABELS[item.level]}
              </Chip>
            ))}
          </ChipRow>
        );
      }
      return (
        <DefinitionRows
          theme={theme}
          accent={accent}
          items={data.languages.map((item) => ({
            id: item.id,
            term: item.name,
            value: item.detail || LANGUAGE_LEVEL_LABELS[item.level],
          }))}
        />
      );

    case "awards":
      return (
        <InfoRows
          theme={theme}
          accent={accent}
          layout={layout}
          separator={options.separator}
          items={data.awards.map((item) => ({
            id: item.id,
            title: item.title || "Award",
            subtitle: item.issuer || undefined,
            meta: formatMonthYear(item.date) || undefined,
            description: item.description || undefined,
          }))}
        />
      );

    case "references":
      return (
        <InfoRows
          theme={theme}
          accent={accent}
          layout={layout}
          separator={options.separator}
          items={data.references.map((item) => ({
            id: item.id,
            title: item.name || "Name",
            subtitle: [item.role, item.company].filter(Boolean).join(", ") || undefined,
            meta: [item.relationship, item.contact].filter(Boolean).join(" · ") || undefined,
          }))}
        />
      );

    case "hobbies":
      return (
        <ChipRow>
          {data.hobbies.map((item) => (
            <Chip key={item.id} theme={theme} accent={accent} variant={options.chipVariant ?? "outline"}>
              {item.name}
            </Chip>
          ))}
        </ChipRow>
      );

    default:
      return null;
  }
}

/** Contact block (used inside sidebars and headers). */
export function ContactBlock({
  data,
  theme,
  accent,
  columns = 1,
  icon = true,
}: {
  data: CVData;
  theme: TemplateTheme;
  accent?: string;
  columns?: 1 | 2;
  icon?: boolean;
}) {
  return <ContactList items={contactItems(data.personal)} theme={theme} accent={accent} columns={columns} icon={icon} />;
}

export { fullName, show, visibleSections, PROFICIENCY_LABELS, LANGUAGE_LEVEL_LABELS, formatDateRange, formatMonthYear };
