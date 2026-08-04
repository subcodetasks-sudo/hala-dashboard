"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import CancelStatusActiveBadge from "@/features/cancel-statuses/components/cancel-status-active-badge";
import { useCancelStatus } from "@/features/cancel-statuses/queries/use-cancel-status-detail";

type ViewCancelStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
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

export default function ViewCancelStatusDialog({
  open,
  onOpenChange,
  itemId,
}: ViewCancelStatusDialogProps) {
  const t = useTranslations("CancelStatuses.viewDialog");
  const { data: item, isLoading, isError, error, isFetching } = useCancelStatus(
    itemId,
    open && itemId != null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-xl border-none bg-white p-0 ring-0 sm:max-w-lg"
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
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="size-6 text-brand-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CustomIcon
                src="/svg/danger.svg"
                size={28}
                className="text-brand-accent"
              />
              <p className="text-sm text-brand-gris">
                {error instanceof Error ? error.message : t("errorToast")}
              </p>
            </div>
          ) : item ? (
            <>
              <DetailRow label={t("textAr")}>{item.textAr || "—"}</DetailRow>
              <DetailRow label={t("textEn")}>{item.textEn || "—"}</DetailRow>
              <DetailRow label={t("status")}>
                <CancelStatusActiveBadge active={item.active} />
              </DetailRow>
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

        <div className="px-5 pb-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-12 w-full rounded-full bg-[#F5F5F5] font-semibold text-brand-black hover:bg-[#EBEBEB]"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
