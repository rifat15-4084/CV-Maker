import type { Metadata } from "next";
import { AuthDivider, AuthFooterLink, AuthHeader } from "../auth-form";
import { GuestOnlyRoute } from "@/components/auth/protected-route";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to CVForge to edit your CVs, switch templates and download fresh PDFs.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <GuestOnlyRoute>
      <div className="glass rounded-3xl p-6 sm:p-8">
        <AuthHeader
          title="Welcome back"
          description="Pick up exactly where you left off — your CVs are saved in this browser."
        />

        <div className="mt-7">
          <LoginForm />
        </div>

        <div className="mt-6 space-y-3 border-t border-[var(--border-soft)] pt-5">
          <AuthFooterLink prompt="New to CVForge?" href="/signup" label="Create a free account" />
        </div>
      </div>

      <div className="mt-6">
        <AuthDivider label="local account" />
        <p className="mt-3 text-center text-xs leading-relaxed text-ink-500">
          Accounts are stored only in this browser. There is no server and no email — you can sign up
          and start working immediately.
        </p>
      </div>
    </GuestOnlyRoute>
  );
}
