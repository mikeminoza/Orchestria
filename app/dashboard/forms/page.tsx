import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormsList } from "@/components/admin-forms/forms-list";

export default function FormsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage the forms your clients fill out.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus data-icon="inline-start" />
            Create form
          </Link>
        </Button>
      </div>
      <FormsList />
    </div>
  );
}
