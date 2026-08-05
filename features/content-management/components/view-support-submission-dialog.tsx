"use client";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SupportSubmissionRow } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

type ViewSupportSubmissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SupportSubmissionRow | null;
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

export default function ViewSupportSubmissionDialog({
  open,
  onOpenChange,
  item,
}: ViewSupportSubmissionDialogProps) {
  const t = useTranslations("ContentManagement.support.submissions.viewDialog");
  const tTable = useTranslations("ContentManagement.support.submissions.table");
  const locale = useLocale();

  if (!item) return null;

  const isNew = item.status === "new";
  const inquiryTypeName =
    locale === "ar"
      ? item.inquiryTypeNameAr || item.inquiryTypeNameEn || "—"
      : item.inquiryTypeNameEn || item.inquiryTypeNameAr || "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border-none bg-white p-0 ring-0 sm:max-w-2xl max-h-[90vh]"
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

        <div className="flex flex-col gap-3 px-5 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label={t("firstName")}>
              {item.firstName || "—"}
            </DetailRow>
            <DetailRow label={t("lastName")}>{item.lastName || "—"}</DetailRow>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label={t("phone")}>
              <span dir="ltr">{item.phone || "—"}</span>
            </DetailRow>
            <DetailRow label={t("orderNumber")}>
              <span dir="ltr">{item.orderNumber || "—"}</span>
            </DetailRow>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label={t("inquiryType")}>{inquiryTypeName}</DetailRow>
            <DetailRow label={t("status")}>
              <Badge
                className={cn(
                  "h-auto! inline-flex w-fit items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
                  isNew
                    ? "bg-brand-primary/15 text-brand-primary"
                    : "bg-brand-success-light text-brand-success",
                )}
              >
                {isNew ? tTable("statusNew") : tTable("statusRead")}
              </Badge>
            </DetailRow>
          </div>

          <DetailRow label={t("message")}>
            <p className="whitespace-pre-wrap font-medium leading-relaxed">
              {item.message || "—"}
            </p>
          </DetailRow>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label={t("createdAt")}>
              <div className="flex flex-col gap-0.5">
                <span>{item.createdDate || "—"}</span>
                {item.createdTime ? (
                  <span className="text-xs font-medium text-brand-gris">
                    {item.createdTime}
                  </span>
                ) : null}
              </div>
            </DetailRow>
            <DetailRow label={t("updatedAt")}>
              <div className="flex flex-col gap-0.5">
                <span>{item.updatedDate || "—"}</span>
                {item.updatedTime ? (
                  <span className="text-xs font-medium text-brand-gris">
                    {item.updatedTime}
                  </span>
                ) : null}
              </div>
            </DetailRow>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
