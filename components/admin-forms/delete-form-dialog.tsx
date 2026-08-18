"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForms } from "@/components/admin-forms/forms-store";

export function DeleteFormDialog({
  formId,
  formTitle,
  open,
  onOpenChange,
}: {
  formId: string;
  formTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { deleteForm } = useForms();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{formTitle}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the form and its responses. This action
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteForm(formId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
