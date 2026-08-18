import type { FormAnswer, FormField } from "@/lib/forms/types";

function resolveOptionLabel(field: FormField, value: string): string {
  if ("options" in field) {
    return (
      field.options.find((option) => option.value === value)?.label ?? value
    );
  }
  return value;
}

export function formatAnswer(
  field: FormField,
  answer: FormAnswer | undefined,
): string {
  if (answer === undefined || answer === "") {
    return "—";
  }

  if (Array.isArray(answer)) {
    if (answer.length === 0) return "—";
    return answer.map((value) => resolveOptionLabel(field, value)).join(", ");
  }

  return resolveOptionLabel(field, answer);
}
