"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suppressCloseRef = useRef(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  function openFilePicker() {
    // Opening the native file dialog steals window focus, which makes the
    // popover's own dismissable layer think focus left it and close itself
    // before the user ever sees the picker. Suppress that one close request,
    // then clear the guard once the window regains focus (dialog dismissed,
    // whether a file was chosen or the picker was cancelled). The focus event
    // isn't guaranteed across every browser/OS combination, so a timeout
    // backstops it - otherwise a missed event would wedge the popover open.
    suppressCloseRef.current = true;
    fileInputRef.current?.click();

    let cleared = false;
    const clearSuppress = () => {
      if (cleared) return;
      cleared = true;
      suppressCloseRef.current = false;
    };
    window.addEventListener("focus", clearSuppress, { once: true });
    window.setTimeout(clearSuppress, 1000);
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onBannerChange({ type: "image", url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(next) => {
        if (!next && suppressCloseRef.current) return;
        setPopoverOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Edit banner"
          className={cn(
            "group/banner relative block w-full overflow-hidden text-left transition-colors",
            banner.type === "none" &&
              "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40 flex h-16 items-center justify-center gap-1.5 border-2 border-dashed text-sm",
            banner.type === "color" && "h-36",
            banner.type === "image" && "bg-muted h-52",
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
            <>
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover/banner:bg-black/20" />
              <span className="bg-background/90 text-foreground absolute top-2 right-2 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium shadow-sm">
                <ImagePlus className="size-3.5" />
                Edit banner
              </span>
            </>
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
                    onClick={() => {
                      if (type === "image") {
                        openFilePicker();
                      } else {
                        onBannerChange({ type });
                      }
                    }}
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
            <div className="flex flex-col gap-2">
              {banner.url ? (
                <div
                  className="bg-muted h-20 w-full rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${banner.url})` }}
                />
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFilePicker}
              >
                <Upload data-icon="inline-start" />
                {banner.url ? "Replace image" : "Upload image"}
              </Button>
              {uploadError ? (
                <p className="text-destructive text-xs">{uploadError}</p>
              ) : null}
            </div>
          ) : null}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
