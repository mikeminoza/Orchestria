"use client";

import { useRef, useState } from "react";
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
import { stripHtml } from "@/lib/forms/rich-text";
import { isFormExpired, isFormClosed } from "@/lib/forms/status";
import type { FormField, FormRecord } from "@/lib/forms/types";

type FormPage = { title?: string; description?: string; fields: FormField[] };

function buildPages(fields: FormField[]): FormPage[] {
  const pages: FormPage[] = [{ fields: [] }];
  for (const field of fields) {
    if (field.type === "section") {
      pages.push({
        title: field.label,
        description: field.description,
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
  const [resetKey, setResetKey] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = buildPages(form.fields);
  const isMultiPage = pages.length > 1;
  const isLastPage = pageIndex === pages.length - 1;

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
              setResetKey((key) => key + 1);
            }}
          >
            Submit another response
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  function goToNextPage() {
    const currentPage = pageRefs.current[pageIndex];
    const controls =
      currentPage?.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea") ?? [];
    for (const control of controls) {
      if (!control.reportValidity()) return;
    }
    setPageIndex((index) => Math.min(index + 1, pages.length - 1));
  }

  function goToPreviousPage() {
    setPageIndex((index) => Math.max(index - 1, 0));
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
      {isMultiPage ? (
        <div className="flex flex-col gap-1.5">
          <Progress value={((pageIndex + 1) / pages.length) * 100} />
          <p className="text-muted-foreground text-xs">
            Page {pageIndex + 1} of {pages.length}
          </p>
        </div>
      ) : null}

      {pages.map((page, index) => (
        <div
          key={index}
          ref={(element) => {
            pageRefs.current[index] = element;
          }}
          className={index === pageIndex ? "flex flex-col gap-6" : "hidden"}
        >
          {page.title ? (
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                dangerouslySetInnerHTML={{ __html: page.title }}
              />
              {page.description ? (
                <p
                  className="text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: page.description }}
                />
              ) : null}
            </div>
          ) : null}
          <FieldGroup>
            {page.fields.map((field, fieldIndex) => (
              <div key={field.id} className="flex flex-col gap-6">
                <FormFieldRenderer field={field} />
                {fieldIndex < page.fields.length - 1 ? (
                  <FieldSeparator />
                ) : null}
              </div>
            ))}
          </FieldGroup>
        </div>
      ))}

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
