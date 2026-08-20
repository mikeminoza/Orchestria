"use client";

import {
  AlignLeft,
  ChevronsUpDown,
  CircleDot,
  FileUp,
  Mail,
  Plus,
  SquareCheck,
  TextCursorInput,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldType, FieldValidation, FormField } from "@/lib/forms/types";

const FIELD_TYPE_OPTIONS: {
  value: FieldType;
  label: string;
  icon: typeof TextCursorInput;
}[] = [
  { value: "short_text", label: "Short answer", icon: TextCursorInput },
  { value: "long_text", label: "Paragraph", icon: AlignLeft },
  { value: "email", label: "Email", icon: Mail },
  { value: "single_choice", label: "Multiple choice", icon: CircleDot },
  { value: "multi_choice", label: "Checkboxes", icon: SquareCheck },
  { value: "dropdown", label: "Dropdown", icon: ChevronsUpDown },
  { value: "file_upload", label: "File upload", icon: FileUp },
];

const CHOICE_TYPES: FieldType[] = ["single_choice", "multi_choice", "dropdown"];

const VALIDATION_LABELS: Record<FieldValidation["kind"], string> = {
  length: "Length",
  number: "Number",
  pattern: "Regular expression",
};

function createDefaultValidation(
  kind: FieldValidation["kind"],
): FieldValidation {
  if (kind === "pattern") return { kind: "pattern", pattern: "" };
  return { kind };
}

function changeFieldType(field: FormField, type: FieldType): FormField {
  const base = {
    id: field.id,
    label: field.label,
    description: field.description,
    required: field.required,
    labelStyle: field.labelStyle,
    descriptionStyle: field.descriptionStyle,
  };

  if (CHOICE_TYPES.includes(type)) {
    const options =
      "options" in field && field.options.length > 0
        ? field.options
        : [
            { label: "Option 1", value: "option-1" },
            { label: "Option 2", value: "option-2" },
          ];
    return {
      ...base,
      type: type as "single_choice" | "multi_choice" | "dropdown",
      options,
    };
  }

  return {
    ...base,
    type: type as "short_text" | "long_text" | "email" | "file_upload",
  };
}

export function FieldSettingsPopover({
  field,
  onChange,
}: {
  field: FormField;
  onChange: (field: FormField) => void;
}) {
  const isChoiceType = CHOICE_TYPES.includes(field.type);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Question type</Label>
        <Select
          value={field.type}
          onValueChange={(value) =>
            onChange(changeFieldType(field, value as FieldType))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FIELD_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <Icon />
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isChoiceType && "options" in field ? (
        <div className="flex flex-col gap-2">
          <Label>Options</Label>
          {field.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(event) => {
                  const options = field.options.map((current, i) =>
                    i === index
                      ? {
                          label: event.target.value,
                          value:
                            event.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, "-") || `option-${index + 1}`,
                        }
                      : current,
                  );
                  onChange({ ...field, options });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={field.options.length <= 1}
                onClick={() => {
                  const options = field.options.filter((_, i) => i !== index);
                  onChange({ ...field, options });
                }}
                aria-label="Remove option"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const nextIndex = field.options.length + 1;
              onChange({
                ...field,
                options: [
                  ...field.options,
                  {
                    label: `Option ${nextIndex}`,
                    value: `option-${nextIndex}`,
                  },
                ],
              });
            }}
          >
            <Plus data-icon="inline-start" />
            Add option
          </Button>
        </div>
      ) : null}

      {field.type === "short_text" || field.type === "long_text" ? (
        <div className="flex flex-col gap-1.5">
          <Label>Response validation</Label>
          <Select
            value={field.validation?.kind ?? "none"}
            onValueChange={(value) =>
              onChange({
                ...field,
                validation:
                  value === "none"
                    ? undefined
                    : createDefaultValidation(value as FieldValidation["kind"]),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="length">
                  {VALIDATION_LABELS.length}
                </SelectItem>
                {field.type === "short_text" ? (
                  <>
                    <SelectItem value="number">
                      {VALIDATION_LABELS.number}
                    </SelectItem>
                    <SelectItem value="pattern">
                      {VALIDATION_LABELS.pattern}
                    </SelectItem>
                  </>
                ) : null}
              </SelectGroup>
            </SelectContent>
          </Select>

          {field.validation ? (
            <div className="flex flex-col gap-2 pt-1">
              {field.validation.kind === "length" ||
              field.validation.kind === "number" ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={
                      field.validation.kind === "length" ? "Min length" : "Min"
                    }
                    value={field.validation.min ?? ""}
                    onChange={(event) => {
                      if (
                        field.validation?.kind !== "length" &&
                        field.validation?.kind !== "number"
                      )
                        return;
                      onChange({
                        ...field,
                        validation: {
                          ...field.validation,
                          min: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        },
                      });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder={
                      field.validation.kind === "length" ? "Max length" : "Max"
                    }
                    value={field.validation.max ?? ""}
                    onChange={(event) => {
                      if (
                        field.validation?.kind !== "length" &&
                        field.validation?.kind !== "number"
                      )
                        return;
                      onChange({
                        ...field,
                        validation: {
                          ...field.validation,
                          max: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        },
                      });
                    }}
                  />
                </div>
              ) : null}

              {field.validation.kind === "pattern" ? (
                <Input
                  placeholder="Regular expression"
                  value={field.validation.pattern}
                  onChange={(event) => {
                    if (field.validation?.kind !== "pattern") return;
                    onChange({
                      ...field,
                      validation: {
                        ...field.validation,
                        pattern: event.target.value,
                      },
                    });
                  }}
                />
              ) : null}

              <Input
                placeholder="Custom error message (optional)"
                value={field.validation.message ?? ""}
                onChange={(event) => {
                  if (!field.validation) return;
                  onChange({
                    ...field,
                    validation: {
                      ...field.validation,
                      message: event.target.value,
                    },
                  });
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
