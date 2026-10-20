import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The CV Maker wordmark: a gradient monogram tile plus the two-tone name.
 *
 * The name is split on its last word so the accent always lands on the noun
 * ("CV Maker" -> "CV" + "Maker") without hardcoding either half.
 */
export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  const [lead, ...rest] = SITE_NAME.split(" ");
  const accent = rest.join(" ");

  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={`${SITE_NAME} home`}
    >
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-[0_8px_30px_-10px_rgba(56,189,248,0.9)]">
        <span className="text-sm font-black tracking-tight" aria-hidden>
          RH
        </span>
      </span>
      <span className="text-lg font-bold tracking-tight">
        {lead}
        {accent ? (
          <>
            {" "}
            <span className="text-gradient">{accent}</span>
          </>
        ) : null}
      </span>
    </Link>
  );
}
