"use client";

import { useState } from "react";
import { Eye, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteResponseDialog } from "@/components/admin-forms/delete-response-dialog";
import { ResponseDetailDialog } from "@/components/admin-forms/response-detail-dialog";
import type { FormRecord, FormResponse } from "@/lib/forms/types";

export function ResponseRowActions({
  form,
  response,
  onDelete,
}: {
  form: FormRecord;
  response: FormResponse;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical />
            <span className="sr-only">Response actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setViewOpen(true);
            }}
          >
            <Eye />
            View response
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponseDetailDialog
        form={form}
        response={response}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <DeleteResponseDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          onDelete(response.id);
          setDeleteOpen(false);
        }}
      />
    </>
  );
}
