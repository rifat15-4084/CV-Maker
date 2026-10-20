import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MessageSquare } from "lucide-react";
import { GithubIcon, XIcon } from "@/components/icons/brand-icons";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
} from "@/components/marketing/primitives";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — questions, bugs and feedback",
  description:
    "Get in touch with the CV Maker team. Send a message about templates, PDF export, your account or a feature request and we will reply by email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Send the CV Maker team a message about templates, PDF export, your account or a feature request.",
    url: "/contact",
  },
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    body: "Best for anything that needs detail or an attachment.",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: MessageSquare,
    title: "Use the form",
    body: "Fastest for general questions, bugs and feature requests.",
    value: "Replies within one working day",
  },
  {
    icon: Clock,
    title: "Support hours",
    body: "We read messages on working days and reply in the order they arrive.",
    value: "Mon–Fri, 9am–6pm",
  },
];

const SOCIALS = [
  {
    label: "CV Maker on X (opens in a new tab)",
    href: "https://twitter.com",
    Icon: XIcon,
  },
  {
    label: "CV Maker on GitHub (opens in a new tab)",
    href: "https://github.com",
    Icon: GithubIcon,
  },
];

export default function ContactPage() {
  const shortFaq = FAQ_ITEMS.slice(0, 4);

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[420px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Talk to the people who build it"
            description="Questions about a template, a PDF that looks odd, an account issue or an idea you want built — this reaches a human, not a ticket queue."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="space-y-4">
            {CHANNELS.map((channel, index) => (
              <Reveal key={channel.title} delay={index * 0.06}>
                <div className="glass rounded-2xl p-5">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                    <channel.icon className="size-4.5" aria-hidden />
                  </span>
                  <h2 className="mt-3.5 text-sm font-semibold">{channel.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{channel.body}</p>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="mt-2 inline-flex text-sm font-semibold text-cyan-300 hover:underline"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-ink-300">{channel.value}</p>
                  )}
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="glass rounded-2xl p-5">
                <h2 className="text-sm font-semibold">Elsewhere</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                  Announcements and tips tend to appear here first.
                </p>
                <div className="mt-3 flex gap-2">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="flex size-9 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white/5 text-ink-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl font-semibold">Maybe it is already answered</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              These come up most often. The full list lives on the{" "}
              <Link href="/faq" className="text-cyan-300 hover:underline">
                FAQ page
              </Link>
              .
            </p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              {shortFaq.map((item) => (
                <div key={item.question}>
                  <dt className="text-sm font-semibold">{item.question}</dt>
                  <dd className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-400">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
