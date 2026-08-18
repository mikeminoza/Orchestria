import { FileQuestion } from "lucide-react";

import { GoBackButton } from "@/components/go-back-button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center px-6">
      <Empty className="max-w-md border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <GoBackButton />
        </EmptyContent>
      </Empty>
    </div>
  );
}
