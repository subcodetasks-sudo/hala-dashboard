"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import PackageFormDialog from "@/features/pricing/components/package-form-dialog";
import PackageRowActions from "@/features/pricing/components/package-row-actions";
import { usePackages } from "@/features/pricing/queries/use-packages";
import { PACKAGES_PER_PAGE } from "@/features/pricing/schemas/package-form-schema";
import type { PackageRow } from "@/features/pricing/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";

export default function PackagesSection() {
  const t = useTranslations("Pricing.packages");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, error } = usePackages(
    page,
    PACKAGES_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const columns: DataTableColumn<PackageRow>[] = [
    {
      id: "icon",
      header: t("table.icon"),
      cell: (row) => {
        const src = resolveMediaUrl(row.icon);
        if (!src) {
          return <span className="text-sm text-brand-gris">—</span>;
        }
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-10 rounded-xl object-cover" />
        );
      },
    },
    {
      id: "title",
      header: t("table.title"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {locale === "ar"
            ? row.titleAr || row.titleEn || "—"
            : row.titleEn || row.titleAr || "—"}
        </span>
      ),
    },
    {
      id: "price",
      header: t("table.price"),
      cell: (row) => (
        <span className="text-brand-black">{row.price}</span>
      ),
    },
    {
      id: "type",
      header: t("table.type"),
      cell: (row) => (
        <span className="text-sm text-brand-gris">
          {row.type === "whatsapp"
            ? t("table.typeWhatsapp")
            : row.type === "plan_renewal"
              ? t("table.typePlanRenewal")
              : row.type || "—"}
        </span>
      ),
    },
    {
      id: "advantages",
      header: t("table.advantages"),
      cell: (row) => (
        <span className="text-sm text-brand-gris">{row.advantages.length}</span>
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
      id: "actions",
      header: t("table.action"),
      cell: (row) => <PackageRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/dollar-circle.svg"
            size={20}
            className="shrink-0 text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>
{/* 
        <Button
          type="button"
          variant="outline"
          onClick={() => setCreateOpen(true)}
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("addItem")}</span>
        </Button> */}
      </div>

      <PackageFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/dollar-circle.svg"
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
