"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import SupportSubmissionRowActions from "@/features/content-management/components/support-submission-row-actions";
import {
  SUPPORT_SUBMISSIONS_PER_PAGE,
  useSupportSubmissions,
} from "@/features/content-management/queries/use-support-submissions";
import type { SupportSubmissionRow } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

export default function SupportSubmissionsSection() {
  const t = useTranslations("ContentManagement.support.submissions");
  const locale = useLocale();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useSupportSubmissions(
    page,
    SUPPORT_SUBMISSIONS_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const columns: DataTableColumn<SupportSubmissionRow>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.fullName || "—"}
        </span>
      ),
    },
    {
      id: "phone",
      header: t("table.phone"),
      cell: (row) => (
        <span className="text-sm text-brand-gris" dir="ltr">
          {row.phone || "—"}
        </span>
      ),
    },
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <span className="text-sm text-brand-black" dir="ltr">
          {row.orderNumber || "—"}
        </span>
      ),
    },
    {
      id: "inquiryType",
      header: t("table.inquiryType"),
      cell: (row) => (
        <span className="text-sm text-brand-black">
          {locale === "ar"
            ? row.inquiryTypeNameAr || row.inquiryTypeNameEn || "—"
            : row.inquiryTypeNameEn || row.inquiryTypeNameAr || "—"}
        </span>
      ),
    },
    {
      id: "message",
      header: t("table.message"),
      cell: (row) => (
        <span className="line-clamp-2 max-w-56 text-sm text-brand-gris">
          {row.message || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => {
        const isNew = row.status === "new";
        return (
          <Badge
            className={cn(
              "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
              isNew
                ? "bg-brand-primary/15 text-brand-primary"
                : "bg-brand-success-light text-brand-success",
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                isNew ? "bg-brand-primary" : "bg-brand-success",
              )}
              aria-hidden
            />
            <span>{isNew ? t("table.statusNew") : t("table.statusRead")}</span>
          </Badge>
        );
      },
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.createdDate || "—"}
          </span>
          <span className="text-xs text-brand-gris">{row.createdTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <SupportSubmissionRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/directbox-notif.svg"
            size={20}
            className="shrink-0 text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/directbox-notif.svg"
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
