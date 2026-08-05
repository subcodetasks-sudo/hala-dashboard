"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import StepItemFormDialog from "@/features/content-management/components/step-item-form-dialog";
import StepItemRowActions from "@/features/content-management/components/step-item-row-actions";
import { useStepsItems } from "@/features/content-management/queries/use-steps-items";
import type { StepItemRow } from "@/features/content-management/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";

export default function WorkStepsItemsSection() {
  const t = useTranslations("ContentManagement.workSteps.items");
  const locale = useLocale();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, error } = useStepsItems();
  const rows = data?.items ?? [];

  const columns: DataTableColumn<StepItemRow>[] = [
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
          <img src={src} alt="" className="size-10 rounded-xl object-cover" />
        );
      },
    },
    {
      id: "stepNumber",
      header: t("table.stepNumber"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">{row.stepNumber}</span>
      ),
    },
    {
      id: "stepName",
      header: t("table.stepName"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {locale === "ar"
            ? row.stepNameAr || row.stepNameEn || "—"
            : row.stepNameEn || row.stepNameAr || "—"}
        </span>
      ),
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
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">{row.updatedDate}</span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <StepItemRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/routing-2.svg"
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

      <StepItemFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/routing-2.svg"
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
    </section>
  );
}
