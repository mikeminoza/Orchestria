import { sampleForms } from "@/lib/forms/sample-data";
import type { FormRecord } from "@/lib/forms/types";

export function getFormBySlug(slug: string): FormRecord {
  return (
    sampleForms.find((form) => form.slug === slug) ?? {
      ...sampleForms[0],
      slug,
    }
  );
}
