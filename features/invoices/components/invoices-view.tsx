"use client";

import { SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { CopyableInvoiceNumber } from "@/features/invoices/components/copyable-invoice-number";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import InvoiceActions from "@/features/invoices/components/invoice-actions";
import InvoiceContractStatusBadge from "@/features/invoices/components/invoice-contract-status-badge";
import InvoicePaymentMethodBadge from "@/features/invoices/components/invoice-payment-method-badge";
import InvoicesFilters from "@/features/invoices/components/invoices-filters";
import { DEFAULT_INVOICES_FILTERS } from "@/features/invoices/mock-data";
import {
  useInvoiceIndicators,
  useInvoices,
} from "@/features/invoices/queries/use-invoices";
import type { InvoiceRow } from "@/features/invoices/types";
import {
  parseInvoicesFilters,
  serializeInvoicesFilters,
} from "@/features/invoices/utils/filter-query-params";
import {
  formatIsoDateWithClockTime,
  useOrderFilters,
} from "@/features/orders/utils";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "totalAmount" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-recive.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "online" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-send.svg",
    bgClassName: "bg-brand-success-light",
  },
  {
    key: "manual" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/shield-tick.svg",
    bgClassName: "bg-brand-purple/5",
  },
] as const;

/** Financial figures always use Western (English) digits. */
function formatAmount(value: number): string {
  return value.toLocaleString("en-US");
}

export default function InvoicesView() {
  const t = useTranslations("Invoices");
  const locale = useLocale() === "en" ? "en" : "ar";
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_INVOICES_FILTERS,
      serialize: serializeInvoicesFilters,
      parse: parseInvoicesFilters,
    });

  const { data: rows = [], isLoading } = useInvoices(appliedFilters);
  const { data: indicators } = useInvoiceIndicators();

  const columns: DataTableColumn<InvoiceRow>[] = [
    {
      id: "invoiceNumber",
      header: t("table.invoiceNumber"),
      cell: (row) => (
        <CopyableInvoiceNumber
          invoiceNumber={row.invoiceNumber}
          className="font-semibold text-brand-black"
        />
      ),
    },
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <CopyableOrderNumber
          orderNumber={row.orderNumber}
          className="font-semibold text-brand-black"
        />
      ),
    },
    {
      id: "employer",
      header: t("table.employer"),
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-brand-black">
            {row.employerName}
          </span>
          <CopyablePhoneNumber phone={row.employerPhone} />
        </div>
      ),
    },
    {
      id: "worker",
      header: t("table.worker"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">
          {row.workerName}
        </span>
      ),
    },
    {
      id: "paidAt",
      header: t("table.paidAt"),
      cell: (row) => {
        const paid = formatIsoDateWithClockTime(
          row.paidAtIso,
          row.paidTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{paid.dateLabel}</span>
            <span className="text-xs text-brand-gris">{paid.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "amount",
      header: t("table.amount"),
      cell: (row) => (
        <span className="font-clash inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-success">
          <span dir="ltr">{formatAmount(row.amount)}</span>
          <SaudiRiyal
            className="size-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
      ),
    },
    {
      id: "paymentMethod",
      header: t("table.paymentMethod"),
      cell: (row) => (
        <InvoicePaymentMethodBadge method={row.paymentMethod} />
      ),
    },
    {
      id: "contract",
      header: t("table.contract"),
      cell: (row) => (
        <InvoiceContractStatusBadge status={row.contractStatus} />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <InvoiceActions orderId={row.orderId} orderNumber={row.orderNumber} />
      ),
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm text-brand-gris">{t("description")}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {INDICATOR_CARDS.map((card) => {
          const raw = indicators?.[card.key] ?? 0;
          const value =
            card.key === "totalAmount" ? (
              <span className="inline-flex items-center gap-1.5" dir="ltr">
                <SaudiRiyal
                  className="size-7 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span>{formatAmount(raw)}</span>
              </span>
            ) : (
              String(raw).padStart(2, "0")
            );
          const change = indicators?.change ?? "-";

          return (
            <InfoCard
              key={card.key}
              title={t(`indicators.${card.key}`)}
              value={value}
              change={change}
              period={t(card.periodKey)}
              iconSrc={card.iconSrc}
              bgClassName={card.bgClassName}
            />
          );
        })}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/receipt-2.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <InvoicesFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/receipt-2.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
