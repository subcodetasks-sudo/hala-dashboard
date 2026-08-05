"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InquiryTypeFormDialog from "@/features/content-management/components/inquiry-type-form-dialog";
import InquiryTypeRowActions from "@/features/content-management/components/inquiry-type-row-actions";
import { useInquiryTypes } from "@/features/content-management/queries/use-inquiry-types";
import { INQUIRY_TYPES_PER_PAGE } from "@/features/content-management/schemas/inquiry-type-form-schema";
import type { InquiryTypeRow } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

export default function InquiryTypesSection() {
  const t = useTranslations("ContentManagement.support.inquiryTypes");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, error } = useInquiryTypes(
    page,
    INQUIRY_TYPES_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const columns: DataTableColumn<InquiryTypeRow>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {locale === "ar"
            ? row.nameAr || row.nameEn || "—"
            : row.nameEn || row.nameAr || "—"}
        </span>
      ),
    },
    {
      id: "sortOrder",
      header: t("table.sortOrder"),
      cell: (row) => (
        <span className="text-brand-black">{row.sortOrder}</span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => {
        const isActive = row.status !== "inactive";
        return (
          <Badge
            className={cn(
              "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
              isActive
                ? "bg-brand-success-light text-brand-success"
                : "bg-brand-light-yellow text-brand-warning",
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                isActive ? "bg-brand-success" : "bg-brand-warning",
              )}
              aria-hidden
            />
            <span>
              {isActive ? t("table.statusActive") : t("table.statusInactive")}
            </span>
          </Badge>
        );
      },
    },
    {
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.updatedDate || "—"}
          </span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <InquiryTypeRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/tag-2.svg"
            size={20}
            className="shrink-0 text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <Button
          type="button"
          variant="outline"
          onClick={() => setCreateOpen(true)}
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("addItem")}</span>
        </Button>
      </div>

      <InquiryTypeFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/tag-2.svg"
            title={
              isError
                ? error instanceof Error
                  ? error.message
                  : t("empty.title")
                : t("empty.title")
            }
            description={isError ? " " : t("empty.description")}
          />
        }
      />

      <TablePagination
        page={data?.currentPage ?? page}
        lastPage={data?.lastPage ?? 1}
        total={data?.total}
        onPageChange={setPage}
      />
    </section>
  );
}
