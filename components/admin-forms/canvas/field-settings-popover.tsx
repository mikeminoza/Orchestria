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
import type { FieldType, FormField } from "@/lib/forms/types";

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

function changeFieldType(field: FormField, type: FieldType): FormField {
  const base = {
    id: field.id,
    label: field.label,
    description: field.description,
    required: field.required,
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
    </div>
  );
}
