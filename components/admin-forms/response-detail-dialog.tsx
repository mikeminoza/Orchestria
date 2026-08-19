"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAnswer } from "@/lib/forms/format-answer";
import { stripHtml } from "@/lib/forms/rich-text";
import type { FormRecord, FormResponse } from "@/lib/forms/types";

export function ResponseDetailDialog({
  form,
  response,
  open,
  onOpenChange,
}: {
  form: FormRecord;
  response: FormResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Response details</DialogTitle>
          <DialogDescription>
            {response
              ? `Submitted ${new Date(response.submittedAt).toLocaleString()}`
              : null}
          </DialogDescription>
        </DialogHeader>

        {response ? (
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
            {form.fields
              .filter((field) => field.type !== "section")
              .map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {stripHtml(field.label)}
                  </span>
                  <span className="text-sm text-balance">
                    {formatAnswer(field, response.answers[field.id])}
                  </span>
                </div>
              ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
