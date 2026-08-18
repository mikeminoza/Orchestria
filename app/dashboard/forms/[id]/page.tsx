import { FormBuilder } from "@/components/admin-forms/form-builder";

export default async function EditFormPage({
  params,
}: PageProps<"/dashboard/forms/[id]">) {
  const { id } = await params;
  return <FormBuilder mode="edit" formId={id} />;
}
