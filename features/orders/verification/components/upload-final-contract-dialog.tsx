"use client";

import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  CloudUpload,
  FileText,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useUploadFinalContract } from "@/features/orders/verification/queries/use-upload-final-contract";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const UPLOAD_ACCEPT = ".png,.pdf,image/png,application/pdf";
const ACCEPTED_TYPES = new Set(["image/png", "application/pdf"]);

type UploadFinalContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
};

export default function UploadFinalContractDialog({
  open,
  onOpenChange,
  orderId,
  orderNumber,
}: UploadFinalContractDialogProps) {
  const t = useTranslations("Orders.Verification.uploadFinalContractDialog");
  const router = useRouter();
  const uploadFinalContract = useUploadFinalContract();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPending = uploadFinalContract.isPending;

  const resetForm = () => {
    setFile(null);
    setIsDragging(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isPending) return;
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const acceptFile = (next: File | undefined) => {
    if (!next) return;

    const typeOk =
      ACCEPTED_TYPES.has(next.type) ||
      /\.(png|pdf)$/i.test(next.name);

    if (!typeOk) {
      setError(t("invalidType"));
      return;
    }

    if (next.size > MAX_FILE_BYTES) {
      setError(t("invalidSize"));
      return;
    }

    setError(null);
    setFile(next);
  };

  const handleFiles = (files: FileList | null) => {
    acceptFile(files?.[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (!file || !orderId || isPending) return;

    uploadFinalContract.mutate(
      { renewalRequestId: orderId, file },
      {
        onSuccess: () => {
          toast.success(t("toastSuccess", { orderNumber }));
          resetForm();
          onOpenChange(false);
          router.push("/orders/payment");
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
              disabled={isPending}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <div className="flex min-w-0 flex-col gap-5 overflow-hidden px-5 py-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-primary/10 p-6">
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
            accept={UPLOAD_ACCEPT}
            className="sr-only"
            disabled={isPending}
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <button
            type="button"
            disabled={isPending}
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
            className={cn(
              "flex w-full flex-col items-center gap-3 rounded-[1.5rem] border border-dashed bg-brand-background/80 px-4 py-8 transition-colors",
              isDragging
                ? "border-brand-primary bg-brand-primary/10"
                : "border-brand-primary/30 hover:border-brand-primary/50",
              isPending && "pointer-events-none opacity-60",
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

          {file ? (
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-brand-success/20 bg-brand-success-light/60 px-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-success/15 text-brand-success">
                {file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf") ? (
                  <FileText className="size-5" strokeWidth={1.75} />
                ) : (
                  <Check className="size-5" strokeWidth={2} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-black">
                  {file.name}
                </p>
                <p className="text-xs text-brand-gris">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                aria-label={t("removeFile")}
                onClick={handleRemoveFile}
                className="size-8 shrink-0 rounded-lg p-0 text-brand-gris hover:bg-brand-accent/10 hover:text-brand-accent"
              >
                <X className="size-4" strokeWidth={2} />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!file || isPending}
            className="group relative h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-primary px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
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

          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
            className="h-12 flex-1 gap-2 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 hover:text-brand-black/70"
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
