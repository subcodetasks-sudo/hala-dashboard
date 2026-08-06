"use client";

import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import CancelledOrdersFilters from "@/features/orders/cancelled/components/cancelled-orders-filters";
import CancelledSourceBadge from "@/features/orders/cancelled/components/cancelled-source-badge";
import CancelledStatusBadge from "@/features/orders/cancelled/components/cancelled-status-badge";
import { DEFAULT_CANCELLED_ORDERS_FILTERS } from "@/features/orders/cancelled/mock-data";
import ManualOrderButton from "@/components/manual-order-button";
import { useRenewalRequestCancelledStats } from "@/features/orders/cancelled/queries/use-renewal-request-cancelled-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type { OrderListItem } from "@/features/orders/types";
import {
  formatStatsCount,
  getOrderCancelledAtDisplay,
  getOrderEmployerName,
  getOrderPhoneDisplay,
  getOrderWorkerName,
  parseCancelledOrdersFilters,
  serializeCancelledOrdersFilters,
  toIsoDate,
  toUiOrderSource,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Link } from "@/i18n/navigation";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "byCustomer" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-recive.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "byAdmin" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-send.svg",
    bgClassName: "bg-brand-success-light",
  },
] as const;

function matchesCancellationReason(
  item: OrderListItem,
  reason: (typeof DEFAULT_CANCELLED_ORDERS_FILTERS)["cancellationReason"],
) {
  if (reason === "all") return true;
  return (item.cancellation_reason ?? "").toLowerCase() === reason;
}

export default function CancelledOrdersView() {
  const t = useTranslations("Orders.Cancelled");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    totalCancelled,
    cancelledByCustomer,
    cancelledByAdmin,
    totalCancelledChangePercent,
    cancelledByCustomerChangePercent,
    cancelledByAdminChangePercent,
    isLoading: isStatsLoading,
  } = useRenewalRequestCancelledStats();
  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
  } = useUrlFilters({
    defaults: DEFAULT_CANCELLED_ORDERS_FILTERS,
    serialize: serializeCancelledOrdersFilters,
    parse: parseCancelledOrdersFilters,
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

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "cancelled",
    uiSource: appliedFilters.orderType,
    search: appliedFilters.search,
    perPage: 10,
    page,
  });

  const cancelledAtIso = appliedFilters.cancelledAt
    ? toIsoDate(appliedFilters.cancelledAt)
    : undefined;

  const rows = (data?.items ?? []).filter((item) => {
    if (
      appliedFilters.cancellationSource !== "all" &&
      item.cancellation_source !== appliedFilters.cancellationSource
    ) {
      return false;
    }

    if (!matchesCancellationReason(item, appliedFilters.cancellationReason)) {
      return false;
    }

    if (cancelledAtIso) {
      const cancelledIso = getOrderCancelledAtDisplay(item, locale).isoDate;
      if (cancelledIso !== cancelledAtIso) return false;
    }

    return true;
  });

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
      id: "cancelledAt",
      header: t("table.cancelledAt"),
      cell: (row) => {
        const cancelled = getOrderCancelledAtDisplay(row, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{cancelled.dateLabel}</span>
            <span className="text-xs text-brand-gris">{cancelled.timeLabel}</span>
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
      id: "cancellationReason",
      header: t("table.cancellationReason"),
      cell: (row) => (
        <span className="text-brand-black">
          {row.cancellation_reason_label?.trim() || "—"}
        </span>
      ),
    },
    {
      id: "by",
      header: t("table.by"),
      cell: (row) => (
        <CancelledSourceBadge
          source={row.cancellation_source}
          label={row.cancellation_source_label}
        />
      ),
    },

    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <Button
          type="button"
          asChild
          className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90"
        >
          <Link href={`/orders/${row.id}`} aria-label={t("table.viewOrder")}>
            <Eye className="size-4" strokeWidth={1.75} />
          </Link>
        </Button>
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
        {INDICATOR_CARDS.map((card) => {
          let value = "-";
          let change = "-";

          if (card.key === "total") {
            value = formatStatsCount(totalCancelled, isStatsLoading);
            change = totalCancelledChangePercent;
          } else if (card.key === "byCustomer") {
            value = formatStatsCount(cancelledByCustomer, isStatsLoading);
            change = cancelledByCustomerChangePercent;
          } else {
            value = formatStatsCount(cancelledByAdmin, isStatsLoading);
            change = cancelledByAdminChangePercent;
          }

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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <CancelledOrdersFilters
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
              iconSrc="/svg/forbidden-2.svg"
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
