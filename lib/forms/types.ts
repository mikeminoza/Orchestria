export type FieldOption = {
  label: string;
  value: string;
};

type BaseField = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
};

export type FormField =
  | (BaseField & {
      type: "short_text" | "long_text" | "email";
      placeholder?: string;
    })
  | (BaseField & {
      type: "single_choice" | "multi_choice" | "dropdown";
      options: FieldOption[];
    });

export type FieldType = FormField["type"];

export type FormStatus = "draft" | "published";

export type FormFontFamily =
  "sans" | "serif" | "mono" | "georgia" | "helvetica" | "times";

export type FormFontWeight = "normal" | "medium" | "semibold" | "bold";

export type FormBanner =
  { type: "none" } | { type: "color" } | { type: "image"; url: string };

export type FormTheme = {
  fontFamily: FormFontFamily;
  fontWeight: FormFontWeight;
  banner: FormBanner;
};

export type FormRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  accentColor: string;
  status: FormStatus;
  responseCount: number;
  updatedAt: string;
  fields: FormField[];
  theme: FormTheme;
};

export type FormAnswer = string | string[];

export type FormResponse = {
  id: string;
  formId: string;
  submittedAt: string;
  answers: Record<string, FormAnswer>;
};
