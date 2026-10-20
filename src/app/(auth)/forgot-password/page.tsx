import type { Metadata } from "next";
import { AuthFooterLink, AuthHeader } from "../auth-form";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Reset the password for your local CVForge account.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <AuthHeader
        title="Reset your password"
        description="Confirm your email and choose a new password. No email is sent — everything happens in this browser."
      />

      <div className="mt-7">
        <ForgotPasswordForm />
      </div>

      <div className="mt-6 border-t border-[var(--border-soft)] pt-5">
        <AuthFooterLink prompt="Remembered it?" href="/login" label="Back to log in" />
      </div>
    </div>
  );
}
