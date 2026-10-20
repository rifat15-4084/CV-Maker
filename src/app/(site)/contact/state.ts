import type { ContactInput } from "@/lib/contact/schema";

export interface ContactActionState {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors keyed by field name. */
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
}

export const INITIAL_CONTACT_STATE: ContactActionState = { status: "idle", message: "" };
