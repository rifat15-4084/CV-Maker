import { cn } from "@/lib/utils";
import { mixWithWhite, rgba } from "@/templates/_kit/color";
import type { TemplateConfig } from "@/templates/types";

/**
 * Lightweight SVG preview drawn from a template's `preview` spec.
 * Renders instantly (no image request, no template bundle) which keeps the
 * gallery fast even with 60 templates.
 */
export function TemplatePreview({
  template,
  className,
  showLabel = false,
}: {
  template: TemplateConfig;
  className?: string;
  showLabel?: boolean;
}) {
  const accent = template.defaultAccent;
  const spec = template.preview;
  const tint = rgba(accent, 0.14);
  const dense = spec.density === "dense";

  const headerHeight = spec.header === "banner" || spec.header === "band" ? 46 : 34;

  return (
    <svg
      viewBox="0 0 140 196"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={
        showLabel ? `${template.name} template preview` : "CV template preview"
      }
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="140" height="196" fill="#ffffff" />

      {/* header */}
      {(spec.header === "banner" || spec.header === "band") && (
        <>
          <rect width="140" height={headerHeight} fill={spec.header === "banner" ? "#0f172a" : accent} />
          <rect x="10" y="14" width="62" height="6" rx="2" fill="#ffffff" opacity="0.95" />
          <rect x="10" y="25" width="40" height="3" rx="1.5" fill={spec.header === "banner" ? accent : "#ffffff"} opacity="0.85" />
          <rect x="10" y="33" width="80" height="2" rx="1" fill="#ffffff" opacity="0.35" />
          {spec.header === "banner" && <rect y={headerHeight} width="140" height="2.5" fill={accent} />}
        </>
      )}

      {spec.header === "split" && (
        <>
          {spec.sidebar === "left" && <rect width="46" height="196" fill={tint} />}
          {spec.sidebar === "right" && <rect x="102" width="38" height="196" fill={tint} />}
          <rect x={spec.sidebar === "left" ? 54 : 10} y="16" width="52" height="7" rx="2" fill="#0f172a" opacity="0.9" />
          <rect x={spec.sidebar === "left" ? 54 : 10} y="28" width="34" height="3" rx="1.5" fill={accent} />
          <rect x={spec.sidebar === "left" ? 54 : 10} y="36" width="26" height="2.5" rx="1.2" fill={accent} />
        </>
      )}

      {spec.header === "centered" && (
        <>
          <rect x="38" y="14" width="64" height="7" rx="2" fill="#0f172a" opacity="0.9" />
          <rect x="52" y="25" width="36" height="3" rx="1.5" fill={accent} />
          <rect x="46" y="33" width="48" height="1.6" rx="0.8" fill="#0f172a" opacity="0.2" />
        </>
      )}

      {spec.header === "rail" && (
        <>
          <rect x="10" y="16" width="66" height="7" rx="2" fill="#0f172a" opacity="0.9" />
          <rect x="10" y="27" width="44" height="3" rx="1.5" fill={accent} />
          <rect x="96" y="16" width="34" height="2.4" rx="1.2" fill="#0f172a" opacity="0.25" />
          <rect x="96" y="22" width="28" height="2.4" rx="1.2" fill="#0f172a" opacity="0.25" />
          <rect x="96" y="28" width="30" height="2.4" rx="1.2" fill="#0f172a" opacity="0.25" />
        </>
      )}

      {/* photo */}
      {spec.photo ? (
        spec.header === "split" && spec.sidebar === "left" ? (
          <circle cx="23" cy="42" r="13" fill="none" stroke={accent} strokeWidth="1.6" />
        ) : (
          <circle cx="118" cy="26" r="11" fill="none" stroke={accent} strokeWidth="1.6" />
        )
      ) : null}

      {/* sidebar content */}
      {spec.sidebar === "left" && (
        <g>
          <rect x="8" y="20" width="30" height="2.6" rx="1.3" fill={accent} opacity="0.8" />
          <rect x="8" y="62" width="26" height="2.4" rx="1.2" fill="#0f172a" opacity="0.4" />
          <rect x="8" y="68" width="30" height="2" rx="1" fill="#0f172a" opacity="0.25" />
          <rect x="8" y="73" width="24" height="2" rx="1" fill="#0f172a" opacity="0.25" />
          <rect x="8" y="86" width="30" height="2.6" rx="1.3" fill={accent} opacity="0.8" />
          <rect x="8" y="93" width="30" height="3.4" rx="1.7" fill="#0f172a" opacity="0.14" />
          <rect x="8" y="93" width="22" height="3.4" rx="1.7" fill={accent} opacity="0.75" />
          <rect x="8" y="100" width="30" height="3.4" rx="1.7" fill="#0f172a" opacity="0.14" />
          <rect x="8" y="100" width="16" height="3.4" rx="1.7" fill={accent} opacity="0.75" />
          <rect x="8" y="112" width="30" height="2.6" rx="1.3" fill={accent} opacity="0.8" />
          <rect x="8" y="119" width="22" height="2" rx="1" fill="#0f172a" opacity="0.25" />
        </g>
      )}

      {spec.sidebar === "right" && (
        <g>
          <rect x="109" y="46" width="24" height="2.6" rx="1.3" fill={accent} opacity="0.8" />
          <rect x="109" y="53" width="24" height="2" rx="1" fill="#0f172a" opacity="0.25" />
          <rect x="109" y="58" width="18" height="2" rx="1" fill="#0f172a" opacity="0.25" />
          <rect x="109" y="72" width="24" height="2.6" rx="1.3" fill={accent} opacity="0.8" />
          <rect x="109" y="79" width="24" height="3.2" rx="1.6" fill="#0f172a" opacity="0.14" />
          <rect x="109" y="79" width="17" height="3.2" rx="1.6" fill={accent} opacity="0.75" />
          <rect x="109" y="86" width="24" height="3.2" rx="1.6" fill="#0f172a" opacity="0.14" />
          <rect x="109" y="86" width="12" height="3.2" rx="1.6" fill={accent} opacity="0.75" />
        </g>
      )}

      {/* body */}
      <g transform={spec.sidebar === "left" ? "translate(54, 50)" : spec.sidebar === "right" ? "translate(10, 50)" : "translate(10, 0)"}>
        <g>
          <rect x="0" y={spec.header === "band" || spec.header === "banner" ? 56 : spec.header === "centered" ? 48 : 0} width="30" height="3" rx="1.5" fill={accent} />
          <rect x="0" y={(spec.header === "band" || spec.header === "banner" ? 56 : spec.header === "centered" ? 48 : 0) + 6} width={spec.sidebar === "none" ? 116 : 68} height="2" rx="1" fill="#0f172a" opacity="0.22" />
          <rect x="0" y={(spec.header === "band" || spec.header === "banner" ? 56 : spec.header === "centered" ? 48 : 0) + 11} width={spec.sidebar === "none" ? 100 : 60} height="2" rx="1" fill="#0f172a" opacity="0.22" />
        </g>

        {Array.from({ length: 4 }).map((_, blockIndex) => (
          <g key={blockIndex} transform={`translate(0, ${(spec.header === "band" || spec.header === "banner" ? 56 : spec.header === "centered" ? 48 : 0) + 26 + blockIndex * (dense ? 24 : 30)})`}>
            <rect x="0" y="0" width={blockIndex % 2 === 0 ? 34 : 28} height="3" rx="1.5" fill="#0f172a" opacity="0.75" />
            <rect x="0" y="6" width={spec.sidebar === "none" ? 78 : 48} height="2" rx="1" fill={accent} opacity="0.65" />
            <rect x="0" y="12" width={spec.sidebar === "none" ? 116 : 66} height="1.8" rx="0.9" fill="#0f172a" opacity="0.2" />
            <rect x="4" y="18" width={spec.sidebar === "none" ? 108 : 60} height="1.8" rx="0.9" fill="#0f172a" opacity="0.2" />
          </g>
        ))}

        {spec.accentRule === "block" && <rect x="0" y="0" width="3" height="120" fill={accent} opacity="0.8" rx="1.5" />}
      </g>

      {/* footer accent */}
      <rect y="193" width="140" height="3" fill={mixWithWhite(accent, 0.55)} />
    </svg>
  );
}
