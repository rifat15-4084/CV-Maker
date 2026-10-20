"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";
import { authErrorMessage, useAuth } from "@/components/providers/auth-provider";
import { signInSchema, fieldErrors, safeNext } from "@/lib/auth-validation";
import { AuthAlert } from "../auth-form";

/** Reads `?next=` from the address bar without `useSearchParams`. */
function readNext(): string {
  if (typeof window === "undefined") return "/dashboard";
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { error: toastError } = useToast();

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setMessage("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setMessage(null);
    setPending(true);

    try {
      await login({
        email: parsed.data.email,
        password: parsed.data.password,
        remember: formData.get("remember") !== null,
      });
      router.replace(readNext());
    } catch (error) {
      const text = authErrorMessage(error);
      setMessage(text);
      toastError("Could not sign you in", text);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {message ? <AuthAlert>{message}</AuthAlert> : null}

      <Field label="Email address" htmlFor="login-email" error={errors.email} required>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          invalid={Boolean(errors.email)}
          required
        />
      </Field>

      <Field label="Password" htmlFor="login-password" error={errors.password} required>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={reveal ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
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

      <div className="flex items-center justify-between gap-3">
        <Checkbox name="remember" value="true" defaultChecked label="Keep me signed in" />
        <Link href="/forgot-password" className="text-sm text-cyan-300 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-2">
        {!pending ? <LogIn className="size-4" aria-hidden /> : null}
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
