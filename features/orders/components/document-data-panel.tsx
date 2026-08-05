"use client";

import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CloudUpload, Download, Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import ReplaceDocumentDialog from "@/features/orders/pending/components/replace-document-dialog";
import { useUploadRenewalDocument } from "@/features/orders/queries/use-upload-renewal-document";
import type {
  DocumentCollection,
  OrderDocument,
  OrderDocumentType,
  OrderReviewDetail,
} from "@/features/orders/types";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type DocumentDataPanelProps = {
  order: OrderReviewDetail;
};

type DocumentVisual = {
  iconSrc: string;
  iconClassName: string;
  bgClassName: string;
};

const DOCUMENT_VISUALS: Record<OrderDocumentType, DocumentVisual> = {
  nationalId: {
    iconSrc: "/svg/profile-tick.svg",
    // Soft pink — not a brand token
    bgClassName: "bg-[#FCE8EB]",
    iconClassName: "text-brand-accent",
  },
  workerId: {
    iconSrc: "/svg/person.svg",
    // Soft blue — not a brand token
    bgClassName: "bg-[#E8F1FF]",
    iconClassName: "text-[#4A7FD4]",
  },
  passportFirstPage: {
    iconSrc: "/svg/document-text.svg",
    bgClassName: "bg-brand-primary/10",
    iconClassName: "text-brand-primary",
  },
  passportVisa: {
    iconSrc: "/svg/document-text.svg",
    // Soft purple — not a brand token
    bgClassName: "bg-[#EEE8FA]",
    iconClassName: "text-[#7C6BC4]",
  },
  exitReentryVisa: {
    iconSrc: "/svg/tag-2.svg",
    bgClassName: "bg-brand-success/10",
    iconClassName: "text-brand-success",
  },
  employerSignature: {
    iconSrc: "/svg/brush.svg",
    // Soft grey — not a brand token
    bgClassName: "bg-[#F0F0F0]",
    iconClassName: "text-brand-gris",
  },
  workerSignature: {
    iconSrc: "/svg/brush.svg",
    // Soft pink — not a brand token
    bgClassName: "bg-[#FCE8EB]",
    iconClassName: "text-brand-accent",
  },
};

const UPLOAD_ACCEPT = ".png,.pdf,image/png,application/pdf";

export default function DocumentDataPanel({ order }: DocumentDataPanelProps) {
  const t = useTranslations("Orders.New.Review.documents");
  const locale = useLocale();
  const canReplaceDocuments = order.status === "held";

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-base font-bold text-brand-black">
        <span className="inline-flex rounded-xl bg-brand-primary/10 p-3 text-brand-primary">
          <CustomIcon src="/svg/shield-tick.svg" size={20} />
        </span>
        <span>{t("sectionTitle")}</span>
      </h3>

      <ul className="flex flex-col">
        {order.documents.map((doc, index) => {
          const date = formatUploadedAt(doc.uploadedAtIso, locale);
          const hasIssue = doc.issue === "unclear";
          const meta = hasIssue
            ? t("metaIssue", {
                issue: t("issueUnclear"),
                date,
                format: doc.format,
              })
            : t("meta", {
                date,
                size: doc.sizeLabel,
                format: doc.format,
              });

          return (
            <li key={doc.id}>
              <DocumentRow
                orderId={order.id}
                document={doc}
                title={t(`types.${doc.type}`)}
                meta={meta}
                metaTone={hasIssue ? "warning" : "muted"}
                viewLabel={t("view")}
                downloadLabel={t("download")}
                uploadLabel={t("uploadLabel")}
                uploadFormats={t("uploadFormats")}
                uploadAria={t("uploadAria", {
                  title: t(`types.${doc.type}`),
                })}
                showUpload={canReplaceDocuments}
                isLast={index === order.documents.length - 1}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DocumentRow({
  orderId,
  document,
  title,
  meta,
  metaTone,
  viewLabel,
  downloadLabel,
  uploadLabel,
  uploadFormats,
  uploadAria,
  showUpload,
  isLast,
}: {
  orderId: string;
  document: OrderDocument;
  title: string;
  meta: string;
  metaTone: "muted" | "warning";
  viewLabel: string;
  downloadLabel: string;
  uploadLabel: string;
  uploadFormats: string;
  uploadAria: string;
  showUpload: boolean;
  isLast: boolean;
}) {
  const visual = DOCUMENT_VISUALS[document.type];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4",
        !isLast && "border-b border-black/5"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
            visual.bgClassName,
            visual.iconClassName
          )}
        >
          <CustomIcon src={visual.iconSrc} size={20} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-brand-black">{title}</p>
          <p
            className={cn(
              "mt-0.5 truncate text-xs font-medium",
              metaTone === "warning" ? "text-brand-warning" : "text-brand-gris"
            )}
          >
            {meta}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2.5 lg:justify-end">
        <Button
          variant="ghost"
          asChild
          // Soft purple — not a brand token
          className="h-10 gap-1.5 rounded-full bg-[#F3E8FF] px-4 font-semibold text-[#7C3AED] shadow-none hover:bg-[#EDE0FF] hover:text-[#7C3AED]"
        >
          <a href={document.url} target="_blank" rel="noopener noreferrer">
            <Eye className="size-4" strokeWidth={1.75} />
            {viewLabel}
          </a>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="h-10 gap-1.5 rounded-full bg-brand-success/10 px-4 font-semibold text-brand-success shadow-none hover:bg-brand-success/15 hover:text-brand-success"
        >
          <a href={document.url} download>
            <Download className="size-4" strokeWidth={1.75} />
            {downloadLabel}
          </a>
        </Button>
        {showUpload ? (
          <DocumentUploadControl
            orderId={orderId}
            collection={document.collection}
            label={uploadLabel}
            formats={uploadFormats}
            ariaLabel={uploadAria}
            documentTitle={title}
            documentMeta={meta}
            documentUrl={document.url}
            iconSrc={visual.iconSrc}
            iconClassName={visual.iconClassName}
            bgClassName={visual.bgClassName}
          />
        ) : null}
      </div>
    </div>
  );
}

function DocumentUploadControl({
  orderId,
  collection,
  label,
  formats,
  ariaLabel,
  documentTitle,
  documentMeta,
  documentUrl,
  iconSrc,
  iconClassName,
  bgClassName,
}: {
  orderId: string;
  collection: DocumentCollection;
  label: string;
  formats: string;
  ariaLabel: string;
  documentTitle: string;
  documentMeta: string;
  documentUrl: string;
  iconSrc: string;
  iconClassName: string;
  bgClassName: string;
}) {
  const t = useTranslations("Orders.Pending.replaceDocumentDialog");
  const router = useRouter();
  const uploadDocument = useUploadRenewalDocument();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPending = uploadDocument.isPending;

  const resetPicker = () => {
    setPendingFile(null);
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) return;

    setPendingFile(file);
    setFileName(file.name);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingFile || isPending) return;

    const promise = uploadDocument
      .mutateAsync({
        renewalRequestId: orderId,
        collection,
        file: pendingFile,
      })
      .then(() => {
        setConfirmOpen(false);
        setPendingFile(null);
        router.refresh();
      });

    toast.promise(promise, {
      loading: t("loadingToast"),
      success: t("successToast"),
      error: (error) =>
        error instanceof Error && error.message
          ? error.message
          : t("errorToast"),
    });
  };

  return (
    <>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        className="sr-only"
        disabled={isPending}
        onChange={handleFileChange}
      />
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-11 min-w-52 items-center gap-3 rounded-full border border-black/10 bg-[#F7F7F7] ps-4 pe-1.5 text-start transition-colors hover:border-brand-primary/30 hover:bg-brand-background/70 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold leading-tight text-brand-black">
            {fileName ?? label}
          </span>
          <span className="mt-1 block text-[0.625rem] leading-tight text-brand-gris">
            {formats}
          </span>
        </span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-brand-black">
          <CloudUpload className="size-4" strokeWidth={1.75} />
        </span>
      </button>
      <ReplaceDocumentDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open && isPending) return;
          setConfirmOpen(open);
          if (!open) resetPicker();
        }}
        documentTitle={documentTitle}
        documentMeta={documentMeta}
        documentUrl={documentUrl}
        iconSrc={iconSrc}
        iconClassName={iconClassName}
        bgClassName={bgClassName}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function formatUploadedAt(iso: string, locale: string) {
  return format(parseISO(iso), "d MMM yyyy", {
    locale: locale === "ar" ? ar : enUS,
  });
}
