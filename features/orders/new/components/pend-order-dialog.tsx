"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useHoldRenewalRequest } from "@/features/orders/queries/use-hold-renewal-request";
import type { HoldReasonValue } from "@/features/orders/types";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PEND_REASON_IDS = [
  "incompleteEmployerData",
  "unclearWorkerData",
  "missingDocument",
  "unclearDocument",
  "dataConflict",
  "other",
] as const;

type PendReasonId = (typeof PEND_REASON_IDS)[number];

const PEND_REASON_TO_API: Record<PendReasonId, HoldReasonValue> = {
  incompleteEmployerData: "employer_data_incomplete",
  unclearWorkerData: "worker_data_unclear",
  missingDocument: "missing_document",
  unclearDocument: "unclear_document",
  dataConflict: "data_conflict",
  other: "other",
};

type PendOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
};

export default function PendOrderDialog({
  open,
  onOpenChange,
  orderId,
}: PendOrderDialogProps) {
  const t = useTranslations("Orders.New.pendOrderDialog");
  const router = useRouter();
  const holdRequest = useHoldRenewalRequest();
  const [reason, setReason] = useState<PendReasonId | null>(null);
  const [notes, setNotes] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [reasonsOpen, setReasonsOpen] = useState(false);

  const isPending = holdRequest.isPending;

  const resetForm = () => {
    setReason(null);
    setNotes("");
    setReasonError(false);
    setReasonsOpen(false);
  };

  const selectReason = (id: PendReasonId) => {
    setReason(id);
    setReasonError(false);
    setReasonsOpen(false);
  };

  const handleConfirm = () => {
    if (isPending) return;

    if (!reason) {
      setReasonError(true);
      setReasonsOpen(true);
      return;
    }

    if (!orderId) return;

    holdRequest.mutate(
      {
        renewalRequestId: orderId,
        holdReason: PEND_REASON_TO_API[reason],
        holdNotes: notes.trim(),
      },
      {
        onSuccess: () => {
          toast.success(t("toastSuccess"));
          resetForm();
          onOpenChange(false);
          router.push("/orders/pending");
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : t("errorToast"),
          );
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const selectedSummary = reason ? t(`reasons.${reason}`) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar w-[calc(100%-2rem)] gap-0 overflow-visible rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-md"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-4 px-5 py-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-warning/15">
            <AlertTriangle
              className="size-7 text-brand-warning"
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 space-y-2">
            <h3 className="text-xl font-bold text-brand-black">{t("heading")}</h3>
            <DialogDescription className="text-sm leading-relaxed text-brand-gris">
              {t("description")}
            </DialogDescription>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-4 text-start">
            <div className="min-w-0 space-y-2">
              <Label
                htmlFor="pend-reason"
                className="text-sm font-semibold text-brand-black"
              >
                <span>
                  {t("reasonLabel")}{" "}
                  <span className="text-brand-accent" aria-hidden>
                    *
                  </span>
                </span>
              </Label>

              <div className="relative min-w-0 w-full">
                <button
                  id="pend-reason"
                  type="button"
                  disabled={isPending}
                  aria-expanded={reasonsOpen}
                  aria-controls="pend-reason-list"
                  data-invalid={reasonError || undefined}
                  onClick={() => setReasonsOpen((next) => !next)}
                  className={cn(
                    "flex h-12 w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-full border border-black/10 bg-white px-4 text-sm transition-colors outline-none focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 disabled:opacity-60",
                    reasonError && "border-brand-accent"
                  )}
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-start",
                      selectedSummary
                        ? "font-medium text-brand-black"
                        : "text-brand-gris"
                    )}
                  >
                    {selectedSummary ?? t("reasonPlaceholder")}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-brand-accent transition-transform",
                      reasonsOpen && "rotate-180"
                    )}
                    strokeWidth={2.25}
                  />
                </button>

                {reasonsOpen ? (
                  <ul
                    id="pend-reason-list"
                    role="listbox"
                    className="absolute inset-x-0 top-full z-50 mt-2 flex w-full min-w-0 max-h-56 flex-col gap-1.5 overflow-y-auto overscroll-contain rounded-[1.25rem] no-scrollbar bg-white p-2 shadow-lg ring-1 ring-black/5"
                  >
                    {PEND_REASON_IDS.map((id) => {
                      const selected = reason === id;
                      return (
                        <li key={id} className="min-w-0 ">
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            disabled={isPending}
                            onClick={() => selectReason(id)}
                            className={cn(
                              "flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl bg-[#F5F5F5] px-3.5 py-3 text-start text-sm font-medium text-brand-black transition-colors",
                              selected
                                ? "border border-brand-primary bg-brand-primary/5"
                                : "border border-transparent hover:bg-[#EEEEEE]"
                            )}
                          >
                            <span className="min-w-0 flex-1 wrap-break-word leading-snug">
                              {t(`reasons.${id}`)}
                            </span>
                            <span
                              className={cn(
                                "inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                selected
                                  ? "border-brand-primary bg-brand-primary text-brand-white"
                                  : "border-brand-gris/35 bg-white"
                              )}
                              aria-hidden
                            >
                              {selected ? (
                                <Check className="size-3" strokeWidth={3} />
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <Label
                htmlFor="pend-notes"
                className="text-sm font-semibold text-brand-black"
              >
                {t("notesLabel")}
              </Label>
              <Textarea
                id="pend-notes"
                value={notes}
                disabled={isPending}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("notesPlaceholder")}
                className="min-h-28 w-full max-w-full rounded-2xl border-black/10 bg-white px-4 py-3 text-sm placeholder:text-brand-gris/70"
              />
            </div>

            <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-brand-warning/40 bg-brand-warning/10 px-4 py-3 text-start">
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-brand-warning"
                strokeWidth={2}
              />
              <p className="min-w-0 flex-1 text-sm leading-relaxed wrap-break-word text-brand-black">
                {t("infoBanner")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="h-12 w-full flex-1 rounded-2xl bg-brand-background font-semibold text-brand-black hover:bg-brand-background/80 sm:w-auto"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="group relative h-12 w-full flex-[1.4] items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-warning px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-warning/90 hover:shadow-md hover:shadow-brand-warning/20 active:scale-[0.98] sm:w-auto"
          >
            {isPending ? (
              <Spinner className="size-5 text-brand-white" />
            ) : (
              <>
                <span
                  className="confirm-chevron-start inline-flex items-center"
                  aria-hidden
                >
                  <ChevronsLeft
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                    strokeWidth={2.25}
                  />
                </span>
                <span className="tracking-wide">{t("confirm")}</span>
                <span
                  className="confirm-chevron-end inline-flex items-center"
                  aria-hidden
                >
                  <ChevronsRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                    strokeWidth={2.25}
                  />
                </span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
