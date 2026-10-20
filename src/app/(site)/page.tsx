import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Save,
  Download,
  FileSearch,
  Gauge,
  LayoutTemplate,
  MoveVertical,
  Palette,
  PenLine,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading, AuroraBackdrop, GridBackdrop, StatCard } from "@/components/marketing/primitives";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { FaqPreview } from "@/components/marketing/faq-preview";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { listTemplates, templateCount } from "@/templates/registry";
import { SITE_DESCRIPTION, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";
import { TESTIMONIALS } from "@/lib/content/testimonials";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free CV builder with 60 print-ready templates`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Free CV builder with 60 print-ready templates`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    description:
      "Browse 60 layouts across Modern, Creative, Minimal, Professional, Tech, Academic and Executive. Filter, search and preview before you commit.",
    points: ["Filter by category", "Hover to preview", "Swap any time"],
  },
  {
    icon: PenLine,
    title: "Fill the smart form",
    description:
      "The editor only shows the fields your template actually uses. Repeatable entries, dropdowns, drag-and-drop ordering and a live A4 preview as you type.",
    points: ["Live A4 preview", "Drag to reorder", "Inline validation"],
  },
  {
    icon: Download,
    title: "Save & download",
    description:
      "Everything auto-saves to your account. Come back a month later, tweak a bullet, and download a fresh ATS-friendly PDF named after you.",
    points: ["Auto-save", "Edit forever", "Clean A4 PDF"],
  },
];

const FEATURES = [
  { icon: Sparkles, title: "60 real templates", description: "Distinct layouts and typography for every industry — never a colour swap." },
  { icon: Gauge, title: "Instant live preview", description: "See the exact A4 page update as you type, with zoom and multi-page navigation." },
  { icon: Save, title: "Saves while you type", description: "Debounced writes about 1.5s after you stop typing, stored in your own browser." },
  { icon: MoveVertical, title: "Reorder anything", description: "Drag sections and entries into the order that tells your story best." },
  { icon: Palette, title: "Accent & typography control", description: "Curated palettes and font pairings per template, tuned for print." },
  { icon: FileSearch, title: "ATS-friendly export", description: "Real selectable text with embedded fonts — no screenshots, no headers/footers." },
  { icon: ShieldCheck, title: "Private by default", description: "There is no backend: your CVs stay in this browser and are never uploaded." },
  { icon: Wand2, title: "Sample data & JSON tools", description: "Autofill realistic sample content, reset, import or export your CV as JSON." },
];

export default function HomePage() {
  const templates = listTemplates();
  const featured = templates.slice(0, 8);
  const total = templateCount();

  return (
    <>
      {/* --------------------------------- hero -------------------------------- */}
      <section className="relative overflow-hidden">
        <AuroraBackdrop />
        <GridBackdrop />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-24 lg:pb-28">
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-cyan-300">
                <BadgeCheck className="size-3.5" aria-hidden />
                Free forever plan · {total} templates
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Forge a CV that gets you <span className="text-gradient">hired</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-400 sm:text-lg">
                Build a recruiter-ready CV in minutes. Choose from {total}+ professionally designed
                templates, watch the live preview update as you type, and download a clean,
                ATS-friendly PDF whenever you like.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/signup" size="lg">
                  Start building — it&apos;s free
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/templates" variant="secondary" size="lg">
                  Browse templates
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs tracking-wide text-ink-500 uppercase">Templates</dt>
                  <dd className="text-2xl font-bold text-gradient">{total}+</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-ink-500 uppercase">Setup time</dt>
                  <dd className="text-2xl font-bold text-gradient">5 min</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-ink-500 uppercase">Cost</dt>
                  <dd className="text-2xl font-bold text-gradient">Free</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={28}>
            <HeroMockup templateIds={featured.map((template) => template.id)} />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ how it works --------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from blank page to interview"
            description="No design skills required. CV Maker handles layout, spacing and typography so you can focus on the words."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="glass group relative h-full overflow-hidden rounded-3xl p-6">
                <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/10 blur-2xl transition group-hover:scale-125" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-cyan-300">
                      <step.icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-xs font-semibold tracking-widest text-ink-500">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{step.description}</p>
                  <ul className="mt-5 space-y-2">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-ink-300">
                        <BadgeCheck className="size-3.5 text-cyan-300" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- featured templates ------------------------ */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-72 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                align="left"
                eyebrow="Featured templates"
                title="Designs that already look like the job"
                description="Each template is a full layout system — headers, sidebars, timelines, section chrome and print-tuned typography."
              />
              <ButtonLink href="/templates" variant="secondary">
                View all {total}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((template, index) => (
              <Reveal key={template.id} delay={(index % 4) * 0.06}>
                <Link
                  href={`/templates?template=${template.id}`}
                  className="glass group block overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="aspect-[210/297] overflow-hidden bg-white">
                    <TemplateThumbnail template={template} width={320} />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{template.name}</p>
                      <p className="text-xs text-ink-500">{template.category}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-ink-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" aria-hidden />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- features ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything a job application actually needs"
            description="Built for real applications: fast to fill, safe to store, easy to export — and pleasant to come back to."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 4) * 0.05}>
              <div className="glass h-full rounded-3xl p-5 transition hover:border-cyan-400/40">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                  <feature.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------- stats -------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="neon-border rounded-3xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard value={`${total}+`} label="Print-ready templates" hint="7 categories" />
              <StatCard value="1.5s" label="Auto-save debounce" hint="Never lose work" />
              <StatCard value="A4" label="Exact print geometry" hint="210 × 297 mm" />
              <StatCard value="100%" label="Selectable PDF text" hint="ATS-friendly" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- testimonials ---------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by people who hate formatting CVs"
          />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.07}>
              <figure className="glass flex h-full flex-col rounded-3xl p-6">
                <blockquote className="text-sm leading-relaxed text-ink-300">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--border-soft)] pt-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-xs font-bold text-white">
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{testimonial.name}</span>
                    <span className="block text-xs text-ink-500">{testimonial.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <FaqPreview />

      {/* --------------------------------- CTA --------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-soft)] bg-gradient-to-br from-cyan-500/15 via-violet-500/15 to-fuchsia-500/15 p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
              <div className="aurora-bg animate-aurora" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your next role starts with a better CV
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-300">
              Create a free account, pick a template, and have a finished PDF in your downloads
              folder before your coffee goes cold.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/signup" size="lg">
                Create my free CV
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary" size="lg">
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-ink-400">
              Need help first?{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-300 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
