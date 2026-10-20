import type { Metadata } from "next";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your CVForge profile, avatar and account.",
  robots: { index: false, follow: false },
};

/**
 * Settings shell. The actual content is a client component because the account
 * lives in this browser's localStorage — there is nothing to fetch on the server.
 * `<ProtectedRoute>` in the chrome layout has already guaranteed a signed-in user.
 */
export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-ink-400">Manage your account details and security.</p>
      </header>

      <SettingsForm />
    </div>
  );
}
