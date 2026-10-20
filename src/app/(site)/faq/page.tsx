import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageSquare } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/marketing/accordion";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
} from "@/components/marketing/primitives";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { SUPPORT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — answers about templates, PDFs and privacy",
  description:
    "Answers to common CV Maker questions: cost, ATS-friendly PDFs, switching templates, photos, auto-save, deleting your data and CV length advice.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ | ${SITE_NAME}`,
    description:
      "Common questions about CV Maker templates, PDF export, auto-save, photos and privacy.",
    url: "/faq",
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[460px]" />
      <GridBackdrop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered without the fluff"
            description="If something is not covered here, the contact form reaches a human."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal delay={0.06}>
          <Accordion items={FAQ_ITEMS} defaultOpen={0} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="glass rounded-3xl p-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-violet-500/20 text-cyan-300">
                <MessageSquare className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Ask a question</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                Send us a message and we will reply by email, usually within a working day.
              </p>
              <div className="mt-5">
                <ButtonLink href="/contact">
                  Open the contact form
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>

            <div className="glass rounded-3xl p-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                <HelpCircle className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Read the guides</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                Our blog covers writing bullets, tailoring for a role and choosing between one and
                two pages.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <ButtonLink href="/blog" variant="secondary">
                  Visit the blog
                </ButtonLink>
                <Link
                  href="/pricing"
                  className="text-sm text-cyan-300 transition hover:underline"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-10 text-center text-sm text-ink-400">
            Prefer email? Write to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-300 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </div>
  );
}
