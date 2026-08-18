"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Settings2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  InlineInput,
  InlineTextarea,
} from "@/components/admin-forms/canvas/inline-text";
import { FieldSettingsPopover } from "@/components/admin-forms/canvas/field-settings-popover";
import type { FormField } from "@/lib/forms/types";

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return <span className="text-destructive">*</span>;
}

function FieldControl({ field }: { field: FormField }) {
  switch (field.type) {
    case "short_text":
    case "email":
      return (
        <Input
          readOnly
          tabIndex={-1}
          placeholder={field.placeholder}
          className="pointer-events-none max-w-md"
        />
      );
    case "long_text":
      return (
        <Textarea
          readOnly
          tabIndex={-1}
          placeholder={field.placeholder}
          className="pointer-events-none max-w-md"
        />
      );
    case "single_choice":
      return (
        <RadioGroup className="pointer-events-none gap-2">
          {field.options.map((option) => (
            <Field key={option.value} orientation="horizontal">
              <RadioGroupItem tabIndex={-1} value={option.value} />
              <span className="text-sm">{option.label}</span>
            </Field>
          ))}
        </RadioGroup>
      );
    case "multi_choice":
      return (
        <div className="pointer-events-none flex flex-col gap-2">
          {field.options.map((option) => (
            <Field key={option.value} orientation="horizontal">
              <Checkbox tabIndex={-1} />
              <span className="text-sm">{option.label}</span>
            </Field>
          ))}
        </div>
      );
    case "dropdown":
      return (
        <Select>
          <SelectTrigger
            tabIndex={-1}
            className="pointer-events-none w-full max-w-md"
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    default:
      return null;
  }
}

export function CanvasField({
  field,
  index,
  fieldCount,
  onChange,
  onRemove,
  onMove,
}: {
  field: FormField;
  index: number;
  fieldCount: number;
  onChange: (field: FormField) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const [hasDescription, setHasDescription] = useState(!!field.description);

  return (
    <div className="group/field hover:bg-muted/30 relative rounded-lg p-2">
      <div className="absolute top-1 right-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-focus-within/field:opacity-100 group-hover/field:opacity-100">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Question settings"
            >
              <Settings2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <FieldSettingsPopover field={field} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={index === 0}
          onClick={() => onMove("up")}
          aria-label="Move question up"
        >
          <ChevronUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={index === fieldCount - 1}
          onClick={() => onMove("down")}
          aria-label="Move question down"
        >
          <ChevronDown />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Delete question"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="flex flex-col gap-2 pr-32">
        <div className="flex items-center gap-1">
          <InlineInput
            value={field.label}
            onChange={(event) =>
              onChange({ ...field, label: event.target.value })
            }
            placeholder="Question"
            className="text-sm font-medium"
          />
          <RequiredMark required={field.required} />
        </div>

        {hasDescription ? (
          <InlineTextarea
            value={field.description ?? ""}
            onChange={(event) =>
              onChange({ ...field, description: event.target.value })
            }
            onBlur={() => {
              if (!field.description) setHasDescription(false);
            }}
            placeholder="Description"
            className="text-muted-foreground text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => setHasDescription(true)}
            className="text-muted-foreground/60 hover:text-muted-foreground -mx-2 px-2 text-left text-xs"
          >
            + Add description
          </button>
        )}

        <div className="mt-1">
          <FieldControl field={field} />
        </div>
      </div>
    </div>
  );
}
