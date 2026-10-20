import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/marketing/legal-document";
import { AuroraBackdrop } from "@/components/marketing/primitives";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_LAST_UPDATED_LABEL,
  TERMS_SECTIONS,
} from "@/lib/content/legal";
import { SUPPORT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The rules for using CVForge: your account, acceptable use, ownership of your CV content, availability, liability and termination.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: `Terms of service | ${SITE_NAME}`,
    description:
      "The rules for using CVForge: accounts, acceptable use, content ownership and liability.",
    url: "/terms-of-service",
  },
  other: { "article:modified_time": LEGAL_LAST_UPDATED },
};

export default function TermsOfServicePage() {
  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[380px]" />
      <LegalDocument
        eyebrow="Legal"
        title="Terms of service"
        updatedLabel={LEGAL_LAST_UPDATED_LABEL}
        intro="These terms set out the agreement between you and CVForge when you create an account or use the CV builder. They are written to be read, not to be skimmed past."
        sections={TERMS_SECTIONS}
        footer={
          <div>
            <h2 className="text-lg font-semibold">Questions about these terms</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold text-cyan-300 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className="text-cyan-300 hover:underline">
                contact form
              </Link>
              . See also our{" "}
              <Link href="/privacy-policy" className="text-cyan-300 hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        }
      />
    </div>
  );
}
