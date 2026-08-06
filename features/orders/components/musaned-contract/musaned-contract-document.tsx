"use client";

import type { ReactNode } from "react";

import {
  ANNEX_DUTIES,
  CONTRACT_CLAUSES,
  CONTRACT_PREAMBLE,
  CONTRACT_TITLE,
  LABELS,
  type BilingualText,
  type ContractClause,
} from "@/features/orders/components/musaned-contract/musaned-contract-content";
import {
  MusanedContractField,
  MusanedSignatureSlot,
} from "@/features/orders/components/musaned-contract/musaned-contract-field";
import {
  formatPassportIssue,
  type MusanedContractData,
} from "@/features/orders/components/musaned-contract/map-order-to-musaned-contract";
import { cn } from "@/lib/utils";

type MusanedContractDocumentProps = {
  data: MusanedContractData;
  className?: string;
  /** Extra id for print targeting */
  id?: string;
};

function BilingualRow({
  label,
  value,
  blankClassName,
}: {
  label: BilingualText;
  value: string | null;
  blankClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-x-2 gap-y-0.5 text-[9.5pt]">
      <div className="min-w-0">
        <span className="font-semibold">{label.en}: </span>
        <MusanedContractField value={value} blankClassName={blankClassName} />
      </div>
      <span className="text-black/30" aria-hidden>
        |
      </span>
      <div className="min-w-0 text-end" dir="rtl">
        <MusanedContractField value={value} blankClassName={blankClassName} />
        <span className="font-semibold"> :{label.ar}</span>
      </div>
    </div>
  );
}

function BlankAgencyBlock({
  title,
}: {
  title: BilingualText;
}) {
  return (
    <div className="mt-2 space-y-1.5 rounded border border-black/20 p-2">
      <p className="text-[9.5pt] font-bold">
        {title.en} / <span dir="rtl">{title.ar}</span>
      </p>
      <BilingualRow label={LABELS.licenseNo} value={null} />
      <BilingualRow label={LABELS.address} value={null} blankClassName="min-w-[12rem]" />
      <BilingualRow label={LABELS.officialRep} value={null} />
      <BilingualRow label={LABELS.contactNumber} value={null} />
      <BilingualRow label={LABELS.passportNumber} value={null} />
      <BilingualRow label={LABELS.dateAndPlaceOfIssue} value={null} />
    </div>
  );
}

function ClauseBlock({
  clause,
  salary,
}: {
  clause: ContractClause;
  salary: string | null;
}) {
  if (clause.number === "3b" || clause.number === "15b") {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return (
      <div className="mb-2 space-y-1 text-[9pt]">
        <div className="grid grid-cols-2 gap-3">
          <p>{clause.body.en}</p>
          <p dir="rtl" className="text-end">
            {clause.body.ar}
          </p>
        </div>
        {clause.items?.map((item, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 ps-2">
            <p>
              {letters[i]}. {item.en}
            </p>
            <p dir="rtl" className="text-end">
              {item.ar}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const enBody =
    clause.number === "4"
      ? clause.body.en.replace("{salary}", salary?.trim() || "________")
      : clause.body.en;
  const arBody =
    clause.number === "4"
      ? clause.body.ar.replace("{salary}", salary?.trim() || "________")
      : clause.body.ar;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="mb-2.5 space-y-1 text-[9pt]">
      <div className="grid grid-cols-2 gap-3">
        <p>
          <span className="font-bold">
            {clause.number}. {clause.title.en}
            {clause.title.en ? ": " : ""}
          </span>
          {enBody}
        </p>
        <p dir="rtl" className="text-end">
          <span className="font-bold">
            {clause.number}. {clause.title.ar}
            {clause.title.ar ? ": " : ""}
          </span>
          {arBody}
        </p>
      </div>
      {clause.items?.map((item, i) => (
        <div key={i} className="grid grid-cols-2 gap-3 ps-2">
          <p>
            {letters[i]}. {item.en}
          </p>
          <p dir="rtl" className="text-end">
            {item.ar}
          </p>
        </div>
      ))}
    </div>
  );
}

function PageShell({
  children,
  pageNumber,
  className,
}: {
  children: ReactNode;
  pageNumber: number;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "musaned-page relative flex w-[210mm] min-h-[297mm] flex-col bg-white p-[14mm] text-black shadow-sm",
        className,
      )}
      data-page={pageNumber}
    >
      <div className="flex-1">{children}</div>
      <p className="mt-4 text-center text-[8pt] text-black/50">{pageNumber}</p>
    </section>
  );
}

export default function MusanedContractDocument({
  data,
  className,
  id = "musaned-contract-document",
}: MusanedContractDocumentProps) {
  const employerDisplay =
    data.employerNameEn ?? data.employerNameAr ?? null;
  const workerDisplay = data.workerNameEn ?? data.workerNameAr ?? null;
  const passportIssue = formatPassportIssue(data);

  const earlyClauses = CONTRACT_CLAUSES.filter((c) =>
    ["2", "3", "3b", "4", "5"].includes(c.number),
  );
  const midClauses = CONTRACT_CLAUSES.filter((c) =>
    ["6", "7", "8", "9", "10", "11", "12", "13"].includes(c.number),
  );
  const lateClausesA = CONTRACT_CLAUSES.filter((c) =>
    ["14", "15"].includes(c.number),
  );
  const lateClausesB = CONTRACT_CLAUSES.filter((c) =>
    ["15b", "16"].includes(c.number),
  );
  const closingClauses = CONTRACT_CLAUSES.filter((c) =>
    ["17", "18", "19", "20", "21"].includes(c.number),
  );

  return (
    <div
      id={id}
      className={cn("musaned-print-root flex flex-col gap-4", className)}
    >
      {/* Page 1 — Parties */}
      <PageShell pageNumber={1}>
        <header className="mb-4 space-y-2 border-b border-black pb-3 text-center">
          <h1 className="text-[11pt] font-bold uppercase leading-snug">
            {CONTRACT_TITLE.en}
          </h1>
          <h1 className="text-[11pt] font-bold leading-snug" dir="rtl">
            {CONTRACT_TITLE.ar}
          </h1>
        </header>

        <p className="mb-1 text-[9.5pt]">{CONTRACT_PREAMBLE.en}</p>
        <p className="mb-3 text-[9.5pt]" dir="rtl">
          {CONTRACT_PREAMBLE.ar}
        </p>

        <div className="space-y-2">
          <p className="text-[10pt] font-bold">
            1. {LABELS.employerName.en} /{" "}
            <span dir="rtl">{LABELS.employerName.ar}</span>
          </p>
          <BilingualRow
            label={{ en: "Name (EN)", ar: "الاسم (إنجليزي)" }}
            value={data.employerNameEn}
          />
          <BilingualRow
            label={{ en: "Name (AR)", ar: "الاسم (عربي)" }}
            value={data.employerNameAr}
          />
          <BilingualRow label={LABELS.nationalId} value={data.nationalId} />
          <BilingualRow
            label={LABELS.address}
            value={data.employerCity}
            blankClassName="min-w-[12rem]"
          />
          <BilingualRow label={LABELS.civilStatus} value={null} />
          <BilingualRow label={LABELS.contactNumber} value={data.employerPhone} />

          <p className="mt-3 text-[9.5pt] font-semibold">
            ● {LABELS.representedBy.en} /{" "}
            <span dir="rtl">{LABELS.representedBy.ar}</span>
          </p>
          <BlankAgencyBlock title={LABELS.saudiAgencyName} />

          <p className="mt-3 text-[10pt] font-bold">
            C. {LABELS.workerName.en} /{" "}
            <span dir="rtl">{LABELS.workerName.ar}</span>
          </p>
          <BilingualRow
            label={{ en: "Name (EN)", ar: "الاسم (إنجليزي)" }}
            value={data.workerNameEn}
          />
          <BilingualRow
            label={{ en: "Name (AR)", ar: "الاسم (عربي)" }}
            value={data.workerNameAr}
          />
          <BilingualRow
            label={LABELS.addressInPh}
            value={data.workerPhilippinesAddress}
            blankClassName="min-w-[12rem]"
          />
          <BilingualRow label={LABELS.civilStatus} value={null} />
          <BilingualRow label={LABELS.contactNumbers} value={data.workerPhone} />
          <BilingualRow
            label={LABELS.passportNumber}
            value={data.workerPassportNumber}
          />
          <BilingualRow
            label={LABELS.dateAndPlaceOfIssue}
            value={passportIssue}
          />
          <BilingualRow label={LABELS.address} value={null} />

          <BlankAgencyBlock title={LABELS.phAgencyName} />
        </div>
      </PageShell>

      {/* Page 2 — Terms start + site + salary */}
      <PageShell pageNumber={2}>
        <p className="mb-1 text-[9.5pt] font-semibold">{LABELS.voluntarily.en}</p>
        <p className="mb-3 text-[9.5pt] font-semibold" dir="rtl">
          {LABELS.voluntarily.ar}
        </p>

        <div className="mb-3 grid grid-cols-2 gap-3 text-[9.5pt]">
          <p>
            <span className="font-bold">1. {LABELS.siteOfEmployment.en}: </span>
            <MusanedContractField value={data.siteOfEmployment} />
          </p>
          <p dir="rtl" className="text-end">
            <MusanedContractField value={data.siteOfEmployment} />
            <span className="font-bold"> :{LABELS.siteOfEmployment.ar} .1</span>
          </p>
        </div>

        {earlyClauses.map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}
      </PageShell>

      {/* Page 3 */}
      <PageShell pageNumber={3}>
        {midClauses.slice(0, 5).map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}
      </PageShell>

      {/* Page 4 */}
      <PageShell pageNumber={4}>
        {midClauses.slice(5).map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}
        {lateClausesA.map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}
      </PageShell>

      {/* Page 5 */}
      <PageShell pageNumber={5}>
        {lateClausesB.map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}
      </PageShell>

      {/* Page 6 — Closing clauses + start signatures */}
      <PageShell pageNumber={6}>
        {closingClauses.map((clause) => (
          <ClauseBlock
            key={clause.number}
            clause={clause}
            salary={data.monthlySalary}
          />
        ))}

        <p className="mb-1 mt-4 text-[10pt] font-bold">{LABELS.signedBy.en}</p>
        <p className="mb-4 text-[10pt] font-bold" dir="rtl">
          {LABELS.signedBy.ar}
        </p>

        <div className="grid grid-cols-2 gap-6">
          <MusanedSignatureSlot
            imageUrl={data.workerSignatureUrl}
            printedName={workerDisplay}
            labelEn={LABELS.domesticWorker.en}
            labelAr={LABELS.domesticWorker.ar}
          />
          <MusanedSignatureSlot
            imageUrl={data.employerSignatureUrl}
            printedName={employerDisplay}
            labelEn={LABELS.employer.en}
            labelAr={LABELS.employer.ar}
          />
        </div>
      </PageShell>

      {/* Page 7 — Agency signatures */}
      <PageShell pageNumber={7}>
        <div className="grid grid-cols-2 gap-6">
          <MusanedSignatureSlot
            imageUrl={null}
            printedName={null}
            labelEn={LABELS.phAgency.en}
            labelAr={LABELS.phAgency.ar}
          />
          <MusanedSignatureSlot
            imageUrl={null}
            printedName={null}
            labelEn={LABELS.saAgency.en}
            labelAr={LABELS.saAgency.ar}
          />
        </div>
      </PageShell>

      {/* Page 8 — Annex A */}
      <PageShell pageNumber={8}>
        <header className="mb-4 space-y-2 border-b border-black pb-3 text-center">
          <h2 className="text-[11pt] font-bold">{LABELS.annexTitle.en}</h2>
          <h2 className="text-[11pt] font-bold" dir="rtl">
            {LABELS.annexTitle.ar}
          </h2>
        </header>
        <ol className="list-decimal space-y-3 ps-5 text-[10pt]">
          {ANNEX_DUTIES.map((duty, i) => (
            <li key={i} className="grid grid-cols-2 gap-3">
              <span>{duty.en}</span>
              <span dir="rtl" className="text-end">
                {duty.ar}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-dashed border-black/40 py-3"
              aria-hidden
            />
          ))}
        </div>
      </PageShell>
    </div>
  );
}
