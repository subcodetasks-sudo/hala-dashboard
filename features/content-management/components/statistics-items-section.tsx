"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import StatisticItemFormDialog from "@/features/content-management/components/statistic-item-form-dialog";
import StatisticItemRowActions from "@/features/content-management/components/statistic-item-row-actions";
import { useStatisticsItems } from "@/features/content-management/queries/use-statistics-items";
import { STATISTICS_ITEMS_PER_PAGE } from "@/features/content-management/schemas/statistic-item-form-schema";
import type { StatisticItemRow } from "@/features/content-management/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";

export default function StatisticsItemsSection() {
  const t = useTranslations("ContentManagement.statistics.items");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, error } = useStatisticsItems(
    page,
    STATISTICS_ITEMS_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const columns: DataTableColumn<StatisticItemRow>[] = [
    {
      id: "image",
      header: t("table.image"),
      cell: (row) => {
        const src = resolveMediaUrl(row.image);
        if (!src) {
          return <span className="text-sm text-brand-gris">—</span>;
        }
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="size-10 rounded-xl object-cover"
          />
        );
      },
    },
    {
      id: "number",
      header: t("table.number"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">{row.number}</span>
      ),
    },
    {
      id: "description",
      header: t("table.description"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {locale === "ar"
            ? row.descriptionAr || row.descriptionEn || "—"
            : row.descriptionEn || row.descriptionAr || "—"}
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
      cell: (row) => <StatisticItemRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/chart.svg"
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

      <StatisticItemFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/chart.svg"
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
