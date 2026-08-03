"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ManualOrderButton from "@/components/manual-order-button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import ProcessedOrderActions from "@/features/orders/processed/components/processed-order-actions";
import ProcessedOrdersFilters from "@/features/orders/processed/components/processed-orders-filters";
import { DEFAULT_PROCESSED_ORDERS_FILTERS } from "@/features/orders/processed/mock-data";
import { useRenewalRequestProcessedStats } from "@/features/orders/queries/use-renewal-request-processed-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type { OrderListItem } from "@/features/orders/types";
import {
  getOrderCreatedDisplay,
  getOrderEmployerName,
  getOrderPhoneDisplay,
  getOrderProcessedAtDisplay,
  getOrderProcessedByName,
  getOrderRefInitials,
  getOrderWorkerName,
  parseProcessedOrdersFilters,
  serializeProcessedOrdersFilters,
  toIsoDate,
  toUiOrderSource,
  useOrderFilters,
} from "@/features/orders/utils";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/danger.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "eform" as const,
    periodKey: "periodEformShare" as const,
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "manual" as const,
    periodKey: "periodManualShare" as const,
    iconSrc: "/svg/warning-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

function formatIndicatorValue(value: number | undefined) {
  if (value === undefined) return "-";
  return String(value).padStart(2, "0");
}

export default function ProcessedOrdersView() {
  const t = useTranslations("Orders.Processed");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    totalProcessed,
    eFormCount,
    manualCount,
    totalProcessedChangePercent,
    eFormChangePercent,
    manualChangePercent,
    isLoading: isStatsLoading,
  } = useRenewalRequestProcessedStats();
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_PROCESSED_ORDERS_FILTERS,
      serialize: serializeProcessedOrdersFilters,
      parse: parseProcessedOrdersFilters,
    });
  const [page, setPage] = useState(1);
  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "processed",
    uiSource: appliedFilters.orderType,
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
      id: "contractNumber",
      header: t("table.contractNumber"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">
          {row.contract_number || "—"}
        </span>
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
      id: "approvedAt",
      header: t("table.approvedAt"),
      cell: (row) => {
        const processed = getOrderProcessedAtDisplay(row, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{processed.dateLabel}</span>
            <span className="text-xs text-brand-gris">{processed.timeLabel}</span>
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
      id: "reviewer",
      header: t("table.reviewer"),
      cell: (row) => {
        const name = getOrderProcessedByName(row, locale);
        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm" className="size-8">
              <AvatarFallback className="bg-brand-primary/15 text-xs font-semibold text-brand-primary">
                {getOrderRefInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="whitespace-nowrap text-brand-black">{name}</span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => (
        <Badge className="inline-flex items-center gap-1.5 rounded-xl border-transparent bg-brand-success/15 p-5 text-xs font-medium text-brand-success">
          <span
            className="size-1.5 shrink-0 rounded-full bg-brand-success"
            aria-hidden
          />
          <span>{row.status_label || t("table.statusProcessed")}</span>
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <ProcessedOrderActions
          orderId={String(row.id)}
          orderNumber={row.request_number ?? `#ORD-${row.id}`}
          employerName={getOrderEmployerName(row, locale)}
          workerName={getOrderWorkerName(row, locale)}
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
            value = formatIndicatorValue(totalProcessed);
            change = totalProcessedChangePercent;
          } else if (indicator.key === "eform") {
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
              period={t(indicator.periodKey)}
              iconSrc={indicator.iconSrc}
              bgClassName={indicator.bgClassName}
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

        <ProcessedOrdersFilters
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
              iconSrc="/svg/check.svg"
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
