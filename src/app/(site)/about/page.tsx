import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Lock,
  Rocket,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
  StatCard,
} from "@/components/marketing/primitives";
import { SUPPORT_EMAIL, SITE_NAME } from "@/lib/site";
import { templateCount } from "@/templates/registry";

export const metadata: Metadata = {
  title: "About — why we built CV Maker",
  description:
    "CV Maker exists to remove the formatting tax from job hunting: free, private, print-ready CV building for everyone, with no design skills required.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Why CV Maker exists: free, private, print-ready CV building with no design skills required.",
    url: "/about",
  },
};

const VALUES = [
  {
    icon: Heart,
    title: "Free where it matters",
    body: "Applying for jobs is expensive enough. Building the document itself should never be the thing that costs money, so the core product is free and stays free.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your career history is personal. CV Maker has no server of its own, so your CVs and photos never leave this browser in the first place — there is nothing for anyone else to read.",
  },
  {
    icon: Scale,
    title: "Honest previews",
    body: "What you see in the editor is a true A4 page with the template's real fonts and spacing. No misleading thumbnails, no surprises in the PDF.",
  },
  {
    icon: Sparkles,
    title: "Craft over gimmicks",
    body: "Every template is a full layout system built by hand, and every font pairing is checked for print legibility. Fifty good layouts beat five hundred recolours.",
  },
  {
    icon: Users,
    title: "Built for real people",
    body: "Career changers, graduates, returners, tradespeople, researchers. The editor assumes you are busy and not a designer — because you probably are both.",
  },
  {
    icon: Rocket,
    title: "Fast and boring, on purpose",
    body: "No AI guessing your job history, no forced sign-up wall mid-edit, no dark patterns. Just a form, a preview and a download button.",
  },
];

const STORY = [
  {
    heading: "The problem",
    body: "Formatting a CV in a word processor is a small nightmare: styles fight you, page breaks move when you add a line, and the exported PDF quietly gains headers and footers. People spend hours on layout and minutes on the words that actually get them hired.",
  },
  {
    heading: "The idea",
    body: "Separate the content from the layout completely. Store the career history as structured data, then let a template decide how to render it on a real A4 page. Change the template, keep the data. Change the data, watch the page update instantly.",
  },
  {
    heading: "The build",
    body: `CV Maker ships with ${templateCount()} hand-built templates across seven categories, a template-aware editor, live A4 rendering and clean PDF export. It runs entirely in your browser on Next.js — there is no server holding your data, so nothing to breach and nothing to sign away.`,
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[520px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title="We removed the formatting tax from job hunting"
            description="CV Maker is a free CV builder for people who would rather think about their next role than about page margins."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" size="lg">
              Build your CV
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Get in touch
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="neon-border rounded-3xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard value={`${templateCount()}`} label="Hand-built templates" hint="7 categories" />
              <StatCard value="£0" label="Cost, forever" hint="No card required" />
              <StatCard value="100%" label="Selectable PDF text" hint="ATS-friendly" />
              <StatCard value="Local" label="Stored in your browser" hint="Nothing uploaded" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                align="left"
                eyebrow="Our story"
                title="From frustration to a form and a preview"
                description="CV Maker started as a way to stop wrestling with document styles once and for all."
              />
              <div className="mt-8 space-y-6">
                {STORY.map((item) => (
                  <div key={item.heading} className="border-l-2 border-cyan-400/30 pl-5">
                    <h3 className="text-sm font-semibold tracking-wide text-cyan-300 uppercase">
                      {item.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={(index % 2) * 0.06}>
                <div className="glass h-full rounded-2xl p-5 transition hover:border-cyan-400/40">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                    <value.icon className="size-4.5" aria-hidden />
                  </span>
                  <h3 className="mt-3.5 text-sm font-semibold">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass grid gap-8 rounded-3xl p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Accessibility and privacy are not features
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">
                The editor is keyboard-operable end to end, respects reduced-motion preferences and
                labels every control. On the data side, CV Maker runs entirely in your browser: your
                CVs are kept in local storage, photos in IndexedDB, and nothing is ever uploaded.
                Deleting your account removes everything permanently.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-400">
                Read the details in our{" "}
                <Link href="/privacy-policy" className="text-cyan-300 hover:underline">
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/terms-of-service" className="text-cyan-300 hover:underline">
                  terms of service
                </Link>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white/[0.03] p-6">
              <h3 className="text-sm font-semibold tracking-wide text-ink-500 uppercase">
                Talk to a human
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                Feedback, bug reports and feature requests genuinely shape what gets built next.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              <div className="mt-6">
                <ButtonLink href="/contact" variant="secondary" size="sm">
                  Send us a message
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
