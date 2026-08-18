import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormBannerDisplay } from "@/components/public-form/form-banner";
import { getFormBySlug } from "@/components/public-form/form-schema";
import { PublicForm } from "@/components/public-form/public-form";
import { getFontStack, getFontWeightValue } from "@/lib/forms/theme";

export const metadata: Metadata = {
  title: "Customer Feedback Survey",
  robots: { index: false, follow: false },
};

export default async function PublicFormPage({
  params,
}: PageProps<"/f/[slug]">) {
  const { slug } = await params;
  const form = getFormBySlug(slug);

  return (
    <div
      className="bg-muted/40 flex min-h-screen justify-center px-4 py-10 sm:py-16"
      style={{ fontFamily: getFontStack(form.theme.fontFamily) }}
    >
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div>
          <FormBannerDisplay
            banner={form.theme.banner}
            accentColor={form.accentColor}
          />
          <Card className="rounded-t-none">
            <CardHeader>
              <CardTitle
                className="text-2xl"
                style={{
                  fontWeight: getFontWeightValue(form.theme.fontWeight),
                }}
              >
                {form.title}
              </CardTitle>
              <CardDescription>{form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <PublicForm form={form} />
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground text-center text-xs">
          Powered by{" "}
          <Link
            href="/"
            className="hover:text-foreground underline underline-offset-4"
          >
            FormBuilder
          </Link>
        </p>
      </div>
    </div>
  );
}
