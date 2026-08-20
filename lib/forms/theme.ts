import type { CSSProperties } from "react";

import type { FormFontFamily, TextStyle } from "@/lib/forms/types";

export const ACCENT_PRESETS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#ec4899",
  "#0ea5e9",
  "#eab308",
];

export const FONT_FAMILY_OPTIONS: {
  value: FormFontFamily;
  label: string;
  stack: string;
}[] = [
  { value: "sans", label: "Sans", stack: "var(--font-sans)" },
  { value: "serif", label: "Serif", stack: "var(--font-serif)" },
  { value: "mono", label: "Monospace", stack: "var(--font-mono)" },
  {
    value: "georgia",
    label: "Georgia",
    stack: "Georgia, 'Times New Roman', serif",
  },
  {
    value: "helvetica",
    label: "Helvetica",
    stack: "Helvetica, Arial, sans-serif",
  },
  {
    value: "times",
    label: "Times New Roman",
    stack: "'Times New Roman', Times, serif",
  },
];

export function getFontStack(family: FormFontFamily): string {
  return (
    FONT_FAMILY_OPTIONS.find((option) => option.value === family)?.stack ??
    "inherit"
  );
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: "sans",
};

export function getTextStyle(style: TextStyle | undefined): CSSProperties {
  const resolved = style ?? DEFAULT_TEXT_STYLE;
  return {
    fontFamily: getFontStack(resolved.fontFamily),
  };
}
