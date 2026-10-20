import Link from "next/link";
import { FileText } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The CVForge wordmark: gradient glyph + name. Used in nav, auth and shell. */
export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)} aria-label={`${SITE_NAME} home`}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-[0_8px_30px_-10px_rgba(56,189,248,0.9)]">
        <FileText className="size-4.5" aria-hidden />
      </span>
      <span className="text-lg font-bold tracking-tight">
        CV<span className="text-gradient">Forge</span>
      </span>
    </Link>
  );
}
