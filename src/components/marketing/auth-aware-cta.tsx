"use client";

import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

/**
 * A "start free / go to dashboard" pair that adapts to the local session.
 *
 * Client-side because the session lives in localStorage; on the server there is
 * no way to know who is signed in. While `isLoading` the label defaults to the
 * signed-out copy, which is the safer bet for a first paint.
 */
export function AuthAwareCta({
  primarySignedIn = "Go to my dashboard",
  primarySignedOut = "Start free — no card needed",
  secondaryHref,
  secondaryLabel,
}: {
  primarySignedIn?: string;
  primarySignedOut?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const { user } = useAuth();

  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
      <ButtonLink href={user ? "/dashboard" : "/signup"}>
        {user ? primarySignedIn : primarySignedOut}
      </ButtonLink>
      {secondaryHref && secondaryLabel ? (
        <ButtonLink href={secondaryHref} variant="secondary">
          {secondaryLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
