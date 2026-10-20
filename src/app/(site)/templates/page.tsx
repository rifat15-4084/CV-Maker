import type { Metadata } from "next";
import { AuroraBackdrop, Reveal, SectionHeading } from "@/components/marketing/primitives";
import { AuthAwareCta } from "@/components/marketing/auth-aware-cta";
import { TemplateGallery } from "@/components/templates/template-gallery";
import { SITE_NAME } from "@/lib/site";
import { listTemplates, templateCount } from "@/templates/registry";

export const metadata: Metadata = {
  title: `CV templates — ${templateCount()} print-ready designs`,
  description:
    "Browse every CV Maker template: Modern, Creative, Minimal, Professional, Tech, Academic and Executive layouts. Filter by style, then start editing free.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: `CV templates — ${templateCount()} print-ready designs | ${SITE_NAME}`,
    description:
      "Browse every CV Maker template. Filter by category, preview instantly and start editing free.",
    url: "/templates",
  },
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const templates = listTemplates();

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[520px]" />
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Template gallery"
            title="Find the layout that fits the job"
            description={`${templateCount()} hand-crafted designs across seven categories. Every template is a genuinely different layout — headers, sidebars, timelines and print-tuned typography — not a colour swap.`}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <AuthAwareCta
            secondaryHref="/how-it-works"
            secondaryLabel="See how editing works"
          />
        </Reveal>

        <div className="mt-14">
          <TemplateGallery templates={templates} initialTemplateId={template} />
        </div>
      </div>
    </div>
  );
}
