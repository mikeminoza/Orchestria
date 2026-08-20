"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RichText } from "@/components/admin-forms/canvas/rich-text-editable";
import type { FormField } from "@/lib/forms/types";

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

export function CanvasSection({
  field,
  index,
  fieldCount,
  sectionNumber,
  totalSections,
  autoFocus,
  onChange,
  onRemove,
  onMove,
}: {
  field: FormField;
  index: number;
  fieldCount: number;
  sectionNumber: number;
  totalSections: number;
  autoFocus?: boolean;
  onChange: (field: FormField) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border-primary/40 bg-primary/5 relative rounded-lg border-2 p-4 ${isDragging ? "z-20 opacity-50" : ""}`}
    >
      <div className="bg-background/80 absolute top-1 right-1 z-10 flex items-center gap-0.5 rounded-md">
        <ToolbarButton
          label="Drag to reorder"
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical />
        </ToolbarButton>
        <ToolbarButton
          label="Move section up"
          disabled={index === 0}
          onClick={() => onMove("up")}
        >
          <ChevronUp />
        </ToolbarButton>
        <ToolbarButton
          label="Move section down"
          disabled={index === fieldCount - 1}
          onClick={() => onMove("down")}
        >
          <ChevronDown />
        </ToolbarButton>
        <ToolbarButton label="Delete section" onClick={onRemove}>
          <Trash2 />
        </ToolbarButton>
      </div>

      <p className="text-primary text-xs font-medium tracking-wide uppercase">
        Section {sectionNumber} of {totalSections}
      </p>
      <div className="mt-1 flex flex-col gap-1 pr-32">
        <RichText
          value={field.label}
          onChange={(html) => onChange({ ...field, label: html })}
          placeholder="Section title"
          className="text-lg font-semibold"
          autoFocus={autoFocus}
        />
        <RichText
          value={field.description ?? ""}
          onChange={(html) => onChange({ ...field, description: html })}
          placeholder="Description (optional)"
          className="text-muted-foreground text-sm"
          multiline
        />
      </div>
    </div>
  );
}
