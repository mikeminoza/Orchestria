"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings2,
  Trash2,
  Upload,
} from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RichText } from "@/components/admin-forms/canvas/rich-text-editable";
import { FieldSettingsPopover } from "@/components/admin-forms/canvas/field-settings-popover";
import type { FormField } from "@/lib/forms/types";

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return <span className="text-destructive">*</span>;
}

function ToolbarButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
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
    case "file_upload":
      return (
        <div className="border-input pointer-events-none flex max-w-md flex-col items-center gap-1 rounded-lg border border-dashed p-6 text-center">
          <Upload className="text-muted-foreground size-5" />
          <span className="text-sm">Click to upload or drag and drop</span>
        </div>
      );
    default:
      return null;
  }
}

export function CanvasField({
  field,
  index,
  fieldCount,
  autoFocus,
  onChange,
  onRemove,
  onMove,
}: {
  field: FormField;
  index: number;
  fieldCount: number;
  autoFocus?: boolean;
  onChange: (field: FormField) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const [hasDescription, setHasDescription] = useState(!!field.description);

  return (
    <div className="group/field border-border hover:bg-muted/30 hover:border-foreground/40 relative rounded-lg border border-dashed p-4">
      <div className="bg-background/80 absolute top-1 right-1 z-10 flex items-center gap-0.5 rounded-md">
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>Question type &amp; options</TooltipContent>
          </Tooltip>
          <PopoverContent align="end" className="p-4">
            <FieldSettingsPopover field={field} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <ToolbarButton
          label="Move question up"
          disabled={index === 0}
          onClick={() => onMove("up")}
        >
          <ChevronUp />
        </ToolbarButton>
        <ToolbarButton
          label="Move question down"
          disabled={index === fieldCount - 1}
          onClick={() => onMove("down")}
        >
          <ChevronDown />
        </ToolbarButton>
        <ToolbarButton label="Delete question" onClick={onRemove}>
          <Trash2 />
        </ToolbarButton>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 pr-32">
          <RichText
            value={field.label}
            onChange={(html) => onChange({ ...field, label: html })}
            placeholder="Question"
            className="text-sm font-medium"
            autoFocus={autoFocus}
          />
          <RequiredMark required={field.required} />
        </div>

        {hasDescription ? (
          <RichText
            value={field.description ?? ""}
            onChange={(html) => onChange({ ...field, description: html })}
            onBlur={() => {
              if (!field.description) setHasDescription(false);
            }}
            placeholder="Description"
            className="text-muted-foreground text-sm"
            multiline
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

        <div className="mt-1 flex items-center justify-end gap-2">
          <Label htmlFor={`required-${field.id}`} className="font-normal">
            Required
          </Label>
          <Switch
            id={`required-${field.id}`}
            checked={!!field.required}
            onCheckedChange={(checked) =>
              onChange({ ...field, required: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}
