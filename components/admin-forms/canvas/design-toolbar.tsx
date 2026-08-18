"use client";

import { Type } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS } from "@/lib/forms/theme";
import type { FormFontFamily, FormFontWeight } from "@/lib/forms/types";

export function DesignToolbar({
  fontFamily,
  fontWeight,
  onFontFamilyChange,
  onFontWeightChange,
}: {
  fontFamily: FormFontFamily;
  fontWeight: FormFontWeight;
  onFontFamilyChange: (value: FormFontFamily) => void;
  onFontWeightChange: (value: FormFontWeight) => void;
}) {
  return (
    <div className="bg-card flex flex-wrap items-center gap-2 rounded-lg border p-2">
      <Type className="text-muted-foreground mx-1 size-4" aria-hidden />
      <Select
        value={fontFamily}
        onValueChange={(value) => onFontFamilyChange(value as FormFontFamily)}
      >
        <SelectTrigger className="w-40" aria-label="Font family">
          <SelectValue />
        </SelectTrigger>
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
      <Select
        value={fontWeight}
        onValueChange={(value) => onFontWeightChange(value as FormFontWeight)}
      >
        <SelectTrigger className="w-36" aria-label="Font weight">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FONT_WEIGHT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
