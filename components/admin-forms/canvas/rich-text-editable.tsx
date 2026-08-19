"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bold, Italic, Link2, RemoveFormatting, Underline } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sharedClassName = cn(
  "-mx-2 w-full rounded-md border border-transparent bg-transparent px-2 py-1",
  "transition-colors outline-none",
  "hover:border-border hover:bg-muted/40",
  "focus:border-input focus:bg-background focus:ring-ring/50 focus:ring-2",
  "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
);

type ActiveFormats = Record<"bold" | "italic" | "underline", boolean>;
type ToolbarState = { top: number; left: number; active: ActiveFormats } | null;

function readActiveFormats(): ActiveFormats {
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
  };
}

function ToolbarButton({
  label,
  active,
  ...props
}: React.ComponentProps<typeof Button> & { label: string; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={active ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label={label}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function FormattingToolbar({
  state,
  onCommand,
}: {
  state: NonNullable<ToolbarState>;
  onCommand: (command: string, value?: string) => void;
}) {
  return (
    <div
      className="bg-popover text-popover-foreground fixed z-50 flex w-fit -translate-y-full items-center gap-0.5 rounded-md border p-1 shadow-md"
      style={{ top: state.top, left: state.left }}
      // Buttons must not steal focus/selection from the editable field before
      // their onClick runs, or execCommand would have nothing to act on.
      onMouseDown={(event) => event.preventDefault()}
    >
      <ToolbarButton
        label="Bold"
        active={state.active.bold}
        onClick={() => onCommand("bold")}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={state.active.italic}
        onClick={() => onCommand("italic")}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={state.active.underline}
        onClick={() => onCommand("underline")}
      >
        <Underline />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      <ToolbarButton
        label="Link"
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) onCommand("createLink", url);
        }}
      >
        <Link2 />
      </ToolbarButton>
      <ToolbarButton
        label="Clear formatting"
        onClick={() => onCommand("removeFormat")}
      >
        <RemoveFormatting />
      </ToolbarButton>
    </div>
  );
}

export function RichText({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  style,
  multiline = false,
  autoFocus,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);
  const isFocused = useRef(false);
  const [toolbar, setToolbar] = useState<ToolbarState>(null);

  useEffect(() => {
    if (ref.current && value !== lastEmitted.current) {
      ref.current.innerHTML = value;
      lastEmitted.current = value;
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const updateToolbar = useCallback(() => {
    if (!isFocused.current || !ref.current) return;

    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      !selection.anchorNode ||
      !ref.current.contains(selection.anchorNode)
    ) {
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    // A collapsed selection at an empty node can report an all-zero rect —
    // fall back to the field's own position so the toolbar doesn't jump to
    // the viewport corner.
    const anchorRect =
      rect.top === 0 && rect.left === 0 && rect.width === 0 && rect.height === 0
        ? ref.current.getBoundingClientRect()
        : rect;

    setToolbar({
      top: anchorRect.top - 6,
      left: anchorRect.left,
      active: readActiveFormats(),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbar);
    return () => document.removeEventListener("selectionchange", updateToolbar);
  }, [updateToolbar]);

  function emitChange() {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastEmitted.current = html;
    onChange(html);
  }

  function handleCommand(command: string, value?: string) {
    ref.current?.focus();
    document.execCommand(command, false, value);
    emitChange();
    setToolbar((prev) =>
      prev ? { ...prev, active: readActiveFormats() } : prev,
    );
  }

  return (
    <>
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline={multiline}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={cn(
          sharedClassName,
          multiline ? "" : "overflow-x-auto whitespace-nowrap",
          className,
        )}
        style={style}
        onInput={emitChange}
        onFocus={() => {
          isFocused.current = true;
          updateToolbar();
        }}
        onPaste={(event) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
        onKeyDown={(event) => {
          if (!multiline && event.key === "Enter") {
            event.preventDefault();
          }
        }}
        onBlur={() => {
          isFocused.current = false;
          setToolbar(null);
          onBlur?.();
        }}
      />
      {toolbar
        ? createPortal(
            <FormattingToolbar state={toolbar} onCommand={handleCommand} />,
            document.body,
          )
        : null}
    </>
  );
}
