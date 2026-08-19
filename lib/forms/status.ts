import type { FormRecord } from "@/lib/forms/types";

export function isFormExpired(form: Pick<FormRecord, "expiresAt">): boolean {
  return !!form.expiresAt && new Date(form.expiresAt).getTime() < Date.now();
}

export function isFormClosed(
  form: Pick<FormRecord, "status" | "expiresAt">,
): boolean {
  return form.status === "closed" || isFormExpired(form);
}
