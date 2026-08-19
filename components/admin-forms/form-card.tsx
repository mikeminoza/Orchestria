"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  CopyPlus,
  Eye,
  MoreVertical,
  Pencil,
  QrCode,
  Table2,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteFormDialog } from "@/components/admin-forms/delete-form-dialog";
import { ShareFormDialog } from "@/components/admin-forms/share-form-dialog";
import { useForms } from "@/components/admin-forms/forms-store";
import { isFormExpired } from "@/lib/forms/status";
import type { FormRecord } from "@/lib/forms/types";

function getStatusBadge(form: FormRecord): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  if (form.status === "draft") return { label: "Draft", variant: "secondary" };
  if (isFormExpired(form)) return { label: "Expired", variant: "outline" };
  if (form.status === "closed") return { label: "Closed", variant: "outline" };
  return { label: "Published", variant: "default" };
}

export function FormCard({ form }: { form: FormRecord }) {
  const { duplicateForm } = useForms();
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const statusBadge = getStatusBadge(form);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: form.accentColor }}
          />
          <CardTitle className="truncate">
            <Link
              href={`/dashboard/forms/${form.id}/responses`}
              className="hover:underline"
            >
              {form.title}
            </Link>
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2">
          {form.description}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical />
                <span className="sr-only">Form actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/forms/${form.id}`}>
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/f/${form.slug}`} target="_blank">
                  <Eye />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/forms/${form.id}/responses`}>
                  <Table2 />
                  View responses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setShareOpen(true);
                }}
              >
                <QrCode />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  const url = `${window.location.origin}/f/${form.slug}`;
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <Copy />
                {copied ? "Copied!" : "Copy link"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  duplicateForm(form.id);
                }}
              >
                <CopyPlus />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        {form.responseCount > 0 ? (
          <Link
            href={`/dashboard/forms/${form.id}/responses`}
            className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
          >
            {form.responseCount} response{form.responseCount === 1 ? "" : "s"}
          </Link>
        ) : (
          <span className="text-muted-foreground text-sm">0 responses</span>
        )}
      </CardContent>
      <CardFooter className="mt-auto justify-between bg-transparent">
        <span className="text-muted-foreground text-xs">
          Updated {new Date(form.updatedAt).toLocaleDateString()}
        </span>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/forms/${form.id}`}>Edit</Link>
        </Button>
      </CardFooter>
      <DeleteFormDialog
        formId={form.id}
        formTitle={form.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <ShareFormDialog
        slug={form.slug}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </Card>
  );
}
