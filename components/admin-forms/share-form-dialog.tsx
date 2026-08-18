"use client";

import { useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ShareFormDialog({
  slug,
  open,
  onOpenChange,
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function getUrl() {
    return `${window.location.origin}/f/${slug}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${slug}-qr-code.png`;
    link.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share this form</DialogTitle>
          <DialogDescription>
            Anyone with this link or QR code can open and fill out the form.
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-lg border p-3">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={getUrl()}
                  size={180}
                  marginSize={0}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download data-icon="inline-start" />
                Download QR code
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={getUrl()}
                className="text-muted-foreground"
                onFocus={(event) => event.target.select()}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleCopy}
                aria-label="Copy link"
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
