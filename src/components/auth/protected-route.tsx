"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthSkeleton } from "./auth-skeleton";

/**
 * Client-side route guard.
 *
 * A browser-only app cannot protect routes in middleware — the server never sees
 * localStorage — so protection has to happen after hydration. The session is
 * read in an effect, and a skeleton is shown while `isLoading`, which is what
 * keeps this hydration-safe.
 *
 * The current query string is read from `window.location.search` inside the
 * effect rather than with `useSearchParams`, so this guard can wrap a whole
 * layout without forcing every page beneath it into a Suspense boundary.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || user) return;
    const query = typeof window === "undefined" ? "" : window.location.search;
    const target = `${pathname}${query}`;
    router.replace(`/login?next=${encodeURIComponent(target)}`);
  }, [isLoading, user, pathname, router]);

  // Never render protected content before the session is known.
  if (isLoading || !user) return <AuthSkeleton />;

  return <>{children}</>;
}

/**
 * Inverse guard for the auth pages: a signed-in visitor is sent to the
 * dashboard instead of seeing login/signup forms.
 */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    router.replace("/dashboard");
  }, [isLoading, user, router]);

  if (isLoading || user) return <AuthSkeleton />;

  return <>{children}</>;
}
