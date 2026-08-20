"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Lock } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { FormFieldRenderer } from "@/components/public-form/form-field-renderer";
import { RICH_TEXT_LINK_CLASS, stripHtml } from "@/lib/forms/rich-text";
import { isFormExpired, isFormClosed } from "@/lib/forms/status";
import { getTextStyle } from "@/lib/forms/theme";
import {
  buildDefaultValues,
  buildResponseSchema,
} from "@/lib/forms/validation-schema";
import type { FormField, FormRecord, TextStyle } from "@/lib/forms/types";
import { cn } from "@/lib/utils";

type FormPage = {
  title?: string;
  titleStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  fields: FormField[];
};

function buildPages(fields: FormField[]): FormPage[] {
  const pages: FormPage[] = [{ fields: [] }];
  for (const field of fields) {
    if (field.type === "section") {
      pages.push({
        title: field.label,
        titleStyle: field.labelStyle,
        description: field.description,
        descriptionStyle: field.descriptionStyle,
        fields: [],
      });
    } else {
      pages[pages.length - 1].fields.push(field);
    }
  }
  return pages.filter(
    (page) => page.title !== undefined || page.fields.length > 0,
  );
}

export function PublicForm({ form }: { form: FormRecord }) {
  const [submitted, setSubmitted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const pages = useMemo(() => buildPages(form.fields), [form.fields]);
  const schema = useMemo(() => buildResponseSchema(form.fields), [form.fields]);
  const defaultValues = useMemo(
    () => buildDefaultValues(form.fields),
    [form.fields],
  );

  const rhfForm = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isMultiPage = pages.length > 1;
  const isLastPage = pageIndex === pages.length - 1;
  const currentPage = pages[pageIndex];

  if (isFormClosed(form)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>No longer accepting responses</EmptyTitle>
          <EmptyDescription>
            {isFormExpired(form) && form.expiresAt
              ? `This form closed on ${new Date(form.expiresAt).toLocaleString()}.`
              : "This form is closed and no longer accepting responses."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (submitted) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleCheck />
          </EmptyMedia>
          <EmptyTitle>Response recorded</EmptyTitle>
          <EmptyDescription>
            {form.confirmationMessage ? (
              <span
                className={RICH_TEXT_LINK_CLASS}
                style={getTextStyle(form.confirmationMessageStyle)}
                dangerouslySetInnerHTML={{ __html: form.confirmationMessage }}
              />
            ) : (
              <>
                Thanks for filling out {stripHtml(form.title).toLowerCase()}.
                Your response has been saved.
              </>
            )}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setPageIndex(0);
              rhfForm.reset(defaultValues);
            }}
          >
            Submit another response
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  async function goToNextPage() {
    const isValid = await rhfForm.trigger(
      currentPage.fields.map((field) => field.id),
    );
    if (!isValid) return;
    setPageIndex((index) => Math.min(index + 1, pages.length - 1));
  }

  function goToPreviousPage() {
    setPageIndex((index) => Math.max(index - 1, 0));
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={rhfForm.handleSubmit(() => setSubmitted(true))}
    >
      {isMultiPage ? (
        <div className="flex flex-col gap-1.5">
          <Progress value={((pageIndex + 1) / pages.length) * 100} />
          <p className="text-muted-foreground text-xs">
            Page {pageIndex + 1} of {pages.length}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {currentPage.title ? (
          <div className="flex flex-col gap-1">
            <h2
              className={cn("text-lg font-semibold", RICH_TEXT_LINK_CLASS)}
              style={getTextStyle(currentPage.titleStyle)}
              dangerouslySetInnerHTML={{ __html: currentPage.title }}
            />
            {currentPage.description ? (
              <p
                className={cn(
                  "text-muted-foreground text-sm",
                  RICH_TEXT_LINK_CLASS,
                )}
                style={getTextStyle(currentPage.descriptionStyle)}
                dangerouslySetInnerHTML={{ __html: currentPage.description }}
              />
            ) : null}
          </div>
        ) : null}
        <FieldGroup>
          {currentPage.fields.map((field, fieldIndex) => (
            <div key={field.id} className="flex flex-col gap-6">
              <FormFieldRenderer field={field} control={rhfForm.control} />
              {fieldIndex < currentPage.fields.length - 1 ? (
                <FieldSeparator />
              ) : null}
            </div>
          ))}
        </FieldGroup>
      </div>

      {isMultiPage ? (
        <div className="flex items-center justify-between">
          {pageIndex > 0 ? (
            <Button type="button" variant="outline" onClick={goToPreviousPage}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {isLastPage ? (
            <Button type="submit">Submit</Button>
          ) : (
            <Button type="button" onClick={goToNextPage}>
              Next
            </Button>
          )}
        </div>
      ) : (
        <Button type="submit" className="self-start">
          Submit
        </Button>
      )}
    </form>
  );
}
