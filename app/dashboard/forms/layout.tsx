import { FormsProvider } from "@/components/admin-forms/forms-store";

export default function FormsLayout({
  children,
}: LayoutProps<"/dashboard/forms">) {
  return <FormsProvider>{children}</FormsProvider>;
}
