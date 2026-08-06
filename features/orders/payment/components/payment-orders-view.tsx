"use client";

import { SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import ManualOrderButton from "@/components/manual-order-button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import PaymentDeliveryStatusBadge from "@/features/orders/payment/components/payment-delivery-status-badge";
import PaymentOrderActions from "@/features/orders/payment/components/payment-order-actions";
import PaymentOrdersFilters from "@/features/orders/payment/components/payment-orders-filters";
import { DEFAULT_PAYMENT_ORDERS_FILTERS } from "@/features/orders/payment/mock-data";
import {
  usePaymentIndicators,
  usePaymentOrders,
} from "@/features/orders/payment/queries/use-payment-orders";
import type { PaymentOrderRow } from "@/features/orders/types";
import {
  formatIsoDateWithClockTime,
  parsePaymentOrdersFilters,
  serializePaymentOrdersFilters,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "awaitingConfirmation" as const,
    periodKey: "periodAwaitingShare" as const,
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-accent/10",
  },
  {
    key: "paidToday" as const,
    periodKey: "periodPaidShare" as const,
    iconSrc: "/svg/warning-2.svg",
    bgClassName: "bg-brand-success-light",
  },
] as const;

function formatIndicatorValue(value: number) {
  return String(value).padStart(2, "0");
}

export default function PaymentOrdersView() {
  const t = useTranslations("Orders.Payment");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
  } = useUrlFilters({
    defaults: DEFAULT_PAYMENT_ORDERS_FILTERS,
    serialize: serializePaymentOrdersFilters,
    parse: parsePaymentOrdersFilters,
  });

  const handleClearFilters = () => {
    clearFilters();
  };

  const { data: rows = [], isLoading } = usePaymentOrders(appliedFilters);
  const { data: indicators } = usePaymentIndicators();

  const columns: DataTableColumn<PaymentOrderRow>[] = [
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
          <span className="font-semibold text-brand-black">{row.employerName}</span>
          <CopyablePhoneNumber phone={row.employerPhone} />
        </div>
      ),
    },
    {
      id: "worker",
      header: t("table.worker"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">{row.workerName}</span>
      ),
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => {
        const created = formatIsoDateWithClockTime(
          row.createdAtIso,
          row.createdTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{created.dateLabel}</span>
            <span className="text-xs text-brand-gris">{created.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "processedAt",
      header: t("table.processedAt"),
      cell: (row) => {
        const processed = formatIsoDateWithClockTime(
          row.processedAtIso,
          row.processedTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{processed.dateLabel}</span>
            <span className="text-xs text-brand-gris">{processed.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "contractUploadedAt",
      header: t("table.contractUploadedAt"),
      cell: (row) => {
        const uploaded = formatIsoDateWithClockTime(
          row.contractUploadedAtIso,
          row.contractUploadedTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{uploaded.dateLabel}</span>
            <span className="text-xs text-brand-gris">{uploaded.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "type",
      header: t("table.type"),
      cell: (row) => (
        <Badge
          className={
            row.source === "eform"
              ? "w-full rounded-lg border-transparent bg-[#8B6BB5]/15 px-3 py-4 text-[#8B6BB5]"
              : "w-full rounded-lg border-transparent bg-brand-success/15 px-3 py-4 text-brand-success"
          }
        >
          {row.source === "eform"
            ? t("table.typeEform")
            : t("table.typeManual")}
        </Badge>
      ),
    },
    {
      id: "dueFees",
      header: t("table.dueFees"),
      cell: (row) => (
        <span className="font-clash inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-success">
          <span>+{row.dueFees}</span>
          <SaudiRiyal className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        </span>
      ),
    },
    {
      id: "deliveryStatus",
      header: t("table.deliveryStatus"),
      cell: (row) => (
        <PaymentDeliveryStatusBadge status={row.deliveryStatus} />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <PaymentOrderActions
          orderId={row.id}
          orderNumber={row.orderNumber}
        />
      ),
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm text-brand-gris">{t("description")}</p>
        </div>
        <ManualOrderButton />
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INDICATOR_CARDS.map((card) => (
          <InfoCard
            key={card.key}
            title={t(`indicators.${card.key}`)}
            value={formatIndicatorValue(indicators?.[card.key] ?? 0)}
            change={indicators?.change ?? "+24%"}
            period={t(card.periodKey)}
            iconSrc={card.iconSrc}
            bgClassName={card.bgClassName}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/dollar-circle.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <PaymentOrdersFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
          onClear={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/dollar-circle.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
