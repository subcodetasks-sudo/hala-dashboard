"use client";

import { ArrowLeft, ChevronRight, SaudiRiyal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
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

function formatSalary(value: string, locale: string): string {
  const amount = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
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
    <section className="flex flex-col gap-4 rounded-2xl border border-brand-primary/10 bg-brand-background/30 p-4 sm:p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-brand-black">
        <span className="inline-flex rounded-xl bg-brand-primary/10 p-2.5 text-brand-primary">
          <CustomIcon src={iconSrc} size={18} />
        </span>
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}

function ReviewFieldGrid({ fields }: { fields: ReviewField[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <li key={field.label} className="flex min-w-0 items-start gap-2.5">
          <CustomIcon
            src={field.iconSrc}
            size={16}
            className="mt-0.5 shrink-0 text-brand-gris"
          />
          <div className="min-w-0">
            <p className="text-xs text-brand-gris">{field.label}</p>
            <p
              className={cn(
                "mt-0.5 flex min-w-0 items-center gap-1 text-sm font-semibold text-brand-black",
                field.valueClassName
              )}
              dir={field.dir}
              title={field.value}
            >
              <span className="truncate">{field.value || "—"}</span>
              {field.valueSuffix}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DocumentPreviewChip({ chip }: { chip: DocumentChip }) {
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

  if (!objectUrl) {
    return (
      <span
        className={cn(chipClassName, "bg-brand-primary/10 text-brand-primary")}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={objectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        chipClassName,
        "bg-brand-primary/10 text-brand-primary transition-colors hover:bg-brand-primary/15"
      )}
    >
      {content}
    </a>
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
  const locale = useLocale();

  const [acknowledged, setAcknowledged] = useState(false);
  const [ackError, setAckError] = useState(false);

  const employer = draft.employer;
  const worker = draft.worker;
  const documents = draft.documents;
  const signatureLink = useMemo(
    () => buildSignatureLink(draft.orderId),
    [draft.orderId]
  );

  const employerFields: ReviewField[] = useMemo(() => {
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
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/phone.svg",
        label: t("contactNumber"),
        value: toSaudiPhoneInternational(employer.phoneLocal),
        dir: "ltr",
        valueClassName: "font-clash",
      },
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
  }, [employer, t, tEmployer]);

  const workerFields: ReviewField[] = useMemo(() => {
    if (!worker) return [];

    const salary = documents?.salary?.trim();

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
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/ticket.svg",
        label: tWorker("passportNumber"),
        value: worker.passportNumber,
        dir: "ltr",
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("passportIssueDate"),
        value: worker.passportIssueDate,
        dir: "ltr",
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("passportExpiryDate"),
        value: worker.passportExpiryDate,
        dir: "ltr",
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/calendar.svg",
        label: tWorker("birthDate"),
        value: worker.birthDate,
        dir: "ltr",
        valueClassName: "font-clash",
      },
      {
        iconSrc: "/svg/home.svg",
        label: tWorker("homeAddress"),
        value: worker.homeAddress,
      },
      {
        iconSrc: "/svg/home.svg",
        label: tWorker("passportIssuePlace"),
        value: worker.passportIssuePlace,
      },
      {
        iconSrc: "/svg/money-recive.svg",
        label: tManualDocs("salary"),
        value: salary ? formatSalary(salary, locale) : "—",
        dir: "ltr",
        valueClassName: "font-clash",
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
  }, [documents, locale, t, tManualDocs, tWorker, worker]);

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
      <div>
        <h2 className="text-lg font-bold text-brand-black">{t("title")}</h2>
        <p className="mt-1 text-sm text-brand-gris">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-4">
        <ReviewSection title={t("employerSection")} iconSrc="/svg/person.svg">
          <ReviewFieldGrid fields={employerFields} />
        </ReviewSection>

        <ReviewSection title={t("workerSection")} iconSrc="/svg/worker.svg">
          <ReviewFieldGrid fields={workerFields} />
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
          className="mt-0.5 size-5 rounded-md border-brand-primary data-checked:border-brand-primary data-checked:bg-brand-primary"
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
