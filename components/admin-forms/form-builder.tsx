"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileQuestion, Plus, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { BannerEditor } from "@/components/admin-forms/canvas/banner-editor";
import { CanvasField } from "@/components/admin-forms/canvas/canvas-field";
import { DesignToolbar } from "@/components/admin-forms/canvas/design-toolbar";
import {
  InlineInput,
  InlineTextarea,
} from "@/components/admin-forms/canvas/inline-text";
import { useForms } from "@/components/admin-forms/forms-store";
import { ShareFormDialog } from "@/components/admin-forms/share-form-dialog";
import {
  ACCENT_PRESETS,
  getFontStack,
  getFontWeightValue,
} from "@/lib/forms/theme";
import type {
  FormBanner,
  FormField,
  FormFontFamily,
  FormFontWeight,
} from "@/lib/forms/types";

function createField(id: string): FormField {
  return {
    id,
    type: "short_text",
    label: "",
  };
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "untitled-form";
}

type FormBuilderProps = { mode: "create" } | { mode: "edit"; formId: string };

export function FormBuilder(props: FormBuilderProps) {
  const router = useRouter();
  const { getForm, createForm, updateForm } = useForms();

  const existing = props.mode === "edit" ? getForm(props.formId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? "Untitled form");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [accentColor, setAccentColor] = useState(
    existing?.accentColor ?? ACCENT_PRESETS[0],
  );
  const [banner, setBanner] = useState<FormBanner>(
    existing?.theme.banner ?? { type: "none" },
  );
  const [fontFamily, setFontFamily] = useState<FormFontFamily>(
    existing?.theme.fontFamily ?? "sans",
  );
  const [fontWeight, setFontWeight] = useState<FormFontWeight>(
    existing?.theme.fontWeight ?? "semibold",
  );
  const [fields, setFields] = useState<FormField[]>(
    existing?.fields ?? [createField("field-1")],
  );
  const [published, setPublished] = useState(existing?.status === "published");
  const [shareOpen, setShareOpen] = useState(false);

  if (props.mode === "edit" && !existing) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Form not found</EmptyTitle>
          <EmptyDescription>This form may have been deleted.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard/forms">Back to forms</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  function updateField(id: string, next: FormField) {
    setFields((prev) => prev.map((field) => (field.id === id ? next : field)));
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((field) => field.id !== id));
  }

  function moveField(id: string, direction: "up" | "down") {
    setFields((prev) => {
      const index = prev.findIndex((field) => field.id === id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  function handleSave() {
    const payload = {
      slug: existing?.slug ?? slugify(title),
      title,
      description,
      accentColor,
      status: published ? ("published" as const) : ("draft" as const),
      fields,
      theme: { fontFamily, fontWeight, banner },
    };

    if (props.mode === "edit") {
      updateForm(props.formId, payload);
    } else {
      createForm(payload);
    }
    router.push("/dashboard/forms");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/forms">
            <ChevronLeft data-icon="inline-start" />
            Back to forms
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-4">
          <Field orientation="horizontal" className="w-auto gap-2">
            <Switch
              id="form-published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <FieldLabel htmlFor="form-published" className="font-normal">
              Published
            </FieldLabel>
          </Field>
          {existing ? (
            <>
              <Button variant="outline" onClick={() => setShareOpen(true)}>
                <QrCode data-icon="inline-start" />
                Share
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/forms/${existing.id}/responses`}>
                  Responses
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/f/${existing.slug}`} target="_blank">
                  Preview
                </Link>
              </Button>
            </>
          ) : null}
          <Button onClick={handleSave}>Save form</Button>
        </div>
      </div>

      <DesignToolbar
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        onFontFamilyChange={setFontFamily}
        onFontWeightChange={setFontWeight}
      />

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <Card
            className="overflow-hidden py-0"
            style={{ fontFamily: getFontStack(fontFamily) }}
          >
            <BannerEditor
              banner={banner}
              accentColor={accentColor}
              onBannerChange={setBanner}
              onAccentColorChange={setAccentColor}
            />
            <CardContent className="flex flex-col gap-6 pb-(--card-spacing)">
              <div className="flex flex-col gap-1">
                <InlineInput
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Untitled form"
                  className="text-2xl"
                  style={{ fontWeight: getFontWeightValue(fontWeight) }}
                />
                <InlineTextarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Form description"
                  className="text-muted-foreground"
                />
              </div>

              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <CanvasField
                      field={field}
                      index={index}
                      fieldCount={fields.length}
                      onChange={(next) => updateField(field.id, next)}
                      onRemove={() => removeField(field.id)}
                      onMove={(direction) => moveField(field.id, direction)}
                    />
                    {index < fields.length - 1 ? <FieldSeparator /> : null}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() =>
                  setFields((prev) => [
                    ...prev,
                    createField(crypto.randomUUID()),
                  ])
                }
              >
                <Plus data-icon="inline-start" />
                Add question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {existing ? (
        <ShareFormDialog
          slug={existing.slug}
          open={shareOpen}
          onOpenChange={setShareOpen}
        />
      ) : null}
    </div>
  );
}
