"use client";

import { useState, type ComponentType } from "react";
import { getTemplateComponent } from "@/templates/registry.client";
import type { TemplateProps } from "@/templates/types";

/**
 * Mounts a code-split template component.
 *
 * The component is resolved once per mounted template id via a lazy state
 * initializer, so its identity stays stable across renders (React would
 * otherwise treat a freshly created `next/dynamic` component as a new type and
 * remount it, losing template state and re-fetching the chunk).
 */
export function TemplateMount({ templateId, ...props }: TemplateProps & { templateId: string }) {
  const [Component] = useState<ComponentType<TemplateProps>>(() =>
    getTemplateComponent(templateId),
  );

  return <Component {...props} />;
}
