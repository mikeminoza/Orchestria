"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { FormFieldRenderer } from "@/components/public-form/form-field-renderer";
import type { FormRecord } from "@/lib/forms/types";

export function PublicForm({ form }: { form: FormRecord }) {
  const [submitted, setSubmitted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if (submitted) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheck />
          </EmptyMedia>
          <EmptyTitle>Response recorded</EmptyTitle>
          <EmptyDescription>
            Thanks for filling out {form.title.toLowerCase()}. Your response has
            been saved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setResetKey((key) => key + 1);
            }}
          >
            Submit another response
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <form
      key={resetKey}
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <FieldGroup>
        {form.fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-6">
            <FormFieldRenderer field={field} />
            {index < form.fields.length - 1 ? <FieldSeparator /> : null}
          </div>
        ))}
      </FieldGroup>
      <Button type="submit" className="self-start">
        Submit
      </Button>
    </form>
  );
}
