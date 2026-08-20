import { z } from "zod";

import type { FormField } from "@/lib/forms/types";

type TextLikeField = Extract<
  FormField,
  { type: "short_text" | "long_text" | "email" | "file_upload" }
>;

function withOptionalEmpty(
  schema: z.ZodTypeAny,
  required: boolean | undefined,
): z.ZodTypeAny {
  if (required) return schema;
  return z.union([z.literal(""), schema]);
}

function buildEmailSchema(field: TextLikeField): z.ZodTypeAny {
  const schema = z
    .string()
    .trim()
    .email(field.validation?.message ?? "Enter a valid email address");
  return withOptionalEmpty(schema, field.required);
}

function buildNumberSchema(field: TextLikeField): z.ZodTypeAny {
  const validation =
    field.validation?.kind === "number" ? field.validation : undefined;
  const message = validation?.message;

  let schema = z
    .string()
    .refine((value) => value !== "" && !Number.isNaN(Number(value)), {
      message: message ?? "Enter a valid number",
    });

  if (validation?.min !== undefined) {
    const min = validation.min;
    schema = schema.refine((value) => Number(value) >= min, {
      message: message ?? `Must be at least ${min}`,
    });
  }
  if (validation?.max !== undefined) {
    const max = validation.max;
    schema = schema.refine((value) => Number(value) <= max, {
      message: message ?? `Must be at most ${max}`,
    });
  }

  return withOptionalEmpty(schema, field.required);
}

function buildTextSchema(field: TextLikeField): z.ZodTypeAny {
  const validation = field.validation;
  let core: z.ZodString = z.string();

  if (validation?.kind === "length") {
    if (validation.min !== undefined) {
      core = core.min(
        validation.min,
        validation.message ?? `Must be at least ${validation.min} characters`,
      );
    }
    if (validation.max !== undefined) {
      core = core.max(
        validation.max,
        validation.message ?? `Must be at most ${validation.max} characters`,
      );
    }
  } else if (validation?.kind === "pattern" && validation.pattern) {
    try {
      core = core.regex(
        new RegExp(validation.pattern),
        validation.message ?? "Doesn't match the required format",
      );
    } catch {
      // An admin-authored regex can be malformed -- skip rather than
      // crash every respondent's form.
    }
  }

  if (field.required) {
    const alreadyEnforcesNonEmpty =
      validation?.kind === "length" &&
      validation.min !== undefined &&
      validation.min >= 1;
    return alreadyEnforcesNonEmpty
      ? core
      : core.min(1, "This field is required");
  }

  return withOptionalEmpty(core, field.required);
}

function buildFieldSchema(field: FormField): z.ZodTypeAny {
  switch (field.type) {
    case "email":
      return buildEmailSchema(field);
    case "short_text":
      if (field.validation?.kind === "number") return buildNumberSchema(field);
      return buildTextSchema(field);
    case "long_text":
      return buildTextSchema(field);
    case "single_choice":
    case "dropdown":
      return field.required
        ? z.string().min(1, "Please select an option")
        : z.string().optional();
    case "multi_choice":
      return field.required
        ? z.array(z.string()).min(1, "Please select at least one option")
        : z.array(z.string()).optional();
    case "file_upload":
    case "section":
      return z.any().optional();
  }
}

export function buildResponseSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.type === "section") continue;
    shape[field.id] = buildFieldSchema(field);
  }
  return z.object(shape);
}

export function buildDefaultValues(
  fields: FormField[],
): Record<string, string | string[]> {
  const defaults: Record<string, string | string[]> = {};
  for (const field of fields) {
    if (field.type === "section") continue;
    defaults[field.id] = field.type === "multi_choice" ? [] : "";
  }
  return defaults;
}
