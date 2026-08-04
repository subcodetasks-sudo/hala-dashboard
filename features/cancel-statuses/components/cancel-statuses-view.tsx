"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import CancelStatusActiveBadge from "@/features/cancel-statuses/components/cancel-status-active-badge";
import CancelStatusFormDialog from "@/features/cancel-statuses/components/cancel-status-form-dialog";
import CancelStatusRowActions from "@/features/cancel-statuses/components/cancel-status-row-actions";
import CancelStatusesFilters from "@/features/cancel-statuses/components/cancel-statuses-filters";
import {
    CANCEL_STATUSES_PER_PAGE,
    DEFAULT_CANCEL_STATUS_FILTERS,
} from "@/features/cancel-statuses/mock-data";
import { useCancelStatusesList } from "@/features/cancel-statuses/queries/use-cancel-statuses-list";
import type {
    CancelStatusFilterValues,
    CancelStatusRow,
} from "@/features/cancel-statuses/types";



export default function CancelStatusesView() {
  const t = useTranslations("CancelStatuses");
  const [draftFilters, setDraftFilters] = useState<CancelStatusFilterValues>(
    DEFAULT_CANCEL_STATUS_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] =
    useState<CancelStatusFilterValues>(DEFAULT_CANCEL_STATUS_FILTERS);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, error } = useCancelStatusesList(
    appliedFilters,
    page,
    CANCEL_STATUSES_PER_PAGE,
  );

  const rows = data?.items.filter((item) => item.id !== 1) ?? [];

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(draftFilters);
  };

  const columns: DataTableColumn<CancelStatusRow>[] = [
    {
      id: "textAr",
      header: t("table.textAr"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.textAr || "—"}
        </span>
      ),
    },
    {
      id: "textEn",
      header: t("table.textEn"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.textEn || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <CancelStatusActiveBadge active={row.active} />,
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.createdDate}
          </span>
          <span className="text-xs text-brand-gris">{row.createdTime}</span>
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.updatedDate}
          </span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <CancelStatusRowActions item={row} />,
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm text-brand-gris">{t("description")}</p>
        </div>

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

      <CancelStatusFormDialog open={createOpen} onOpenChange={setCreateOpen} />


      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
          <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
            <CustomIcon
              src="/svg/tag-2.svg"
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
              iconSrc="/svg/block.svg"
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
    </div>
  );
}
