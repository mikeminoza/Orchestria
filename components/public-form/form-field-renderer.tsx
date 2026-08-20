import { Controller, type Control } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RICH_TEXT_LINK_CLASS } from "@/lib/forms/rich-text";
import { getTextStyle } from "@/lib/forms/theme";
import type { FormField } from "@/lib/forms/types";

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return <span className="text-destructive">*</span>;
}

export function FormFieldRenderer({
  field,
  control,
}: {
  field: FormField;
  control: Control;
}) {
  switch (field.type) {
    case "short_text":
    case "email":
      return (
        <Controller
          control={control}
          name={field.id}
          render={({ field: rhfField, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor={field.id}>
                <span
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.labelStyle)}
                  dangerouslySetInnerHTML={{ __html: field.label }}
                />
                <RequiredMark required={field.required} />
              </FieldLabel>
              <Input
                id={field.id}
                type={
                  field.type === "email"
                    ? "email"
                    : field.validation?.kind === "number"
                      ? "number"
                      : "text"
                }
                placeholder={field.placeholder}
                aria-invalid={!!fieldState.error}
                {...rhfField}
              />
              {field.description ? (
                <FieldDescription
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.descriptionStyle)}
                  dangerouslySetInnerHTML={{ __html: field.description }}
                />
              ) : null}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      );

    case "long_text":
      return (
        <Controller
          control={control}
          name={field.id}
          render={({ field: rhfField, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor={field.id}>
                <span
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.labelStyle)}
                  dangerouslySetInnerHTML={{ __html: field.label }}
                />
                <RequiredMark required={field.required} />
              </FieldLabel>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                aria-invalid={!!fieldState.error}
                {...rhfField}
              />
              {field.description ? (
                <FieldDescription
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.descriptionStyle)}
                  dangerouslySetInnerHTML={{ __html: field.description }}
                />
              ) : null}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      );

    case "single_choice":
      return (
        <Controller
          control={control}
          name={field.id}
          render={({ field: rhfField, fieldState }) => (
            <FieldSet data-invalid={!!fieldState.error}>
              <FieldLegend variant="label">
                <span
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.labelStyle)}
                  dangerouslySetInnerHTML={{ __html: field.label }}
                />
                <RequiredMark required={field.required} />
              </FieldLegend>
              {field.description ? (
                <FieldDescription
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.descriptionStyle)}
                  dangerouslySetInnerHTML={{ __html: field.description }}
                />
              ) : null}
              <RadioGroup
                value={rhfField.value}
                onValueChange={rhfField.onChange}
              >
                {field.options.map((option) => (
                  <Field key={option.value} orientation="horizontal">
                    <RadioGroupItem
                      id={`${field.id}-${option.value}`}
                      value={option.value}
                    />
                    <FieldLabel
                      htmlFor={`${field.id}-${option.value}`}
                      className="font-normal"
                    >
                      {option.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </FieldSet>
          )}
        />
      );

    case "multi_choice":
      return (
        <Controller
          control={control}
          name={field.id}
          render={({ field: rhfField, fieldState }) => {
            const values: string[] = rhfField.value ?? [];
            return (
              <FieldSet data-invalid={!!fieldState.error}>
                <FieldLegend variant="label">
                  <span
                    className={RICH_TEXT_LINK_CLASS}
                    style={getTextStyle(field.labelStyle)}
                    dangerouslySetInnerHTML={{ __html: field.label }}
                  />
                  <RequiredMark required={field.required} />
                </FieldLegend>
                {field.description ? (
                  <FieldDescription
                    className={RICH_TEXT_LINK_CLASS}
                    style={getTextStyle(field.descriptionStyle)}
                    dangerouslySetInnerHTML={{ __html: field.description }}
                  />
                ) : null}
                {field.options.map((option) => (
                  <Field key={option.value} orientation="horizontal">
                    <Checkbox
                      id={`${field.id}-${option.value}`}
                      checked={values.includes(option.value)}
                      onCheckedChange={(checked) => {
                        rhfField.onChange(
                          checked
                            ? [...values, option.value]
                            : values.filter((value) => value !== option.value),
                        );
                      }}
                    />
                    <FieldLabel
                      htmlFor={`${field.id}-${option.value}`}
                      className="font-normal"
                    >
                      {option.label}
                    </FieldLabel>
                  </Field>
                ))}
                <FieldError errors={[fieldState.error]} />
              </FieldSet>
            );
          }}
        />
      );

    case "dropdown":
      return (
        <Controller
          control={control}
          name={field.id}
          render={({ field: rhfField, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor={field.id}>
                <span
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.labelStyle)}
                  dangerouslySetInnerHTML={{ __html: field.label }}
                />
                <RequiredMark required={field.required} />
              </FieldLabel>
              <Select value={rhfField.value} onValueChange={rhfField.onChange}>
                <SelectTrigger
                  id={field.id}
                  className="w-full"
                  aria-invalid={!!fieldState.error}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {field.description ? (
                <FieldDescription
                  className={RICH_TEXT_LINK_CLASS}
                  style={getTextStyle(field.descriptionStyle)}
                  dangerouslySetInnerHTML={{ __html: field.description }}
                />
              ) : null}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      );

    case "file_upload":
      return (
        <Field>
          <FieldLabel htmlFor={field.id}>
            <span
              className={RICH_TEXT_LINK_CLASS}
              style={getTextStyle(field.labelStyle)}
              dangerouslySetInnerHTML={{ __html: field.label }}
            />
            <RequiredMark required={field.required} />
          </FieldLabel>
          <Input id={field.id} name={field.id} type="file" />
          {field.description ? (
            <FieldDescription
              className={RICH_TEXT_LINK_CLASS}
              style={getTextStyle(field.descriptionStyle)}
              dangerouslySetInnerHTML={{ __html: field.description }}
            />
          ) : null}
        </Field>
      );

    default:
      return null;
  }
}
