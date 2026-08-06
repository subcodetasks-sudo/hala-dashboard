"use client";

import { ArrowLeft, ChevronRight, SaudiRiyal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import DocumentPreviewDialog from "@/components/document-preview-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ManualSignatureLinkCard from "@/features/orders/manual/components/manual-signature-link-card";
import type { ManualOrderDraft } from "@/features/orders/manual/types";
import { buildSignatureLink } from "@/features/orders/manual/utils/build-signature-link";
import { toSaudiPhoneInternational } from "@/lib/format-saudi-phone";
import { cn } from "@/lib/utils";

type ManualReviewStepProps = {
  draft: ManualOrderDraft;
  onBack: () => void;
  onSubmit?: () => void | Promise<void>;
  isSubmitting?: boolean;
};

type ReviewField = {
  iconSrc: string;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
  valueClassName?: string;
  /** Rendered right after the value, e.g. a currency glyph. */
  valueSuffix?: React.ReactNode;
};

type DocumentChip = {
  id: string;
  label: string;
  file: File | null;
  /** Awaiting a signature — rendered in the accent style instead of teal. */
  isMissing?: boolean;
};

function formatSalary(value: string): string {
  const amount = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(amount);
}

function fileExtension(file: File | null): string {
  if (!file) return "pdf";
  const parts = file.name.split(".");
  return parts.length > 1 ? parts[parts.length - 1]!.toLowerCase() : "pdf";
}

function ReviewSection({
  title,
  iconSrc,
  children,
}: {
  title: string;
  iconSrc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="relative flex items-center justify-start">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-brand-accent/15" />
        </div>
        <div className="relative flex items-center gap-1.5 bg-white pe-3 text-sm font-bold text-brand-accent">
          <CustomIcon src={iconSrc} size={18} className="text-brand-accent" />
          <span>{title}</span>
        </div>
      </div>
      {children}
    </section>
  );
}

function ReviewFieldGrid({
  fields,
  columnsCount = 5,
}: {
  fields: ReviewField[];
  columnsCount?: number;
}) {
  const gridColsClass =
    columnsCount === 3
      ? "sm:grid-cols-3 lg:grid-cols-3"
      : columnsCount === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3 lg:grid-cols-5";

  return (
    <ul className={cn("grid grid-cols-1 gap-x-6 gap-y-6", gridColsClass)}>
      {fields.map((field, index) => (
        <li
          key={field.label}
          className="relative flex min-w-0 flex-col items-center justify-center text-center"
        >
          {index < fields.length - 1 && (
            <div
              className="absolute end-0 top-2 bottom-2 hidden w-px bg-black/10 sm:block"
              aria-hidden
            />
          )}
          <CustomIcon
            src={field.iconSrc}
            size={20}
            className="mb-1.5 text-brand-gris/70"
          />
          <p className="text-xs text-brand-gris">{field.label}</p>
          <p
            className={cn(
              "mt-2 flex min-w-0 items-center justify-center gap-1 text-sm text-brand-black",
              field.valueClassName ? field.valueClassName : "font-bold"
            )}
            dir={field.dir}
            title={field.value}
          >
            <span className="truncate">{field.value || "—"}</span>
            {field.valueSuffix}
          </p>
        </li>
      ))}
    </ul>
  );
}

function DocumentPreviewChip({ chip }: { chip: DocumentChip }) {
  const [open, setOpen] = useState(false);

  const objectUrl = useMemo(() => {
    if (!chip.file) return null;
    return URL.createObjectURL(chip.file);
  }, [chip.file]);

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const chipClassName =
    "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold";

  if (chip.isMissing) {
    return (
      <span
        className={cn(chipClassName, "bg-brand-accent/10 text-brand-accent")}
      >
        <span className="truncate">{chip.label}</span>
        <X className="size-3.5 shrink-0" strokeWidth={2.5} />
      </span>
    );
  }

  const content = (
    <>
      <CustomIcon src="/svg/eye.svg" size={14} className="shrink-0" />
      <span className="truncate">{chip.label}</span>
      <CustomIcon src="/svg/check-mark.svg" size={14} className="shrink-0" />
    </>
  );

  if (!objectUrl || !chip.file) {
    return (
      <span
        className={cn(chipClassName, "bg-brand-primary/10 text-brand-primary")}
      >
        {content}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          chipClassName,
          "bg-brand-primary/10 text-brand-primary transition-colors hover:bg-brand-primary/15"
        )}
      >
        {content}
      </button>

      <DocumentPreviewDialog
        open={open}
        onOpenChange={setOpen}
        title={chip.label}
        src={objectUrl}
        fileName={chip.file.name}
        mimeType={chip.file.type}
      />
    </>
  );
}

export default function ManualReviewStep({
  draft,
  onBack,
  onSubmit,
  isSubmitting = false,
}: ManualReviewStepProps) {
  const t = useTranslations("Orders.Manual.review");
  const tEmployer = useTranslations("Orders.New.Review.employer");
  const tWorker = useTranslations("Orders.New.Review.worker");
  const tDocs = useTranslations("Orders.New.Review.documents");
  const tManualDocs = useTranslations("Orders.Manual.documents");
  const tManual = useTranslations("Orders.Manual");

  const [acknowledged, setAcknowledged] = useState(false);
  const [ackError, setAckError] = useState(false);

  const employer = draft.employer;
  const worker = draft.worker;
  const documents = draft.documents;
  const signatureLink = useMemo(
    () => buildSignatureLink(draft.orderId),
    [draft.orderId]
  );

  const employerRow1: ReviewField[] = useMemo(() => {
    if (!employer) return [];
    return [
      {
        iconSrc: "/svg/person.svg",
        label: t("employerName"),
        value: employer.employerNameAr,
      },
      {
        iconSrc: "/svg/personalcard.svg",
        label: tEmployer("nationalId"),
        value: employer.nationalId,
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
      {
        iconSrc: "/svg/phone.svg",
        label: t("contactNumber"),
        value: toSaudiPhoneInternational(employer.phoneLocal),
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
    ];
  }, [employer, t, tEmployer]);

  const employerRow2: ReviewField[] = useMemo(() => {
    if (!employer) return [];
    return [
      {
        iconSrc: "/svg/target.svg",
        label: tEmployer("city"),
        value: employer.city,
      },
      {
        iconSrc: "/svg/location.svg",
        label: tEmployer("passportIssuePlace"),
        value: employer.passportIssuePlace,
      },
    ];
  }, [employer, tEmployer]);

  const workerRow1: ReviewField[] = useMemo(() => {
    if (!worker) return [];
    return [
      {
        iconSrc: "/svg/person.svg",
        label: t("workerName"),
        value: worker.workerNameAr,
      },
      {
        iconSrc: "/svg/phone.svg",
        label: t("contactNumber"),
        value: toSaudiPhoneInternational(worker.workerPhoneLocal),
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
      {
        iconSrc: "/svg/ticket.svg",
        label: tWorker("passportNumber"),
        value: worker.passportNumber,
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("passportIssueDate"),
        value: worker.passportIssueDate,
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("passportExpiryDate"),
        value: worker.passportExpiryDate,
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
    ];
  }, [t, tWorker, worker]);

  const workerRow2: ReviewField[] = useMemo(() => {
    if (!worker) return [];
    const salary = documents?.salary?.trim();

    return [
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("birthDate"),
        value: worker.birthDate,
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
      },
      {
        iconSrc: "/svg/home.svg",
        label: tWorker("homeAddress"),
        value: worker.homeAddress,
      },
      {
        iconSrc: "/svg/location.svg",
        label: tWorker("passportIssuePlace"),
        value: worker.passportIssuePlace,
      },
      {
        iconSrc: "/svg/money-recive.svg",
        label: tManualDocs("salary"),
        value: salary ? formatSalary(salary) : "—",
        dir: "ltr",
        valueClassName: "font-clash font-semibold",
        valueSuffix: salary ? (
          <>
            <SaudiRiyal
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="sr-only">{t("currency")}</span>
          </>
        ) : undefined,
      },
    ];
  }, [documents, t, tManualDocs, tWorker, worker]);

  const documentChips: DocumentChip[] = useMemo(() => {
    if (!documents) return [];

    return [
      {
        id: "nationalId",
        label: `${tDocs("types.nationalId")}.${fileExtension(documents.nationalIdImage)}`,
        file: documents.nationalIdImage,
      },
      {
        id: "workerId",
        label: `${tManualDocs("workerId")}.${fileExtension(documents.workerIdImage)}`,
        file: documents.workerIdImage,
      },
      {
        id: "passport",
        label: `${tManualDocs("passportCombined")}.${fileExtension(documents.passportImage)}`,
        file: documents.passportImage,
      },
      {
        id: "exitReentry",
        label: `${tDocs("types.exitReentryVisa")}.${fileExtension(documents.exitReentryVisa)}`,
        file: documents.exitReentryVisa,
      },
      {
        id: "employerSignature",
        label: tDocs("types.employerSignature"),
        file: null,
        isMissing: true,
      },
      {
        id: "workerSignature",
        label: tDocs("types.workerSignature"),
        file: null,
        isMissing: true,
      },
    ];
  }, [documents, tDocs, tManualDocs]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!acknowledged) {
      setAckError(true);
      toast.error(t("acknowledgmentRequired"));
      return;
    }

    if (!employer || !worker || !documents) {
      toast.error(t("incompleteDraft"));
      return;
    }

    await onSubmit?.();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1 text-start">
        <h2 className="text-lg font-bold text-brand-black">{t("title")}</h2>
        <p className="text-xs text-brand-gris">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-8">
        <ReviewSection title={t("employerSection")} iconSrc="/svg/person.svg">
          <div className="flex flex-col gap-6">
            <ReviewFieldGrid fields={employerRow1} columnsCount={3} />
            <ReviewFieldGrid fields={employerRow2} columnsCount={3} />
          </div>
        </ReviewSection>

        <ReviewSection title={t("workerSection")} iconSrc="/svg/worker.svg">
          <div className="flex flex-col gap-6">
            <ReviewFieldGrid fields={workerRow1} columnsCount={5} />
            <ReviewFieldGrid fields={workerRow2} columnsCount={4} />
          </div>
        </ReviewSection>

        <ReviewSection
          title={t("documentsSection")}
          iconSrc="/svg/file-upload.svg"
        >
          <ul className="flex flex-wrap gap-2">
            {documentChips.map((chip) => (
              <li key={chip.id} className="max-w-full">
                <DocumentPreviewChip chip={chip} />
              </li>
            ))}
          </ul>
        </ReviewSection>

        <ManualSignatureLinkCard link={signatureLink} />
      </div>

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
          ackError && !acknowledged
            ? "border-destructive bg-destructive/5"
            : "border-brand-primary/15 bg-brand-background/60"
        )}
      >
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(checked) => {
            setAcknowledged(checked === true);
            if (checked === true) setAckError(false);
          }}
          className="mt-0.5 size-5 rounded-md border-brand-primary data-checked:border-brand-success data-checked:bg-brand-success"
         aria-invalid={ackError && !acknowledged ? true : undefined}
        />
        <span className="text-sm font-medium leading-relaxed text-brand-black">
          {t("acknowledgment")}
        </span>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-12 gap-2 rounded-full border-brand-black/10 bg-brand-background px-6 font-semibold text-brand-gris hover:bg-brand-gris/10 hover:text-brand-gris"
        >
          <ChevronRight className="size-4 ltr:rotate-180" strokeWidth={2.25} />
          <span>{tManual("back")}</span>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-12 gap-2 rounded-full border-none bg-brand-primary px-6 font-semibold text-brand-white transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98]"
        >
          <span>{t("submit")}</span>
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
            strokeWidth={2.25}
          />
        </Button>
      </div>
    </form>
  );
}
