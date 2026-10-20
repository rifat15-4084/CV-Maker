import Link from "next/link";
import { FileText } from "lucide-react";
import { FOOTER_GROUPS, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";
import { templateCount } from "@/templates/registry";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";

export function Footer() {
  const year = new Date().getFullYear();
  const count = templateCount();

  return (
    <footer className="site-footer relative mt-24 border-t border-[var(--border-soft)]">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white">
                <FileText className="size-4.5" aria-hidden />
              </span>
              <span className="text-lg font-bold tracking-tight">
                CV<span className="text-gradient">Forge</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              Build a professional CV with {count}+ print-ready templates. Free to use, saved to
              your account, exportable as a clean ATS-friendly PDF at any time.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink href="https://github.com" label="GitHub">
                <GithubIcon className="size-4" />
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <LinkedinIcon className="size-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="X (Twitter)">
                <XIcon className="size-4" />
              </SocialLink>
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-[var(--page-fg)]">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 transition hover:text-cyan-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-soft)] pt-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>
            Questions?{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-300 hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="glass flex size-9 items-center justify-center rounded-xl text-ink-400 transition hover:text-cyan-300"
    >
      {children}
    </a>
  );
}
