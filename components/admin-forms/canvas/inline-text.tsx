"use client";

import { cn } from "@/lib/utils";

const sharedClassName = cn(
  "-mx-2 w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1",
  "transition-colors outline-none",
  "hover:border-border hover:bg-muted/40",
  "focus:border-input focus:bg-background focus:ring-ring/50 focus:ring-2",
  "placeholder:text-muted-foreground/50",
);

export function InlineInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(sharedClassName, className)} {...props} />;
}

export function InlineTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={1}
      className={cn(sharedClassName, "field-sizing-content", className)}
      {...props}
    />
  );
}
