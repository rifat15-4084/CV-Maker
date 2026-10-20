"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Heading block shared by every auth page. */
export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{description}</p>
    </div>
  );
}

/** Non-field error banner used inside auth forms. */
export function AuthAlert({
  kind = "error",
  children,
}: {
  kind?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm",
        kind === "error"
          ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      )}
    >
      {kind === "error" ? (
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      ) : null}
      <span>{children}</span>
    </div>
  );
}

/** Divider with centred label, used above OAuth buttons. */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-[var(--border-soft)]" />
      <span className="text-xs tracking-wide text-ink-500 uppercase">{label}</span>
      <span className="h-px flex-1 bg-[var(--border-soft)]" />
    </div>
  );
}

export function AuthFooterLink({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="text-center text-sm text-ink-400">
      {prompt}{" "}
      <Link href={href} className="font-semibold text-cyan-300 hover:underline">
        {label}
      </Link>
    </p>
  );
}
