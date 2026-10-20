import type { Metadata } from "next";
import Link from "next/link";
import { AuthFooterLink, AuthHeader } from "../auth-form";
import { GuestOnlyRoute } from "@/components/auth/protected-route";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your free account",
  description:
    "Sign up to CVForge free: 50+ print-ready templates, live preview and clean ATS-friendly PDF downloads.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <GuestOnlyRoute>
      <div className="glass rounded-3xl p-6 sm:p-8">
        <AuthHeader
          title="Create your free account"
          description="One step and you are building. No email confirmation, no card, no watermark."
        />

        <div className="mt-7">
          <SignUpForm />
        </div>

        <div className="mt-6 space-y-3 border-t border-[var(--border-soft)] pt-5">
          <AuthFooterLink prompt="Already have an account?" href="/login" label="Log in" />
          <p className="text-center text-xs leading-relaxed text-ink-500">
            By creating an account you agree to our{" "}
            <Link href="/terms-of-service" className="text-ink-300 hover:text-cyan-300">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-ink-300 hover:text-cyan-300">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}
