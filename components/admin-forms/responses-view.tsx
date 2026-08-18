"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, FileQuestion, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useForms } from "@/components/admin-forms/forms-store";
import { ResponsesTable } from "@/components/admin-forms/responses-table";
import { getResponsesForForm } from "@/lib/forms/sample-responses";

export function ResponsesView({ formId }: { formId: string }) {
  const { getForm } = useForms();
  const form = getForm(formId);
  const responses = useMemo(() => getResponsesForForm(formId), [formId]);

  if (!form) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Form not found</EmptyTitle>
          <EmptyDescription>This form may have been deleted.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard/forms">Back to forms</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/forms">
            <ChevronLeft data-icon="inline-start" />
            Back to forms
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/forms/${form.id}`}>Edit form</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{form.title}</h1>
        <p className="text-muted-foreground text-sm">
          {responses.length} response{responses.length === 1 ? "" : "s"}
        </p>
      </div>

      {responses.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No responses yet</EmptyTitle>
            <EmptyDescription>
              Responses will show up here once people start filling out this
              form.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ResponsesTable form={form} responses={responses} />
      )}
    </div>
  );
}
