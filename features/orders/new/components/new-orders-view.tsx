"use client";

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
import OrdersFilters from "@/features/orders/components/orders-filters";
import StartReviewAction from "@/features/orders/new/components/start-review-action";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import { useRenewalRequestStats } from "@/features/orders/queries/use-renewal-request-stats";
import { DEFAULT_ORDERS_FILTERS } from "@/features/orders/mock-data";
import type { OrderListItem } from "@/features/orders/types";
import {
  getOrderCreatedDisplay,
  getOrderEmployerName,
  getOrderExecutionDisplay,
  getOrderPhoneDisplay,
  getOrderWorkerName,
  parseOrdersFilters,
  serializeOrdersFilters,
  toIsoDate,
  toUiOrderSource,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/receipt-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "epayment" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "manual" as const,
    iconSrc: "/svg/export.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

function formatIndicatorValue(value: number | undefined) {
  if (value === undefined) return "-";
  return String(value).padStart(2, "0");
}

export default function NewOrdersView() {
  const t = useTranslations("Orders.New");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    totalNew,
    eFormCount,
    manualCount,
    totalChangePercent,
    eFormChangePercent,
    manualChangePercent,
    isLoading: isStatsLoading,
  } = useRenewalRequestStats();
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useUrlFilters({
      defaults: DEFAULT_ORDERS_FILTERS,
      serialize: serializeOrdersFilters,
      parse: parseOrdersFilters,
    });
  const [page, setPage] = useState(1);
  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "new",
    uiSource: appliedFilters.source,
    search: appliedFilters.search,
    createdFrom: appliedFilters.fromDate
      ? toIsoDate(appliedFilters.fromDate)
      : undefined,
    createdTo: appliedFilters.toDate
      ? toIsoDate(appliedFilters.toDate)
      : undefined,
    expectedCompletionDate: appliedFilters.expectedExecution
      ? toIsoDate(appliedFilters.expectedExecution)
      : undefined,
    perPage: 10,
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
      id: "customer",
      header: t("table.customer"),
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
      id: "handler",
      header: t("table.handler"),
      cell: (row) => (
        <span className="text-brand-black">
          {getOrderWorkerName(row, locale)}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => {
        const created = getOrderCreatedDisplay(row, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{created.dateLabel}</span>
            <span className="text-xs text-brand-gris">{created.timeLabel}</span>
          </div>
        );
      },
    },
    {
      id: "source",
      header: t("table.source"),
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
              ? t("table.sourceEform")
              : t("table.sourceManual")}
          </Badge>
        );
      },
    },
    {
      id: "executionDate",
      header: t("table.executionDate"),
      cell: (row) => (
        <span className="text-brand-black">
          {getOrderExecutionDisplay(row, locale)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => (
        <Badge className="rounded-full border-transparent bg-[#E8913A]/15 px-3 py-1 text-[#E8913A]">
          {row.status_label || t("table.statusNew")}
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <StartReviewAction
          orderId={String(row.id)}
          orderNumber={row.request_number ?? `#ORD-${row.id}`}
          customerName={getOrderEmployerName(row, locale)}
          handlerName={getOrderWorkerName(row, locale)}
          label={t("table.startReview")}
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((indicator) => {
          let value = "-";
          let change = "-";

          if (isStatsLoading) {
            value = "...";
            change = "...";
          } else if (indicator.key === "total") {
            value = formatIndicatorValue(totalNew);
            change = totalChangePercent;
          } else if (indicator.key === "epayment") {
            value = formatIndicatorValue(eFormCount);
            change = eFormChangePercent;
          } else if (indicator.key === "manual") {
            value = formatIndicatorValue(manualCount);
            change = manualChangePercent;
          }

          return (
            <InfoCard
              key={indicator.key}
              title={t(`indicators.${indicator.key}`)}
              value={value}
              change={change}
              period={t("period")}
              iconSrc={indicator.iconSrc}
              bgClassName={indicator.bgClassName}
            />
          );
        })}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/tag-2.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <OrdersFilters
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
              iconSrc="/svg/receipt-2.svg"
              title={
                isError
                  ? error instanceof Error
                    ? error.message
                    : t("empty.title")
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
