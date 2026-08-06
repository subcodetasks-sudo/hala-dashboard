"use client";

import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  CloudUpload,
  Eye,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useConfirmPayment } from "@/features/orders/payment/queries/use-payment-orders";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ConfirmPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
};

type UploadedProof = {
  file: File;
  previewUrl: string;
};

export default function ConfirmPaymentDialog({
  open,
  onOpenChange,
  orderId,
  orderNumber,
}: ConfirmPaymentDialogProps) {
  const t = useTranslations("Orders.Payment.confirmPaymentDialog");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploaded, setUploaded] = useState<UploadedProof | null>(null);
  const [notificationText, setNotificationText] = useState(() =>
    t("notificationDefault")
  );
  const [confirmed, setConfirmed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const confirmPayment = useConfirmPayment();
  const isPending = confirmPayment.isPending;

  const resetForm = () => {
    setUploaded((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
    setNotificationText(t("notificationDefault"));
    setConfirmed(false);
    setIsDragging(false);
    setError(null);
    setPreviewOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (uploaded) URL.revokeObjectURL(uploaded.previewUrl);
    };
  }, [uploaded]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const acceptFile = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setError(t("invalidType"));
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError(t("invalidSize"));
      return;
    }

    setError(null);
    setUploaded((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
      };
    });
  };

  const handleFiles = (files: FileList | null) => {
    acceptFile(files?.[0]);
  };

  const handleRemoveFile = () => {
    setPreviewOpen(false);
    setUploaded((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewFile = () => {
    if (!uploaded) return;
    setPreviewOpen(true);
  };

  const canApprove = Boolean(uploaded) && confirmed && !isPending;

  const handleApprove = () => {
    if (!uploaded || !confirmed || !orderId || isPending) return;

    confirmPayment.mutate(
      {
        renewalRequestId: orderId,
        paymentProof: uploaded.file,
        confirmed,
        notificationText: notificationText.trim(),
      },
      {
        onSuccess: () => {
          toast.success(t("toastSuccess"));
          resetForm();
          onOpenChange(false);
          router.push("/orders/completed");
          router.refresh();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error && err.message
              ? err.message
              : t("errorToast"),
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar max-h-[90vh] gap-0 overflow-y-auto rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-lg"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="text-base font-bold text-brand-black">
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

        <div className="flex min-w-0 flex-col gap-5 overflow-hidden px-5 py-6">
          <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex size-10 items-center justify-center rounded-2xl p-6 bg-brand-primary/10">
                <CustomIcon
                  src="/svg/upload.svg"
                  size={22}
                  className="text-brand-primary"
                />
              </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold leading-snug text-brand-black md:text-xl">
                {t("heading")}
              </h3>
              <DialogDescription className="text-sm leading-relaxed text-brand-gris">
                {t("description")}
              </DialogDescription>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
            disabled={isPending}
            className={cn(
              "flex w-full flex-col items-center gap-3 rounded-[1.5rem] border border-dashed bg-brand-background/80 px-4 py-8 transition-colors",
              isDragging
                ? "border-brand-primary bg-brand-primary/10"
                : "border-brand-primary/30 hover:border-brand-primary/50",
              isPending && "pointer-events-none opacity-60"
            )}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
              <CloudUpload
                className="size-7 text-brand-primary"
                strokeWidth={1.75}
              />
            </span>
            <span className="text-sm font-semibold text-brand-primary">
              {t("dropzoneLabel")}
            </span>
            <span className="text-xs text-brand-gris">{t("fileConstraints")}</span>
          </button>

          {error ? (
            <p className="text-center text-sm font-medium text-brand-accent">
              {error}
            </p>
          ) : null}

          {uploaded ? (
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-sm font-semibold text-brand-success">
                {t("uploadSuccess")}
              </p>
              <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-full bg-[#F5F5F5] px-4 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                  <CustomIcon
                    src="/svg/img-mockup.svg"
                    size={16}
                    className="text-brand-gris"
                  />
                  <span
                    title={uploaded.file.name}
                    className="block min-w-0 flex-1 truncate text-sm font-bold text-brand-black"
                  >
                    {uploaded.file.name}
                  </span>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-black text-brand-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={t("viewFile")}
                    onClick={handleViewFile}
                    disabled={isPending}
                    className="size-8 rounded-full p-0 text-brand-gris hover:bg-brand-primary/10 hover:text-brand-primary"
                  >
                    <Eye className="size-4" strokeWidth={1.75} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={t("removeFile")}
                    onClick={handleRemoveFile}
                    disabled={isPending}
                    className="size-8 rounded-full p-0 text-brand-accent hover:bg-brand-accent/10 hover:text-brand-accent"
                  >
                    <CustomIcon
                      src="/svg/trash.svg"
                      size={16}
                      className="text-brand-accent"
                    />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {uploaded ? (
            <div className="flex flex-col gap-2 text-start">
              <Label
                htmlFor="payment-notification-text"
                className="text-sm font-bold text-brand-black"
              >
                {t("notificationLabel")}
              </Label>
              <Textarea
                id="payment-notification-text"
                value={notificationText}
                onChange={(event) => setNotificationText(event.target.value)}
                rows={4}
                disabled={isPending}
                className="min-h-24 rounded-2xl border-black/10 bg-[#F5F5F5] px-4 py-3 text-sm leading-relaxed text-brand-black focus-visible:border-brand-primary/40 disabled:opacity-60"
              />
            </div>
          ) : null}

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 text-start",
              isPending && "pointer-events-none opacity-60"
            )}
          >
            <Checkbox
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              disabled={isPending}
              className="mt-0.5 size-5 rounded-full border-brand-gris/40 data-checked:border-brand-success data-checked:bg-brand-success"
            />
            <span className="text-sm font-medium leading-relaxed text-brand-black">
              {t("confirmLinked")}
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="h-12 flex-1 rounded-full bg-[#F5F5F5] font-semibold text-brand-black hover:bg-[#EBEBEB]"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleApprove}
            disabled={!canApprove}
            className="group relative h-12 flex-[1.6] items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 disabled:opacity-50 active:scale-[0.98]"
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
                <span className="tracking-wide">{t("approve")}</span>
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-60 bg-black/60 supports-backdrop-filter:backdrop-blur-sm"
          className="z-60 gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-2xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
            <DialogTitle className="truncate text-base font-bold text-brand-black">
              {uploaded?.file.name ?? t("viewFile")}
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
          <DialogDescription className="sr-only">{t("viewFile")}</DialogDescription>
          <div className="flex max-h-[75vh] items-center justify-center bg-brand-background/60 p-4">
            {uploaded ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: object URL from local file upload
              <img
                src={uploaded.previewUrl}
                alt={uploaded.file.name}
                className="max-h-[70vh] w-full rounded-2xl object-contain"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
