"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Check,
  Italic,
  Link2,
  Link2Off,
  RemoveFormatting,
  Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RICH_TEXT_LINK_CLASS } from "@/lib/forms/rich-text";
import { FONT_FAMILY_OPTIONS } from "@/lib/forms/theme";
import type { FormFontFamily } from "@/lib/forms/types";
import { cn } from "@/lib/utils";

export type FontControls = {
  fontFamily: FormFontFamily;
  onFontFamilyChange: (value: FormFontFamily) => void;
};

const sharedClassName = cn(
  "-mx-2 w-full rounded-md border border-transparent bg-transparent px-2 py-1",
  "transition-colors outline-none",
  "hover:border-border hover:bg-muted/40",
  "focus:border-input focus:bg-background focus:ring-ring/50 focus:ring-2",
  "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
  RICH_TEXT_LINK_CLASS,
);

type ActiveFormats = Record<"bold" | "italic" | "underline", boolean>;
type ToolbarState = {
  top: number;
  left: number;
  active: ActiveFormats;
  linkUrl: string | null;
} | null;

function readActiveFormats(): ActiveFormats {
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
  };
}

function getLinkElement(container: HTMLElement): HTMLAnchorElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const node = selection.anchorNode;
  const element = node instanceof Element ? node : node?.parentElement;
  const anchor = element?.closest("a") ?? null;
  return anchor && container.contains(anchor) ? anchor : null;
}

type LinkEditor = {
  open: boolean;
  value: string;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
};

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
  fontControls,
  onSelectOpenChange,
  linkEditor,
  toolbarRef,
}: {
  state: NonNullable<ToolbarState>;
  onCommand: (command: string, value?: string) => void;
  fontControls?: FontControls;
  onSelectOpenChange: (open: boolean) => void;
  linkEditor: LinkEditor;
  toolbarRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={toolbarRef}
      data-rich-text-toolbar
      className="bg-popover text-popover-foreground fixed z-50 flex w-fit -translate-y-full items-center gap-0.5 rounded-md border p-1 shadow-md"
      style={{ top: state.top, left: state.left }}
      // Buttons must not steal focus/selection from the editable field before
      // their onClick runs, or execCommand would have nothing to act on.
      onMouseDown={(event) => event.preventDefault()}
    >
      {fontControls ? (
        <>
          <Select
            value={fontControls.fontFamily}
            onValueChange={(value) =>
              fontControls.onFontFamilyChange(value as FormFontFamily)
            }
            onOpenChange={onSelectOpenChange}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger
                  size="sm"
                  className="w-28"
                  aria-label="Font family"
                >
                  <SelectValue />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Font family for this text</TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectGroup>
                {FONT_FAMILY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="mx-0.5 h-5" />
        </>
      ) : null}
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
      <Popover open={linkEditor.open} onOpenChange={linkEditor.onOpenChange}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={state.linkUrl ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label={state.linkUrl ? "Edit link" : "Add link"}
              >
                <Link2 />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {state.linkUrl ? "Edit link" : "Add link"}
          </TooltipContent>
        </Tooltip>
        <PopoverContent align="start" className="w-72">
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              linkEditor.onApply();
            }}
          >
            <Label htmlFor="rich-text-link-url" className="text-xs">
              Link URL
            </Label>
            <div className="flex items-center gap-1.5">
              <Input
                id="rich-text-link-url"
                autoFocus
                type="url"
                placeholder="https://example.com"
                value={linkEditor.value}
                onChange={(event) =>
                  linkEditor.onValueChange(event.target.value)
                }
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon-sm"
                    aria-label="Apply link"
                    disabled={!linkEditor.value.trim()}
                  >
                    <Check />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Apply link</TooltipContent>
              </Tooltip>
            </div>
            {state.linkUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive justify-start"
                onClick={linkEditor.onRemove}
              >
                <Link2Off data-icon="inline-start" />
                Remove link
              </Button>
            ) : null}
          </form>
        </PopoverContent>
      </Popover>
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
  fontControls,
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
  fontControls?: FontControls;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);
  const isFocused = useRef(false);
  const suppressBlur = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);
  const [toolbar, setToolbar] = useState<ToolbarState>(null);
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [linkInputValue, setLinkInputValue] = useState("");

  function handlePopoverOpenChange(open: boolean) {
    suppressBlur.current = open;
  }

  function handleLinkPopoverOpenChange(open: boolean) {
    handlePopoverOpenChange(open);
    setLinkEditorOpen(open);
    if (!open) savedRangeRef.current = null;
  }

  function openLinkEditor() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !ref.current) return;

    let range = selection.getRangeAt(0).cloneRange();
    const linkElement = getLinkElement(ref.current);
    // A collapsed caret inside an existing link should still let the whole
    // link be edited/removed, not just insert a new link at the caret.
    if (linkElement && range.collapsed) {
      range = document.createRange();
      range.selectNodeContents(linkElement);
    }

    savedRangeRef.current = range;
    setLinkInputValue(linkElement?.getAttribute("href") ?? "");
    handleLinkPopoverOpenChange(true);
  }

  function restoreSavedRange() {
    const range = savedRangeRef.current;
    if (!range) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function applyLink() {
    const url = linkInputValue.trim();
    if (!url) return;
    restoreSavedRange();
    ref.current?.focus();
    document.execCommand("createLink", false, url);
    emitChange();
    setToolbar((prev) =>
      prev ? { ...prev, linkUrl: url, active: readActiveFormats() } : prev,
    );
    handleLinkPopoverOpenChange(false);
  }

  function removeLink() {
    restoreSavedRange();
    ref.current?.focus();
    document.execCommand("unlink");
    emitChange();
    setToolbar((prev) =>
      prev ? { ...prev, linkUrl: null, active: readActiveFormats() } : prev,
    );
    handleLinkPopoverOpenChange(false);
  }

  useEffect(() => {
    if (!toolbar) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current?.contains(target)) return;
      if (toolbarRef.current?.contains(target)) return;
      // The font family Select's dropdown and the link editor Popover are
      // both portaled to <body>, outside the field and the toolbar, so they
      // need their own checks.
      const element = target instanceof Element ? target : target.parentElement;
      if (
        element?.closest(
          '[data-slot="select-content"], [data-slot="popover-content"]',
        )
      ) {
        return;
      }

      isFocused.current = false;
      setToolbar(null);
      onBlur?.();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [toolbar, onBlur]);

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
      linkUrl: getLinkElement(ref.current)?.getAttribute("href") ?? null,
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
      prev
        ? {
            ...prev,
            active: readActiveFormats(),
            linkUrl: ref.current
              ? (getLinkElement(ref.current)?.getAttribute("href") ?? null)
              : prev.linkUrl,
          }
        : prev,
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
        onBlur={(event) => {
          const relatedTarget = event.relatedTarget as Element | null;
          // Radix's Select trigger focuses itself imperatively when opened
          // and again when it closes, which would otherwise blur this field
          // and tear the whole toolbar (including the open dropdown) down.
          if (
            suppressBlur.current ||
            relatedTarget?.closest("[data-rich-text-toolbar]")
          ) {
            return;
          }
          isFocused.current = false;
          setToolbar(null);
          onBlur?.();
        }}
      />
      {toolbar
        ? createPortal(
            <FormattingToolbar
              state={toolbar}
              onCommand={handleCommand}
              fontControls={fontControls}
              onSelectOpenChange={handlePopoverOpenChange}
              linkEditor={{
                open: linkEditorOpen,
                value: linkInputValue,
                onOpenChange: (open) => {
                  if (open) openLinkEditor();
                  else handleLinkPopoverOpenChange(false);
                },
                onValueChange: setLinkInputValue,
                onApply: applyLink,
                onRemove: removeLink,
              }}
              toolbarRef={toolbarRef}
            />,
            document.body,
          )
        : null}
    </>
  );
}
