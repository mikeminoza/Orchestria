import { ResponsesView } from "@/components/admin-forms/responses-view";

export default async function FormResponsesPage({
  params,
}: PageProps<"/dashboard/forms/[id]/responses">) {
  const { id } = await params;
  return <ResponsesView formId={id} />;
}
