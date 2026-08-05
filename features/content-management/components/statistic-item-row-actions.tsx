"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import DeleteStatisticItemDialog from "@/features/content-management/components/delete-statistic-item-dialog";
import StatisticItemFormDialog from "@/features/content-management/components/statistic-item-form-dialog";
import type { StatisticItemRow } from "@/features/content-management/types";

type StatisticItemRowActionsProps = {
  item: StatisticItemRow;
};

export default function StatisticItemRowActions({
  item,
}: StatisticItemRowActionsProps) {
  const t = useTranslations("ContentManagement.statistics.items.table");
  const locale = useLocale();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const displayName =
    locale === "ar"
      ? item.descriptionAr || item.descriptionEn || item.number
      : item.descriptionEn || item.descriptionAr || item.number;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("edit", { name: displayName })}
          onClick={() => setEditOpen(true)}
          className="size-9 rounded-xl border border-brand-primary/25 bg-brand-primary/10 p-0 text-brand-dark-blue hover:bg-brand-primary/15 hover:text-brand-dark-blue"
        >
          <CustomIcon src="/svg/edit.svg" size={16} className="text-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("delete", { name: displayName })}
          onClick={() => setDeleteOpen(true)}
          className="size-9 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-0 text-brand-accent hover:bg-brand-accent/15 hover:text-brand-accent"
        >
          <CustomIcon src="/svg/trash.svg" size={16} className="text-current" />
        </Button>
      </div>

      <StatisticItemFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        item={item}
      />
      <DeleteStatisticItemDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={item}
      />
    </>
  );
}
