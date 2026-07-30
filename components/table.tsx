"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string;
  selectable?: boolean;
  className?: string;
  emptyMessage?: string;
  /** Rich empty UI (icon + title + description). Takes precedence over `emptyMessage`. */
  emptyContent?: React.ReactNode;
  /** When true, renders skeleton rows instead of empty/data content. */
  isLoading?: boolean;
  /** Number of skeleton rows to show while loading. Defaults to 5. */
  skeletonRows?: number;
};

export default function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = false,
  className,
  emptyMessage = "No data",
  emptyContent,
  isLoading = false,
  skeletonRows = 5,
}: DataTableProps<T>) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const resolveRowId = React.useCallback(
    (row: T, index: number) => getRowId?.(row, index) ?? String(index),
    [getRowId]
  );

  const allSelected =
    data.length > 0 && data.every((row, i) => selected.has(resolveRowId(row, i)));

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(data.map((row, i) => resolveRowId(row, i))));
  };  

  const toggleRow = (rowId: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      return next;
    });
  };

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl bg-white", className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5 bg-brand-background hover:bg-brand-background">
            {selectable ? (
              <TableHead className="w-10 ps-6 text-start">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(value) => toggleAll(Boolean(value))}
                  aria-label="Select all"
                  disabled={isLoading}
                />
              </TableHead>
            ) : null}
            {columns.map((column, columnIndex) => (
              <TableHead
                key={column.id}
                className={cn(
                  "h-12 px-4 text-start text-xs font-bold text-brand-black",
                  !selectable && columnIndex === 0 && "ps-6",
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }, (_, rowIndex) => (
              <TableRow
                key={`skeleton-${rowIndex}`}
                className="border-b border-black/5 hover:bg-transparent"
              >
                {selectable ? (
                  <TableCell className="ps-6">
                    <Skeleton className="size-4 rounded bg-brand-gris/15" />
                  </TableCell>
                ) : null}
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "px-4 py-4 text-start",
                      !selectable && columnIndex === 0 && "ps-6",
                      column.className
                    )}
                  >
                    <Skeleton
                      className={cn(
                        "h-4 w-full max-w-[9rem] bg-brand-gris/15",
                        columnIndex % 3 === 1 && "max-w-[12rem] bg-brand-primary/10",
                        columnIndex % 3 === 2 && "max-w-[6rem] bg-brand-gris/10",
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={colSpan}
                className={cn(
                  "px-4 text-center text-brand-gris",
                  emptyContent ? "h-auto py-16" : "h-24"
                )}
              >
                {emptyContent ?? emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = resolveRowId(row, index);
              const isSelected = selected.has(rowId);

              return (
                <TableRow
                  key={rowId}
                  data-state={isSelected ? "selected" : undefined}
                  className="border-b border-black/5 hover:bg-brand-background/40 data-[state=selected]:bg-brand-background/50"
                >
                  {selectable ? (
                    <TableCell className="ps-6">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(value) =>
                          toggleRow(rowId, Boolean(value))
                        }
                        aria-label={`Select row ${rowId}`}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        "px-4 py-4 text-start",
                        !selectable && columnIndex === 0 && "ps-6",
                        column.className
                      )}
                    >
                      {column.cell
                        ? column.cell(row)
                        : column.accessor
                          ? String(row[column.accessor] ?? "")
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
