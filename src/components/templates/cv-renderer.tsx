"use client";

import { useMemo } from "react";
import { normalizeCVData } from "@/lib/cv/defaults";
import type { CVData } from "@/lib/cv/schema";
import { getTemplateConfigOrFallback } from "@/templates/registry.client";
import { TemplateMount } from "./template-mount";
import { cn } from "@/lib/utils";

/**
 * Renders a CV at true A4 width, optionally scaled to fit its container.
 *
 * Templates are loaded with `next/dynamic` (`ssr: false`), so this component
 * shows a plain white A4 sheet until the template chunk resolves on the client.
 * The ready sheet carries `data-cv-ready`, which the print route waits for.
 */
export function CVRenderer({
  data,
  templateId,
  className,
  scale,
}: {
  data: CVData | unknown;
  templateId: string;
  className?: string;
  scale?: number;
}) {
  const cvData = useMemo(() => normalizeCVData(data), [data]);
  const config = getTemplateConfigOrFallback(templateId);

  const style = scale
    ? { transform: `scale(${scale})`, transformOrigin: "top left" as const }
    : undefined;

  return (
    <div
      className={cn("cv-sheet shadow-[0_30px_80px_-40px_rgba(2,6,23,0.85)]", className)}
      style={style}
      data-template={config.id}
      data-cv-ready="true"
    >
      <TemplateMount templateId={config.id} data={cvData} />
    </div>
  );
}
