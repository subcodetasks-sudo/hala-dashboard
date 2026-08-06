"use client";

import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import PendingOrdersFilters from "@/features/orders/pending/components/pending-orders-filters";
import SuspensionReasonBadge from "@/features/orders/pending/components/suspension-reason-badge";
import { DEFAULT_PENDING_ORDERS_FILTERS } from "@/features/orders/pending/mock-data";
import { useRenewalRequestHeldStats } from "@/features/orders/pending/queries/use-renewal-request-held-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type { OrderListItem } from "@/features/orders/types";
import {
  getOrderCreatedDisplay,
  getOrderEmployerName,
  getOrderHeldAtDisplay,
  getOrderHeldByName,
  getOrderPhoneDisplay,
  getOrderRefInitials,
  getOrderWorkerName,
  parsePendingOrdersFilters,
  serializePendingOrdersFilters,
  toIsoDate,
} from "@/features/orders/utils";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Link } from "@/i18n/navigation";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/danger.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "incompleteData" as const,
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "missingDocuments" as const,
    iconSrc: "/svg/warning-2.svg",
    bgClassName: "bg-brand-primary/10",
  },
];

function formatIndicatorValue(value: number | undefined) {
  if (value === undefined) return "-";
  return String(value).padStart(2, "0");
}

export default function PendingOrdersView() {
  const t = useTranslations("Orders.Pending");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    totalHeld,
    incompleteDataCount,
    missingDocumentsCount,
    totalHeldChangePercent,
    incompleteDataChangePercent,
    missingDocumentsChangePercent,
    isLoading: isStatsLoading,
  } = useRenewalRequestHeldStats();
  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
  } = useUrlFilters({
    defaults: DEFAULT_PENDING_ORDERS_FILTERS,
    serialize: serializePendingOrdersFilters,
    parse: parsePendingOrdersFilters,
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
    status: "held",
    search: appliedFilters.search,
    createdFrom: appliedFilters.fromDate
      ? toIsoDate(appliedFilters.fromDate)
      : undefined,
    createdTo: appliedFilters.toDate
      ? toIsoDate(appliedFilters.toDate)
      : undefined,
    holdReason:
      appliedFilters.suspensionReason !== "all"
        ? appliedFilters.suspensionReason
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
      id: "suspensionReason",
      header: t("table.suspensionReason"),
      cell: (row) => (
        <SuspensionReasonBadge
          reason={row.hold_reason || "other"}
          label={row.hold_reason_label}
        />
      ),
    },
    {
      id: "suspendedAt",
      header: t("table.suspendedAt"),
      cell: (row) => {
        const heldAt = getOrderHeldAtDisplay(row, locale);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{heldAt.dateLabel}</span>
            <span className="text-xs text-brand-gris">{heldAt.timeLabel}</span>
          </div>
        );
      },
    },

    {
      id: "suspendedBy",
      header: t("table.suspendedBy"),
      cell: (row) => {
        const name = getOrderHeldByName(row, locale);
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
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <Button
          type="button"
          asChild
          className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90"
        >
          <Link
            href={`/orders/${row.id}`}
            aria-label={t("table.viewOrder")}
          >
            <Eye className="size-4" strokeWidth={1.75} />
          </Link>
        </Button>
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((indicator) => {
          let value = "-";
          let change = "-";

          if (isStatsLoading) {
            value = "...";
            change = "...";
          } else if (indicator.key === "total") {
            value = formatIndicatorValue(totalHeld);
            change = totalHeldChangePercent;
          } else if (indicator.key === "incompleteData") {
            value = formatIndicatorValue(incompleteDataCount);
            change = incompleteDataChangePercent;
          } else if (indicator.key === "missingDocuments") {
            value = formatIndicatorValue(missingDocumentsCount);
            change = missingDocumentsChangePercent;
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <PendingOrdersFilters
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
