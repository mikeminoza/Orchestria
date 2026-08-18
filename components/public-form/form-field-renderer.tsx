import {
  Field,
  FieldDescription,
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
import type { FormField } from "@/lib/forms/types";

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return <span className="text-destructive">*</span>;
}

export function FormFieldRenderer({ field }: { field: FormField }) {
  switch (field.type) {
    case "short_text":
    case "email":
      return (
        <Field>
          <FieldLabel htmlFor={field.id}>
            {field.label}
            <RequiredMark required={field.required} />
          </FieldLabel>
          <Input
            id={field.id}
            name={field.id}
            type={field.type === "email" ? "email" : "text"}
            placeholder={field.placeholder}
            required={field.required}
          />
          {field.description ? (
            <FieldDescription>{field.description}</FieldDescription>
          ) : null}
        </Field>
      );

    case "long_text":
      return (
        <Field>
          <FieldLabel htmlFor={field.id}>
            {field.label}
            <RequiredMark required={field.required} />
          </FieldLabel>
          <Textarea
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            required={field.required}
          />
          {field.description ? (
            <FieldDescription>{field.description}</FieldDescription>
          ) : null}
        </Field>
      );

    case "single_choice":
      return (
        <FieldSet>
          <FieldLegend variant="label">
            {field.label}
            <RequiredMark required={field.required} />
          </FieldLegend>
          {field.description ? (
            <FieldDescription>{field.description}</FieldDescription>
          ) : null}
          <RadioGroup name={field.id} required={field.required}>
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
        </FieldSet>
      );

    case "multi_choice":
      return (
        <FieldSet>
          <FieldLegend variant="label">
            {field.label}
            <RequiredMark required={field.required} />
          </FieldLegend>
          {field.description ? (
            <FieldDescription>{field.description}</FieldDescription>
          ) : null}
          {field.options.map((option) => (
            <Field key={option.value} orientation="horizontal">
              <Checkbox id={`${field.id}-${option.value}`} name={field.id} />
              <FieldLabel
                htmlFor={`${field.id}-${option.value}`}
                className="font-normal"
              >
                {option.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldSet>
      );

    case "dropdown":
      return (
        <Field>
          <FieldLabel htmlFor={field.id}>
            {field.label}
            <RequiredMark required={field.required} />
          </FieldLabel>
          <Select name={field.id} required={field.required}>
            <SelectTrigger id={field.id} className="w-full">
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
            <FieldDescription>{field.description}</FieldDescription>
          ) : null}
        </Field>
      );

    default:
      return null;
  }
}
