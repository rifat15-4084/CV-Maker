"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

/**
 * `GET /logout` — clears the local session and returns to the login screen.
 *
 * A route (rather than only a button handler) so it also works as a plain link
 * and can be bookmarked, matching the previous backend-driven behaviour.
 */
export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await logout();
      if (!cancelled) router.replace("/login");
    })();
    return () => {
      cancelled = true;
    };
  }, [logout, router]);

  return (
    <div className="glass rounded-3xl p-6 text-center sm:p-8" role="status" aria-live="polite">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/5 text-ink-400">
        <LogOut className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-lg font-semibold">Signing you out…</h1>
      <p className="mt-2 text-sm text-ink-400">Taking you back to the login screen.</p>
    </div>
  );
}
