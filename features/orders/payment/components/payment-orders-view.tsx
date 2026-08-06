"use client";

import { SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import ManualOrderButton from "@/components/manual-order-button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import PaymentDeliveryStatusBadge from "@/features/orders/payment/components/payment-delivery-status-badge";
import PaymentOrderActions from "@/features/orders/payment/components/payment-order-actions";
import PaymentOrdersFilters from "@/features/orders/payment/components/payment-orders-filters";
import { useRenewalRequestPaymentStats } from "@/features/orders/payment/queries/use-renewal-request-payment-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type {
  OrderListItem,
  PaymentOrdersFilterValues,
} from "@/features/orders/types";
import {
  formatApiDateTime,
  formatStatsCount,
  getOrderEmployerName,
  getOrderPhoneDisplay,
  getOrderWorkerName,
  parsePaymentOrdersFilters,
  serializePaymentOrdersFilters,
  toIsoDate,
  toUiOrderSource,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";

const DEFAULT_PAYMENT_ORDERS_FILTERS: PaymentOrdersFilterValues = {
  createdAt: undefined,
  contractUploadedAt: undefined,
  search: "",
  orderType: "all",
  deliveryStatus: "all",
};

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

export default function PaymentOrdersView() {
  const t = useTranslations("Orders.Payment");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    awaitingPayment,
    paidToday,
    isLoading: isStatsLoading,
  } = useRenewalRequestPaymentStats();
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
  const [page, setPage] = useState(1);

  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const handleClearFilters = () => {
    setPage(1);
    clearFilters();
  };

  const createdIso = appliedFilters.createdAt
    ? toIsoDate(appliedFilters.createdAt)
    : undefined;
  const contractIso = appliedFilters.contractUploadedAt
    ? toIsoDate(appliedFilters.contractUploadedAt)
    : undefined;

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "awaiting_payment",
    uiSource: appliedFilters.orderType,
    deliveryRequired:
      appliedFilters.deliveryStatus === "all"
        ? undefined
        : appliedFilters.deliveryStatus === "required",
    search: appliedFilters.search,
    createdFrom: createdIso,
    createdTo: createdIso,
    finalContractFrom: contractIso,
    finalContractTo: contractIso,
    perPage: 15,
    page,
  });
  const rows = data?.items ?? [];

  const columns: DataTableColumn<OrderListItem>[] = [
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <CopyableOrderNumber
          orderNumber={row.request_number ?? `#ORD-${row.id}`}
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
            {getOrderEmployerName(row, locale)}
          </span>
          <CopyablePhoneNumber phone={getOrderPhoneDisplay(row)} />
        </div>
      ),
    },
    {
      id: "worker",
      header: t("table.worker"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">
          {getOrderWorkerName(row, locale)}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => {
        const created = formatApiDateTime(row.created_at, locale);
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
        const processed = formatApiDateTime(row.processed_at, locale);
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
        const uploaded = formatApiDateTime(
          row.contract_uploaded_at ?? row.final_contract_uploaded_at,
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
      cell: (row) => {
        const source = toUiOrderSource(row.source);
        return (
          <Badge
            className={
              source === "eform"
                ? "w-full rounded-lg border-transparent bg-[#8B6BB5]/15 px-3 py-4 text-[#8B6BB5]"
                : "w-full rounded-lg border-transparent bg-brand-success/15 px-3 py-4 text-brand-success"
            }
          >
            {source === "eform"
              ? t("table.typeEform")
              : t("table.typeManual")}
          </Badge>
        );
      },
    },
    {
      id: "dueFees",
      header: t("table.dueFees"),
      cell: (row) => {
        const fees = row.fees_due ?? row.total_fee;
        return fees != null && fees !== "" ? (
          <span className="font-clash inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-success">
            <span>+{fees}</span>
            <SaudiRiyal
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        ) : (
          <span className="text-brand-gris">—</span>
        );
      },
    },
    {
      id: "deliveryStatus",
      header: t("table.deliveryStatus"),
      cell: (row) => (
        <PaymentDeliveryStatusBadge
          status={row.delivery_required ? "required" : "notRequired"}
        />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <PaymentOrderActions
          orderId={String(row.id)}
          orderNumber={row.request_number ?? `#ORD-${row.id}`}
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
        {INDICATOR_CARDS.map((card) => {
          const value =
            card.key === "awaitingConfirmation"
              ? formatStatsCount(awaitingPayment, isStatsLoading)
              : formatStatsCount(paidToday, isStatsLoading);

          return (
            <InfoCard
              key={card.key}
              title={t(`indicators.${card.key}`)}
              value={value}
              change="-"
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
            src="/svg/dollar-circle.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <PaymentOrdersFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.id)}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/dollar-circle.svg"
              title={
                isError && error instanceof Error
                  ? error.message
                  : t("empty.title")
              }
              description={isError ? " " : t("empty.description")}
            />
          }
        />

        <TablePagination
          page={data?.currentPage ?? page}
          lastPage={data?.lastPage ?? 1}
          total={data?.total}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
