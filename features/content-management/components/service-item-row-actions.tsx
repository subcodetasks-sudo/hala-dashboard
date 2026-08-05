"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import DeleteServiceItemDialog from "@/features/content-management/components/delete-service-item-dialog";
import ServiceItemFormDialog from "@/features/content-management/components/service-item-form-dialog";
import ViewServiceItemDialog from "@/features/content-management/components/view-service-item-dialog";
import type { ServiceItemRow } from "@/features/content-management/types";

type ServiceItemRowActionsProps = {
  item: ServiceItemRow;
};

export default function ServiceItemRowActions({
  item,
}: ServiceItemRowActionsProps) {
  const t = useTranslations("ContentManagement.services.items.table");
  const locale = useLocale();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const displayName =
    locale === "ar"
      ? item.titleAr || item.titleEn
      : item.titleEn || item.titleAr;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("view", { name: displayName })}
          onClick={() => setViewOpen(true)}
          className="size-9 rounded-xl border border-brand-primary/20 bg-brand-background p-0 text-brand-black hover:bg-brand-background hover:text-brand-black"
        >
          <CustomIcon src="/svg/eye.svg" size={16} className="text-current" />
        </Button>
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

      <ViewServiceItemDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        item={item}
      />
      <ServiceItemFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        item={item}
      />
      <DeleteServiceItemDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={item}
      />
    </>
  );
}
