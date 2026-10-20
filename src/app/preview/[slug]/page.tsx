import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/templates/registry";
import { TEMPLATE_MANIFEST } from "@/templates/manifest";
import { PreviewRoute } from "./preview-route";

export const metadata: Metadata = {
  title: "Template preview",
  robots: { index: false, follow: false },
};

/**
 * Renders one template at A4 with sample data.
 *
 * `generateStaticParams` pre-renders every template so the thumbnail script can
 * hit this route without waiting on a cold compile, and so the page is a plain,
 * linkable URL for design review.
 */
export function generateStaticParams() {
  return TEMPLATE_MANIFEST.map((entry) => ({ slug: entry.id }));
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTemplateConfig(slug)) notFound();
  return <PreviewRoute slug={slug} />;
}
