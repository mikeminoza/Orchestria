export type FieldOption = {
  label: string;
  value: string;
};

export type TextStyle = {
  fontFamily: FormFontFamily;
};

type BaseField = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  labelStyle?: TextStyle;
  descriptionStyle?: TextStyle;
};

export type FieldValidation =
  | { kind: "length"; min?: number; max?: number; message?: string }
  | { kind: "number"; min?: number; max?: number; message?: string }
  | { kind: "pattern"; pattern: string; message?: string };

export type FormField =
  | (BaseField & {
      type: "short_text" | "long_text" | "email" | "file_upload";
      placeholder?: string;
      validation?: FieldValidation;
    })
  | (BaseField & {
      type: "single_choice" | "multi_choice" | "dropdown";
      options: FieldOption[];
    })
  | (BaseField & { type: "section" });

export type FieldType = FormField["type"];

export type FormStatus = "draft" | "published" | "closed";

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
  expiresAt?: string;
  responseCount: number;
  updatedAt: string;
  fields: FormField[];
  theme: FormTheme;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  confirmationMessage?: string;
  confirmationMessageStyle?: TextStyle;
};

export type FormAnswer = string | string[];

export type FormResponse = {
  id: string;
  formId: string;
  submittedAt: string;
  answers: Record<string, FormAnswer>;
};
