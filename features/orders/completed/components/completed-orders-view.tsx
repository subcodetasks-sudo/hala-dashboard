"use client";

import { SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import ManualOrderButton from "@/components/manual-order-button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import CompletedDeliveryStatusBadge from "@/features/orders/completed/components/completed-delivery-status-badge";
import CompletedOrderActions from "@/features/orders/completed/components/completed-order-actions";
import CompletedOrdersFilters from "@/features/orders/completed/components/completed-orders-filters";
import CompletedPaymentMethodBadge from "@/features/orders/completed/components/completed-payment-method-badge";
import { useRenewalRequestCompletedStats } from "@/features/orders/completed/queries/use-renewal-request-completed-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type {
  CompletedOrdersFilterValues,
  OrderListItem,
} from "@/features/orders/types";
import {
  formatApiDateTime,
  getOrderEmployerName,
  getOrderPhoneDisplay,
  getOrderWorkerName,
  parseCompletedOrdersFilters,
  serializeCompletedOrdersFilters,
  toIsoDate,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";

const DEFAULT_COMPLETED_ORDERS_FILTERS: CompletedOrdersFilterValues = {
  fromDate: undefined,
  toDate: undefined,
  search: "",
  orderType: "all",
  paymentMethod: "all",
  deliveryStatus: "all",
};

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "paidOnline" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-recive.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "paidManual" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-send.svg",
    bgClassName: "bg-brand-success-light",
  },
  {
    key: "withDelivery" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/routing-2.svg",
    bgClassName: "bg-[#8B6BB5]/10",
  },
  {
    key: "pickup" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/user-square.svg",
    bgClassName: "bg-[#FDEAF7]",
  },
] as const;

export default function CompletedOrdersView() {
  const t = useTranslations("Orders.Completed");
  const locale = useLocale() === "en" ? "en" : "ar";
  const { data: stats, isLoading: isStatsLoading } =
    useRenewalRequestCompletedStats();
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useUrlFilters({
      defaults: DEFAULT_COMPLETED_ORDERS_FILTERS,
      serialize: serializeCompletedOrdersFilters,
      parse: parseCompletedOrdersFilters,
    });
  const [page, setPage] = useState(1);
  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "completed",
    uiSource: appliedFilters.orderType,
    deliveryRequired:
      appliedFilters.deliveryStatus === "all"
        ? undefined
        : appliedFilters.deliveryStatus === "required",
    paymentType:
      appliedFilters.paymentMethod === "all"
        ? undefined
        : appliedFilters.paymentMethod,
    search: appliedFilters.search,
    createdFrom: appliedFilters.fromDate
      ? toIsoDate(appliedFilters.fromDate)
      : undefined,
    createdTo: appliedFilters.toDate
      ? toIsoDate(appliedFilters.toDate)
      : undefined,
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
      id: "paidAt",
      header: t("table.paidAt"),
      cell: (row) => {
        const paid = formatApiDateTime(row.payment_date ?? row.paid_at, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{paid.dateLabel}</span>
            <span className="text-xs text-brand-gris">{paid.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "paymentMethod",
      header: t("table.paymentMethod"),
      cell: (row) => {
        const method = row.payment_method ?? row.payment_type;
        return method ? (
          <CompletedPaymentMethodBadge method={method} />
        ) : (
          <span className="text-brand-gris">—</span>
        );
      },
    },
    {
      id: "dueFees",
      header: t("table.dueFees"),
      cell: (row) => {
        const fees = row.fees_due ?? row.total_fee;
        return fees ? (
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
        <CompletedDeliveryStatusBadge
          status={row.delivery_required ? "required" : "notRequired"}
        />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <CompletedOrderActions orderId={String(row.id)} />,
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {INDICATOR_CARDS.map((card) => {
          const values = {
            total: stats?.total_completed,
            paidOnline: stats?.paid_online,
            paidManual: stats?.paid_manual,
            withDelivery: stats?.delivery_required,
            pickup: stats?.pickup,
          };

          return (
            <InfoCard
              key={card.key}
              title={t(`indicators.${card.key}`)}
              value={isStatsLoading ? "..." : (values[card.key] ?? 0)}
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <CompletedOrdersFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.id)}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/shield-tick.svg"
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
