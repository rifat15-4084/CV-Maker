"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";
import { authErrorMessage, useAuth } from "@/components/providers/auth-provider";
import { signUpSchema, confirmPasswordError, fieldErrors, safeNext } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";
import { AuthAlert } from "../auth-form";

const STRENGTH_STEPS = [
  { label: "6+ characters", test: (value: string) => value.length >= 6 },
  { label: "Upper & lowercase", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "A number", test: (value: string) => /\d/.test(value) },
  { label: "A symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

/** Reads `?next=` from the address bar without `useSearchParams`. */
function readNext(): string {
  if (typeof window === "undefined") return "/dashboard";
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}

export function SignUpForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const { error: toastError } = useToast();

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);

  const passed = STRENGTH_STEPS.filter((step) => step.test(password)).length;
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][passed] ?? "Strong";
  const strengthTone =
    ["bg-rose-500", "bg-rose-500", "bg-amber-500", "bg-cyan-400", "bg-emerald-400"][passed] ??
    "bg-emerald-400";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = signUpSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const nextErrors: Record<string, string> = parsed.success ? {} : fieldErrors(parsed.error);
    const mismatch = confirmPasswordError(formData.get("password"), formData.get("confirmPassword"));
    if (mismatch) Object.assign(nextErrors, mismatch);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setMessage(null);
    setPending(true);

    try {
      await signup({
        fullName: parsed.success ? parsed.data.fullName : "",
        email: parsed.success ? parsed.data.email : "",
        password: parsed.success ? parsed.data.password : "",
      });
      // Success: the account exists and the session is live.
      router.replace(readNext());
    } catch (error) {
      const text = authErrorMessage(error);
      setMessage(text);
      toastError("Could not create your account", text);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {message ? <AuthAlert>{message}</AuthAlert> : null}

      <Field label="Full name" htmlFor="signup-name" error={errors.fullName} required>
        <Input
          id="signup-name"
          name="fullName"
          autoComplete="name"
          placeholder="Alex Morgan"
          invalid={Boolean(errors.fullName)}
          required
        />
      </Field>

      <Field label="Email address" htmlFor="signup-email" error={errors.email} required>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          invalid={Boolean(errors.email)}
          required
        />
      </Field>

      <Field label="Password" htmlFor="signup-password" error={errors.password} required>
        <div className="relative">
          <Input
            id="signup-password"
            name="password"
            type={reveal ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            invalid={Boolean(errors.password)}
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setReveal((value) => !value)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-ink-500 transition hover:bg-white/10 hover:text-[var(--page-fg)]"
          >
            {reveal ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
      </Field>

      <Field
        label="Confirm password"
        htmlFor="signup-confirm"
        error={errors.confirmPassword}
        required
      >
        <Input
          id="signup-confirm"
          name="confirmPassword"
          type={reveal ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Repeat your password"
          invalid={Boolean(errors.confirmPassword)}
          required
        />
      </Field>

      {/* Password guidance — informative, not blocking. */}
      <div aria-live="polite">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-500">Password strength</span>
          <span className={cn("font-medium", passed >= 3 ? "text-emerald-300" : "text-ink-400")}>
            {password ? strengthLabel : ""}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {STRENGTH_STEPS.map((step, index) => (
            <span
              key={step.label}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index < passed ? strengthTone : "bg-white/10",
              )}
            />
          ))}
        </div>
        <ul className="mt-2.5 grid grid-cols-2 gap-1.5">
          {STRENGTH_STEPS.map((step) => {
            const ok = step.test(password);
            return (
              <li
                key={step.label}
                className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-300" : "text-ink-500")}
              >
                <span
                  aria-hidden
                  className={cn("size-1.5 rounded-full", ok ? "bg-emerald-400" : "bg-ink-600")}
                />
                {step.label}
                <span className="sr-only">{ok ? " — met" : " — not met"}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-2">
        {!pending ? <UserPlus className="size-4" aria-hidden /> : null}
        {pending ? "Creating your account…" : "Create free account"}
      </Button>
    </form>
  );
}

export type { ReactNode };
