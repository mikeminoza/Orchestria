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
import { ArrowUpDown, FileSpreadsheet, Search } from "lucide-react";

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
import { formatAnswer } from "@/lib/forms/format-answer";
import type { FormField, FormRecord, FormResponse } from "@/lib/forms/types";

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

function buildColumns(fields: FormField[]) {
  const fieldColumns = fields.map((field) => {
    const isExactFilter =
      field.type === "single_choice" || field.type === "dropdown";

    return columnHelper.accessor(
      (row) => formatAnswer(field, row.answers[field.id]),
      {
        id: field.id,
        header: field.label,
        filterFn: isExactFilter ? "equalsString" : "includesString",
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

  return columnHelper.columns([submittedColumn, ...fieldColumns]);
}

function exportResponsesToCsv(form: FormRecord, rows: FormResponse[]) {
  const headers = ["Submitted", ...form.fields.map((field) => field.label)];
  const lines = [
    headers,
    ...rows.map((row) => [
      new Date(row.submittedAt).toLocaleString(),
      ...form.fields.map((field) => formatAnswer(field, row.answers[field.id])),
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
}: {
  form: FormRecord;
  responses: FormResponse[];
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submittedAt", desc: true },
  ]);

  const columns = useMemo(() => buildColumns(form.fields), [form.fields]);

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
                <SelectValue placeholder={field.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All {field.label}</SelectItem>
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
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
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
