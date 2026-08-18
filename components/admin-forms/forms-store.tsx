"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { sampleForms } from "@/lib/forms/sample-data";
import type { FormRecord } from "@/lib/forms/types";

type FormInput = Omit<FormRecord, "id" | "responseCount" | "updatedAt">;

type FormsContextValue = {
  forms: FormRecord[];
  getForm: (id: string) => FormRecord | undefined;
  createForm: (input: FormInput) => FormRecord;
  updateForm: (id: string, input: FormInput) => void;
  deleteForm: (id: string) => void;
  duplicateForm: (id: string) => void;
};

const FormsContext = createContext<FormsContextValue | null>(null);

let nextId = sampleForms.length + 1;

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [forms, setForms] = useState<FormRecord[]>(sampleForms);

  const getForm = useCallback(
    (id: string) => forms.find((form) => form.id === id),
    [forms],
  );

  const createForm = useCallback((input: FormInput) => {
    let form: FormRecord;
    setForms((prev) => {
      let slug = input.slug;
      let suffix = 2;
      while (prev.some((existing) => existing.slug === slug)) {
        slug = `${input.slug}-${suffix++}`;
      }

      form = {
        ...input,
        slug,
        id: String(nextId++),
        responseCount: 0,
        updatedAt: new Date().toISOString(),
      };
      return [form, ...prev];
    });
    return form!;
  }, []);

  const updateForm = useCallback((id: string, input: FormInput) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === id
          ? { ...form, ...input, updatedAt: new Date().toISOString() }
          : form,
      ),
    );
  }, []);

  const deleteForm = useCallback((id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
  }, []);

  const duplicateForm = useCallback((id: string) => {
    setForms((prev) => {
      const original = prev.find((form) => form.id === id);
      if (!original) return prev;

      const baseSlug = `${original.slug}-copy`;
      let slug = baseSlug;
      let suffix = 2;
      while (prev.some((form) => form.slug === slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }

      const duplicate: FormRecord = {
        ...original,
        id: String(nextId++),
        slug,
        title: `${original.title} (copy)`,
        status: "draft",
        responseCount: 0,
        updatedAt: new Date().toISOString(),
      };

      return [duplicate, ...prev];
    });
  }, []);

  const value = useMemo(
    () => ({
      forms,
      getForm,
      createForm,
      updateForm,
      deleteForm,
      duplicateForm,
    }),
    [forms, getForm, createForm, updateForm, deleteForm, duplicateForm],
  );

  return (
    <FormsContext.Provider value={value}>{children}</FormsContext.Provider>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error("useForms must be used within a FormsProvider");
  }
  return context;
}
