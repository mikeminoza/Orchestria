"use client";

import { useMemo, useState } from "react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CircleCheck,
  CircleX,
  FileSpreadsheet,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponseRowActions } from "@/components/admin-forms/response-row-actions";
import { formatAnswer } from "@/lib/forms/format-answer";
import { stripHtml } from "@/lib/forms/rich-text";
import type {
  FieldOption,
  FormField,
  FormRecord,
  FormResponse,
} from "@/lib/forms/types";

const POSITIVE_WORDS = [
  "excellent",
  "great",
  "yes",
  "published",
  "active",
  "approved",
  "done",
];
const NEGATIVE_WORDS = [
  "poor",
  "bad",
  "no",
  "failed",
  "inactive",
  "rejected",
  "cancelled",
];

function getSentiment(label: string): "positive" | "negative" | "neutral" {
  const normalized = label.toLowerCase();
  if (POSITIVE_WORDS.some((word) => normalized.includes(word)))
    return "positive";
  if (NEGATIVE_WORDS.some((word) => normalized.includes(word)))
    return "negative";
  return "neutral";
}

function resolveOptionLabel(options: FieldOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function ChoiceAnswerCell({
  field,
  answer,
}: {
  field: Extract<FormField, { options: FieldOption[] }>;
  answer: string | string[] | undefined;
}) {
  if (!answer || (Array.isArray(answer) && answer.length === 0)) {
    return <span className="text-muted-foreground">—</span>;
  }

  const values = Array.isArray(answer) ? answer : [answer];

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => {
        const label = resolveOptionLabel(field.options, value);
        const sentiment = getSentiment(label);

        if (sentiment === "positive") {
          return (
            <Badge key={value} variant="default">
              <CircleCheck data-icon="inline-start" />
              {label}
            </Badge>
          );
        }
        if (sentiment === "negative") {
          return (
            <Badge key={value} variant="destructive">
              <CircleX data-icon="inline-start" />
              {label}
            </Badge>
          );
        }
        return (
          <Badge key={value} variant="outline">
            {label}
          </Badge>
        );
      })}
    </div>
  );
}

const tableFeatureSet = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
});

const columnHelper = createColumnHelper<typeof tableFeatureSet, FormResponse>();

function buildColumns(
  form: FormRecord,
  onDeleteResponse: (id: string) => void,
) {
  const answerableFields = form.fields.filter(
    (field) => field.type !== "section",
  );
  const fieldColumns = answerableFields.map((field, fieldIndex) => {
    const isChoiceField =
      field.type === "single_choice" ||
      field.type === "multi_choice" ||
      field.type === "dropdown";
    const isExactFilter =
      field.type === "single_choice" || field.type === "dropdown";
    const isPrimaryField = fieldIndex === 0;

    return columnHelper.accessor(
      (row) => formatAnswer(field, row.answers[field.id]),
      {
        id: field.id,
        header: stripHtml(field.label),
        filterFn: isExactFilter ? "equalsString" : "includesString",
        cell: isChoiceField
          ? (info) => (
              <ChoiceAnswerCell
                field={field}
                answer={info.row.original.answers[field.id]}
              />
            )
          : isPrimaryField
            ? (info) => (
                <span className="text-foreground font-medium">
                  {info.getValue()}
                </span>
              )
            : (info) => info.getValue(),
      },
    );
  });

  const submittedColumn = columnHelper.accessor("submittedAt", {
    id: "submittedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submitted
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    sortFn: "datetime",
  });

  const actionsColumn = columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ResponseRowActions
          form={form}
          response={row.original}
          onDelete={onDeleteResponse}
        />
      </div>
    ),
  });

  return columnHelper.columns([
    submittedColumn,
    ...fieldColumns,
    actionsColumn,
  ]);
}

function exportResponsesToCsv(form: FormRecord, rows: FormResponse[]) {
  const answerableFields = form.fields.filter(
    (field) => field.type !== "section",
  );
  const headers = [
    "Submitted",
    ...answerableFields.map((field) => stripHtml(field.label)),
  ];
  const lines = [
    headers,
    ...rows.map((row) => [
      new Date(row.submittedAt).toLocaleString(),
      ...answerableFields.map((field) =>
        formatAnswer(field, row.answers[field.id]),
      ),
    ]),
  ];
  const csv = lines
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${form.slug}-responses.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ResponsesTable({
  form,
  responses,
  onDeleteResponse,
}: {
  form: FormRecord;
  responses: FormResponse[];
  onDeleteResponse: (id: string) => void;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submittedAt", desc: true },
  ]);

  const columns = useMemo(
    () => buildColumns(form, onDeleteResponse),
    [form, onDeleteResponse],
  );

  const table = useTable({
    features: tableFeatureSet,
    data: responses,
    columns,
    state: { globalFilter, columnFilters, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  const filterableFields = form.fields.filter(
    (field): field is Extract<FormField, { options: unknown[] }> =>
      field.type === "single_choice" || field.type === "dropdown",
  );

  const filteredRowCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search responses..."
            className="w-64 pl-8"
          />
        </div>

        {filterableFields.map((field) => {
          const column = table.getColumn(field.id);
          if (!column) return null;
          const value =
            (column.getFilterValue() as string | undefined) ?? "all";

          return (
            <Select
              key={field.id}
              value={value}
              onValueChange={(next) =>
                column.setFilterValue(next === "all" ? undefined : next)
              }
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder={stripHtml(field.label)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    All {stripHtml(field.label)}
                  </SelectItem>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="ml-auto"
          onClick={() =>
            exportResponsesToCsv(
              form,
              table.getFilteredRowModel().rows.map((row) => row.original),
            )
          }
        >
          <FileSpreadsheet data-icon="inline-start" />
          Export to Excel
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {!header.isPlaceholder && (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="odd:bg-secondary/20 hover:bg-secondary/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No responses match your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {filteredRowCount} of {responses.length} response
          {responses.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
