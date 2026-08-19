import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { stripHtml } from "@/lib/forms/rich-text";
import type {
  FieldOption,
  FormField,
  FormRecord,
  FormResponse,
} from "@/lib/forms/types";

function isChoiceField(
  field: FormField,
): field is Extract<FormField, { options: FieldOption[] }> {
  return (
    field.type === "single_choice" ||
    field.type === "multi_choice" ||
    field.type === "dropdown"
  );
}

function countAnswered(field: FormField, responses: FormResponse[]): number {
  return responses.filter((response) => {
    const answer = response.answers[field.id];
    if (answer === undefined) return false;
    return Array.isArray(answer) ? answer.length > 0 : answer !== "";
  }).length;
}

function countOptionSelections(
  field: Extract<FormField, { options: FieldOption[] }>,
  responses: FormResponse[],
) {
  const counts = new Map(field.options.map((option) => [option.value, 0]));
  for (const response of responses) {
    const answer = response.answers[field.id];
    if (!answer) continue;
    const values = Array.isArray(answer) ? answer : [answer];
    for (const value of values) {
      if (counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return field.options.map((option) => ({
    label: option.label,
    count: counts.get(option.value) ?? 0,
  }));
}

function ChoiceBreakdown({
  field,
  responses,
}: {
  field: Extract<FormField, { options: FieldOption[] }>;
  responses: FormResponse[];
}) {
  const results = countOptionSelections(field, responses);
  const maxCount = Math.max(1, ...results.map((result) => result.count));

  return (
    <div className="flex flex-col gap-3">
      {results.map((result) => {
        const percentOfResponses = responses.length
          ? Math.round((result.count / responses.length) * 100)
          : 0;
        return (
          <div key={result.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span>{result.label}</span>
              <span className="text-muted-foreground">
                {result.count} ({percentOfResponses}%)
              </span>
            </div>
            <Progress value={(result.count / maxCount) * 100} />
          </div>
        );
      })}
    </div>
  );
}

function TextAnswerList({
  field,
  responses,
}: {
  field: FormField;
  responses: FormResponse[];
}) {
  const answers = responses
    .map((response) => response.answers[field.id])
    .filter(
      (answer): answer is string => typeof answer === "string" && answer !== "",
    );

  if (answers.length === 0) {
    return <p className="text-muted-foreground text-sm">No answers yet.</p>;
  }

  const visible = answers.slice(0, 10);
  const remaining = answers.length - visible.length;

  return (
    <div className="flex flex-col gap-2">
      {visible.map((answer, index) => (
        <div
          key={index}
          className="bg-muted/40 rounded-md border px-3 py-2 text-sm text-balance"
        >
          {answer}
        </div>
      ))}
      {remaining > 0 ? (
        <p className="text-muted-foreground text-xs">
          +{remaining} more response{remaining === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}

export function ResponsesSummary({
  form,
  responses,
}: {
  form: FormRecord;
  responses: FormResponse[];
}) {
  const questions = form.fields.filter((field) => field.type !== "section");

  return (
    <div className="flex flex-col gap-4">
      {questions.map((field) => {
        const answered = countAnswered(field, responses);
        return (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {stripHtml(field.label) || "Untitled question"}
              </CardTitle>
              <CardDescription>
                {answered} of {responses.length} response
                {responses.length === 1 ? "" : "s"} answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isChoiceField(field) ? (
                <ChoiceBreakdown field={field} responses={responses} />
              ) : (
                <TextAnswerList field={field} responses={responses} />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
