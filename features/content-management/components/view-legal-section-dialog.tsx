"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LegalSectionRow } from "@/features/content-management/types";

type ViewLegalSectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LegalSectionRow | null;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl bg-brand-background px-4 py-3 text-start">
      <span className="text-xs font-medium text-brand-gris">{label}</span>
      <div className="min-w-0 text-sm font-semibold text-brand-black">
        {children}
      </div>
    </div>
  );
}

export default function ViewLegalSectionDialog({
  open,
  onOpenChange,
  item,
}: ViewLegalSectionDialogProps) {
  const t = useTranslations("ContentManagement.legal.sections.viewDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border-none bg-white p-0 ring-0 sm:max-w-5xl max-h-[90vh]"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <div className="mx-auto w-9/10 border-b border-black/10" />

        <div className="flex min-w-0 flex-col gap-3 px-5 py-5">
          {item ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow label={t("titleAr")}>{item.titleAr || "—"}</DetailRow>
                <DetailRow label={t("titleEn")}>{item.titleEn || "—"}</DetailRow>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow label={t("descriptionAr")}>
                  {item.descriptionAr || "—"}
                </DetailRow>
                <DetailRow label={t("descriptionEn")}>
                  {item.descriptionEn || "—"}
                </DetailRow>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow label={t("contentAr")}>
                  {item.contentAr ? (
                    <div
                      className="prose prose-sm max-w-none text-start font-normal [&_p]:my-1"
                      dangerouslySetInnerHTML={{ __html: item.contentAr }}
                    />
                  ) : (
                    "—"
                  )}
                </DetailRow>
                <DetailRow label={t("contentEn")}>
                  {item.contentEn ? (
                    <div
                      className="prose prose-sm max-w-none text-start font-normal [&_p]:my-1"
                      dangerouslySetInnerHTML={{ __html: item.contentEn }}
                    />
                  ) : (
                    "—"
                  )}
                </DetailRow>
              </div>

              <DetailRow label={t("sortOrder")}>{item.sortOrder}</DetailRow>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow label={t("createdAt")}>
                  <div className="flex flex-col gap-0.5">
                    <span>{item.createdDate}</span>
                    <span className="text-xs font-medium text-brand-gris">
                      {item.createdTime}
                    </span>
                  </div>
                </DetailRow>
                <DetailRow label={t("updatedAt")}>
                  <div className="flex flex-col gap-0.5">
                    <span>{item.updatedDate}</span>
                    <span className="text-xs font-medium text-brand-gris">
                      {item.updatedTime}
                    </span>
                  </div>
                </DetailRow>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
