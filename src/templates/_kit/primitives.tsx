import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TemplateTheme } from "./theme";
import { formatInline, type ContactItem } from "./helpers";

/* ==========================================================================
   Print-safe A4 primitives shared by every CVForge template.
   All styling is inline so it is immune to Tailwind purging and always
   survives the print pipeline (selectable text, correct colours).
   ========================================================================== */

/* ---------------------------------- Sheet -------------------------------- */

export function Sheet({
  theme,
  children,
  className,
  style,
}: {
  theme: TemplateTheme;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const sheetStyle = {
    fontFamily: theme.font,
    "--cv-heading": theme.headingFont,
    fontSize: theme.bodySize,
    lineHeight: theme.lineHeight,
    color: theme.ink,
    background: theme.paper,
    ...style,
  } as CSSProperties;

  return (
    <div className={cn("cv-sheet", className)} style={sheetStyle}>
      {children}
    </div>
  );
}

/** Convenience wrapper for template page padding. */
export function SheetBody({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={cn("cv-body", className)} style={{ padding: "14mm 15mm", ...style }}>
      {children}
    </div>
  );
}

/* ----------------------------- section titles ---------------------------- */

export type SectionTitleVariant =
  | "underline"
  | "block"
  | "caps"
  | "rule"
  | "sidebar"
  | "boxed"
  | "plain"
  | "double";

export function SectionTitle({
  title,
  variant = "underline",
  theme,
  accent,
  accentText,
}: {
  title: string;
  variant?: SectionTitleVariant;
  theme: TemplateTheme;
  accent?: string;
  accentText?: string;
}) {
  const color = accent ?? theme.accent;
  const onAccent = accentText ?? theme.accentText;

  switch (variant) {
    case "block":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            display: "block",
            background: color,
            color: onAccent,
            fontSize: "10.5pt",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "3.5pt 8pt",
            marginBottom: "7pt",
          }}
        >
          {title}
        </h2>
      );
    case "caps":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "9pt",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: theme.muted,
            paddingBottom: "4pt",
            borderBottom: `0.75pt solid ${theme.line}`,
            marginBottom: "8pt",
          }}
        >
          {title}
        </h2>
      );
    case "rule":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "11.5pt",
            fontWeight: 800,
            borderLeft: `3.5pt solid ${color}`,
            paddingLeft: "7pt",
            marginBottom: "7pt",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      );
    case "sidebar":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "8.5pt",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: color,
            marginBottom: "7pt",
          }}
        >
          {title}
        </h2>
      );
    case "boxed":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "10pt",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: color,
            background: theme.tint,
            border: `0.75pt solid ${theme.tintStrong}`,
            padding: "4pt 7pt",
            marginBottom: "8pt",
          }}
        >
          {title}
        </h2>
      );
    case "plain":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "12pt",
            fontWeight: 700,
            marginBottom: "5pt",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      );
    case "double":
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "10pt",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            borderTop: `2pt solid ${color}`,
            borderBottom: `0.75pt solid ${theme.line}`,
            paddingTop: "4pt",
            paddingBottom: "3pt",
            marginBottom: "8pt",
          }}
        >
          {title}
        </h2>
      );
    case "underline":
    default:
      return (
        <h2
          className="cv-section-title cv-avoid-break"
          style={{
            fontSize: "11.5pt",
            fontWeight: 700,
            marginBottom: "6pt",
            paddingBottom: "3pt",
            borderBottom: `2pt solid ${color}`,
            letterSpacing: "-0.005em",
          }}
        >
          {title}
        </h2>
      );
  }
}

export function SheetSection({
  title,
  variant = "underline",
  theme,
  accent,
  accentText,
  children,
  style,
  className,
}: {
  title: string;
  variant?: SectionTitleVariant;
  theme: TemplateTheme;
  accent?: string;
  accentText?: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <section className={cn("cv-section", className)} style={{ marginBottom: theme.sectionGap, ...style }}>
      <SectionTitle title={title} variant={variant} theme={theme} accent={accent} accentText={accentText} />
      {children}
    </section>
  );
}

/* --------------------------------- bullets -------------------------------- */

export type BulletMarker = "disc" | "dash" | "arrow" | "check" | "square" | "none";

export function BulletList({
  items,
  theme,
  accent,
  marker = "disc",
  style,
}: {
  items: string[];
  theme: TemplateTheme;
  accent?: string;
  marker?: BulletMarker;
  style?: CSSProperties;
}) {
  const visible = items.filter((item) => item && item.trim().length > 0);
  if (visible.length === 0) return null;

  const glyphs: Record<BulletMarker, string> = {
    disc: "•",
    dash: "–",
    arrow: "›",
    check: "✓",
    square: "▪",
    none: "",
  };

  return (
    <ul
      className="cv-bullets"
      style={{
        listStyle: "none",
        margin: "3pt 0 0",
        padding: 0,
        display: "grid",
        gap: "2.5pt",
        ...style,
      }}
    >
      {visible.map((item, index) => (
        <li key={index} style={{ display: "flex", gap: "5pt", alignItems: "flex-start" }}>
          <span
            aria-hidden
            style={{
              color: accent ?? theme.accent,
              fontWeight: 700,
              lineHeight: theme.lineHeight,
              flexShrink: 0,
            }}
          >
            {glyphs[marker]}
          </span>
          <span style={{ flex: 1 }}>{formatInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------- entries -------------------------------- */

export type EntryLayout = "stacked" | "row";
export type EntryRail = "none" | "start" | "middle" | "end";

export interface EntryProps {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  date?: ReactNode;
  description?: ReactNode;
  bullets?: string[];
  bulletMarker?: BulletMarker;
  theme: TemplateTheme;
  accent?: string;
  layout?: EntryLayout;
  rail?: EntryRail;
  align?: "left" | "between";
  className?: string;
}

export function Entry({
  title,
  subtitle,
  meta,
  date,
  description,
  bullets,
  bulletMarker = "disc",
  theme,
  accent,
  layout = "stacked",
  rail = "none",
  align = "between",
  className,
}: EntryProps) {
  const color = accent ?? theme.accent;
  const hasRail = rail !== "none";

  const header =
    layout === "row" ? (
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: align === "between" ? "space-between" : "flex-start",
          gap: "8pt",
        }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div className="cv-entry-title" style={{ fontWeight: 700, fontSize: "11pt", lineHeight: 1.3 }}>{title}</div>
          {subtitle ? (
            <div style={{ color, fontWeight: 600, fontSize: "10pt", marginTop: "1pt" }}>{subtitle}</div>
          ) : null}
          {meta ? (
            <div style={{ color: theme.faint, fontSize: "9pt", marginTop: "1pt" }}>{meta}</div>
          ) : null}
        </div>
        {date ? (
          <div
            style={{
              flexShrink: 0,
              color: theme.muted,
              fontSize: "9pt",
              fontWeight: 600,
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            {date}
          </div>
        ) : null}
      </div>
    ) : (
      <div>
        <div className="cv-entry-title" style={{ fontWeight: 700, fontSize: "11pt", lineHeight: 1.3 }}>{title}</div>
        {subtitle ? (
          <div style={{ color, fontWeight: 600, fontSize: "10pt", marginTop: "1pt" }}>{subtitle}</div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4pt 10pt",
            color: theme.muted,
            fontSize: "9pt",
            marginTop: meta || date ? "2pt" : 0,
          }}
        >
          {meta ? <span>{meta}</span> : null}
          {date ? <span style={{ fontWeight: 600 }}>{date}</span> : null}
        </div>
      </div>
    );

  const content = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {header}
      {description ? (
        <p style={{ margin: "4pt 0 0", color: theme.muted, fontSize: "9.75pt" }}>
          {typeof description === "string" ? formatInline(description) : description}
        </p>
      ) : null}
      <BulletList items={bullets ?? []} theme={theme} accent={color} marker={bulletMarker} />
    </div>
  );

  if (!hasRail) {
    return (
      <div className={cn("cv-avoid-break", className)} style={{ marginBottom: theme.gap }}>
        {content}
      </div>
    );
  }

  const showTop = rail === "middle" || rail === "end";
  const showBottom = rail === "start" || rail === "middle";

  return (
    <div className={cn("cv-avoid-break", className)} style={{ display: "flex", gap: "8pt" }}>
      <div
        aria-hidden
        style={{
          width: "9pt",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: showTop ? 0 : "5pt",
        }}
      >
        <span
          style={{
            width: showTop ? "100%" : 0,
            height: "1pt",
            background: theme.line,
          }}
        />
        <span
          style={{
            width: "6pt",
            height: "6pt",
            borderRadius: "50%",
            background: color,
            margin: "3pt 0",
            flexShrink: 0,
          }}
        />
        <span style={{ width: showBottom ? "100%" : 0, flex: showBottom ? 1 : 0, background: theme.line }} />
      </div>
      {content}
    </div>
  );
}

/* --------------------------------- chips --------------------------------- */

export function Chip({
  children,
  theme,
  accent,
  variant = "soft",
}: {
  children: ReactNode;
  theme: TemplateTheme;
  accent?: string;
  variant?: "soft" | "solid" | "outline";
}) {  const color = accent ?? theme.accent;
  const styles: Record<string, CSSProperties> = {
    soft: { background: theme.tint, color: theme.accentDark, border: `0.5pt solid ${theme.tintStrong}` },
    solid: { background: color, color: theme.accentText },
    outline: { background: "transparent", color: theme.muted, border: `0.75pt solid ${theme.line}` },
  };
  return (
    <span
      className="cv-avoid-break"
      style={{
        display: "inline-block",
        padding: "2.5pt 7pt",
        borderRadius: "999pt",
        fontSize: "9pt",
        fontWeight: 600,
        lineHeight: 1.4,
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}

export function ChipRow({ children, gap = "4pt" }: { children: ReactNode; gap?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {children}
    </div>
  );
}

/* ---------------------------------- skills -------------------------------- */

export function SkillChips({
  items,
  theme,
  accent,
  variant = "soft",
}: {
  items: { id: string; name: string; extra?: string }[];
  theme: TemplateTheme;
  accent?: string;
  variant?: "soft" | "solid" | "outline";
}) {
  return (
    <ChipRow>
      {items.map((skill) => (
        <Chip key={skill.id} theme={theme} accent={accent} variant={variant}>
          {skill.name}
          {skill.extra ? ` · ${skill.extra}` : ""}
        </Chip>
      ))}
    </ChipRow>
  );
}

export function SkillBars({
  items,
  theme,
  accent,
  columns = 1,
}: {
  items: { id: string; name: string; level: number; showBar?: boolean }[];
  theme: TemplateTheme;
  accent?: string;
  columns?: 1 | 2;
}) {
  const color = accent ?? theme.accent;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
        gap: "5pt 16pt",
      }}
    >
      {items.map((skill) => (
        <div key={skill.id} className="cv-avoid-break" style={{ display: "grid", gap: "2.5pt" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5pt" }}>
            <span style={{ fontWeight: 600 }}>{skill.name}</span>
            {skill.showBar === false ? null : (
              <span style={{ color: theme.faint, fontSize: "8.5pt" }}>{skill.level}/5</span>
            )}
          </div>
          {skill.showBar === false ? null : (
            <div style={{ height: "4pt", background: theme.tint, borderRadius: "99pt", overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.max(6, Math.min(5, skill.level || 1)) * 20}%`,
                  height: "100%",
                  background: color,
                  borderRadius: "99pt",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SkillDots({
  items,
  theme,
  accent,
}: {
  items: { id: string; name: string; level: number }[];
  theme: TemplateTheme;
  accent?: string;
}) {
  const color = accent ?? theme.accent;
  return (
    <div style={{ display: "grid", gap: "4pt" }}>
      {items.map((skill) => (
        <div key={skill.id} className="cv-avoid-break" style={{ display: "flex", justifyContent: "space-between", gap: "8pt" }}>
          <span style={{ fontSize: "9.5pt", fontWeight: 600 }}>{skill.name}</span>
          <span style={{ display: "flex", gap: "2.5pt", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                style={{
                  width: "5pt",
                  height: "5pt",
                  borderRadius: "50%",
                  background: step <= skill.level ? color : theme.line,
                }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SkillColumns({
  items,
  theme,
  accent,
  columns = 2,
}: {
  items: { id: string; name: string; category?: string }[];
  theme: TemplateTheme;
  accent?: string;
  columns?: 2 | 3;
}) {
  const color = accent ?? theme.accent;
  const grouped = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.category?.trim() || "";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }
  const entries = Array.from(grouped.entries());

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "6pt 16pt",
      }}
    >
      {entries.map(([category, group]) => (
        <div key={category || "all"} className="cv-avoid-break">
          {category ? (
            <div
              style={{
                fontSize: "8.5pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color,
                marginBottom: "3pt",
              }}
            >
              {category}
            </div>
          ) : null}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "2pt" }}>
            {group.map((item) => (
              <li key={item.id} style={{ fontSize: "9.5pt" }}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ generic rows ----------------------------- */

export interface InfoRowData {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
}

export function InfoRows({
  items,
  theme,
  accent,
  layout = "row",
  separator = false,
}: {
  items: InfoRowData[];
  theme: TemplateTheme;
  accent?: string;
  layout?: EntryLayout;
  separator?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: "grid", gap: theme.gap }}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="cv-avoid-break"
          style={{
            paddingBottom: separator && index < items.length - 1 ? theme.gap : 0,
            borderBottom:
              separator && index < items.length - 1 ? `0.5pt solid ${theme.line}` : undefined,
          }}
        >
          <Entry
            theme={theme}
            accent={accent}
            layout={layout}
            title={item.title}
            subtitle={item.subtitle}
            meta={item.meta}
            date={layout === "stacked" ? undefined : item.subtitle ? undefined : item.meta}
            description={item.description}
          />
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- photo --------------------------------- */

export function Photo({
  src,
  theme,
  accent,
  size = "28mm",
  shape = "circle",
  ring = true,
  alt = "",
  initialsText,
}: {
  src?: string;
  theme: TemplateTheme;
  accent?: string;
  size?: string;
  shape?: "circle" | "square";
  ring?: boolean;
  alt?: string;
  initialsText?: string;
}) {
  const common: CSSProperties = {
    width: size,
    height: size,
    objectFit: "cover",
    borderRadius: shape === "circle" ? "50%" : theme.radius,
    border: ring ? `2pt solid ${accent ?? theme.accent}` : `${theme.line}`,
    display: "block",
    flexShrink: 0,
  };

  if (!src) {
    return (
      <div
        aria-hidden
        style={{
          ...common,
          background: theme.tint,
          color: theme.accentDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: `calc(${size} * 0.32)`,
          lineHeight: 1,
        }}
      >
        {(initialsText ?? "").slice(0, 2).toUpperCase() || "CV"}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={common} className="cv-photo" />;
}

/* -------------------------------- contacts -------------------------------- */

export function Icon({ name, size = 11 }: { name: ContactItem["icon"]; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    // Prevent the icon from being squashed inside flex contact rows. Must live
    // on `style` — passing `flexShrink` as a bare prop leaks it to the DOM.
    style: { flexShrink: 0 },
  };

  switch (name) {
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06C20.4 8.64 21 11.1 21 14.1V21h-4v-6.1c0-1.46-.03-3.34-2.03-3.34-2.04 0-2.35 1.6-2.35 3.24V21H9z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
        </svg>
      );
    case "link":
    default:
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}

export function ContactList({
  items,
  theme,
  accent,
  icon = true,
  columns = 1,
}: {
  items: ContactItem[];
  theme: TemplateTheme;
  accent?: string;
  icon?: boolean;
  columns?: 1 | 2;
}) {
  if (items.length === 0) return null;
  const color = accent ?? theme.accent;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
        gap: "4pt 12pt",
      }}
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="cv-avoid-break"
          style={{ display: "flex", gap: "5pt", alignItems: "flex-start", minWidth: 0 }}
        >
          {icon ? (
            <span style={{ color, marginTop: "1.5pt", display: "flex" }}>
              <Icon name={item.icon} />
            </span>
          ) : null}
          <span
            style={{
              fontSize: "9pt",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              color: theme.muted,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Label + value rows (used for languages, references, meta info). */
export function DefinitionRows({
  items,
  theme,
  accent,
  showLabels = true,
}: {
  items: { id: string; term: ReactNode; value?: ReactNode }[];
  theme: TemplateTheme;
  accent?: string;
  showLabels?: boolean;
}) {
  const color = accent ?? theme.accent;
  return (
    <div style={{ display: "grid", gap: "4pt" }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="cv-avoid-break"
          style={{ display: "flex", gap: "6pt", alignItems: "baseline", justifyContent: "space-between" }}
        >
          <span style={{ fontWeight: 600, fontSize: "9.5pt", color: showLabels ? theme.ink : theme.muted }}>
            {item.term}
          </span>
          {item.value !== undefined && item.value !== null && item.value !== "" ? (
            <span style={{ fontSize: "9pt", color, fontWeight: 600, textAlign: "right" }}>{item.value}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- composite blocks -------------------------- */

export function Paragraph({ children, theme, style }: { children: ReactNode; theme: TemplateTheme; style?: CSSProperties }) {
  return (
    <p style={{ margin: 0, color: theme.muted, fontSize: "10pt", ...style }}>{children}</p>
  );
}

export function Divider({ theme, accent }: { theme: TemplateTheme; accent?: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: "0.75pt",
        background: `linear-gradient(to right, ${accent ?? theme.accent}, ${theme.line})`,
        margin: `${theme.sectionGap} 0`,
      }}
    />
  );
}
