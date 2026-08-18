"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ACCENT_PRESETS } from "@/lib/forms/theme";
import { cn } from "@/lib/utils";
import type { FormBanner } from "@/lib/forms/types";

const BANNER_TYPE_LABELS: Record<FormBanner["type"], string> = {
  none: "None",
  color: "Color",
  image: "Image",
};

export function BannerEditor({
  banner,
  accentColor,
  onBannerChange,
  onAccentColorChange,
}: {
  banner: FormBanner;
  accentColor: string;
  onBannerChange: (banner: FormBanner) => void;
  onAccentColorChange: (color: string) => void;
}) {
  const [imageUrlDraft, setImageUrlDraft] = useState(
    banner.type === "image" ? banner.url : "",
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Edit banner"
          className={cn(
            "group/banner relative block w-full overflow-hidden text-left transition-colors",
            banner.type === "none" &&
              "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40 flex h-14 items-center justify-center gap-1.5 border-2 border-dashed text-sm",
            banner.type === "color" && "h-28",
            banner.type === "image" && "bg-muted h-40",
          )}
          style={
            banner.type === "color"
              ? { backgroundColor: accentColor }
              : banner.type === "image"
                ? {
                    backgroundImage: `url(${banner.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
          }
        >
          {banner.type === "none" ? (
            <>
              <ImagePlus className="size-4" />
              Add banner
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover/banner:bg-black/30 group-hover/banner:opacity-100">
              <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white">
                <ImagePlus className="size-3.5" />
                Edit banner
              </span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Banner</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(BANNER_TYPE_LABELS) as FormBanner["type"][]).map(
                (type) => (
                  <Button
                    key={type}
                    type="button"
                    size="sm"
                    variant={banner.type === type ? "default" : "outline"}
                    onClick={() =>
                      onBannerChange(
                        type === "image"
                          ? { type: "image", url: imageUrlDraft }
                          : { type },
                      )
                    }
                  >
                    {BANNER_TYPE_LABELS[type]}
                  </Button>
                ),
              )}
            </div>
          </div>

          {banner.type === "color" ? (
            <div className="flex flex-col gap-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap items-center gap-2">
                {ACCENT_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Use ${color}`}
                    aria-pressed={accentColor === color}
                    onClick={() => onAccentColorChange(color)}
                    className={cn(
                      "ring-offset-background size-7 rounded-full ring-offset-2 transition-shadow",
                      accentColor === color ? "ring-ring ring-2" : "",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(event) => onAccentColorChange(event.target.value)}
                  aria-label="Custom color"
                  className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
                />
              </div>
            </div>
          ) : null}

          {banner.type === "image" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="banner-image-url">Image URL</Label>
              <Input
                id="banner-image-url"
                value={imageUrlDraft}
                onChange={(event) => {
                  setImageUrlDraft(event.target.value);
                  onBannerChange({ type: "image", url: event.target.value });
                }}
                placeholder="https://..."
              />
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
