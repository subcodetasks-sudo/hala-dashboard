"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import AddTrackingModal from "@/features/tracking/components/add-tracking-dialog";
import TrackingFilters from "@/features/tracking/components/tracking-filters";
import TrackingStatusBadge from "@/features/tracking/components/tracking-status-badge";
import {
  DEFAULT_TRACKING_FILTERS,
  SHIPPING_COMPANY_LABELS,
} from "@/features/tracking/mock-data";
import {
  useTrackingIndicators,
  useTrackingNumbers,
} from "@/features/tracking/queries/use-tracking";
import type { TrackingNumberRow } from "@/features/tracking/types";
import {
  parseTrackingFilters,
  serializeTrackingFilters,
} from "@/features/tracking/utils/filter-query-params";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  formatIsoDateWithClockTime,
  formatRelativeTimeLabel,
  type AppLocale,
} from "@/lib/format-datetime";
import { formatChangePercent, formatStatsCount } from "@/lib/format-stats";

const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "available" as const,
    iconSrc: "/svg/money-recive.svg",
    bgClassName: "bg-brand-light-yellow",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "used" as const,
    iconSrc: "/svg/money-send.svg",
    bgClassName: "bg-[#eaf8f1]",
    valueClassName: "text-brand-dark-blue",
  },
] as const;

function TrackingDateCell({
  isoDate,
  clockTime,
  locale,
}: {
  isoDate: string;
  clockTime: string;
  locale: AppLocale;
}) {
  const formatted = formatIsoDateWithClockTime(isoDate, clockTime, locale);
  const relative = formatRelativeTimeLabel(
    `${isoDate} ${clockTimeToApiTime(clockTime)}`,
    locale,
  );

  return (
    <div className="flex flex-col gap-0.5 whitespace-nowrap">
      <span className="text-brand-black">{formatted.dateLabel}</span>
      <span className="text-xs text-brand-gris">{formatted.timeLabel}</span>
      {relative ? (
        <span className="text-xs text-brand-gris">{relative}</span>
      ) : null}
    </div>
  );
}

/** Convert mock clock time (`10:30 AM`) to `HH:mm:ss` for relative helpers. */
function clockTimeToApiTime(clockTime: string): string {
  const match = clockTime
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "00:00:00";

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

export default function TrackingView() {
  const t = useTranslations("Tracking");
  const locale = useLocale() as AppLocale;
  const [page, setPage] = useState(1);

  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useUrlFilters({
      defaults: DEFAULT_TRACKING_FILTERS,
      serialize: serializeTrackingFilters,
      parse: parseTrackingFilters,
    });

  const {
    data: rows = [],
    isLoading,
  } = useTrackingNumbers(appliedFilters);
  const { data: indicators, isLoading: isStatsLoading } =
    useTrackingIndicators();

  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const columns: DataTableColumn<TrackingNumberRow>[] = [
    {
      id: "trackingNumber",
      header: t("table.trackingNumber"),
      cell: (row) => (
        <span className="font-bold text-brand-black">{row.trackingNumber}</span>
      ),
    },
    {
      id: "shippingCompany",
      header: t("table.shippingCompany"),
      cell: (row) => (
        <span className="font-medium text-brand-black">
          {SHIPPING_COMPANY_LABELS[row.shippingCompany]}
        </span>
      ),
    },
    {
      id: "entryDate",
      header: t("table.entryDate"),
      cell: (row) => (
        <TrackingDateCell
          isoDate={row.entryAtIso}
          clockTime={row.entryTime}
          locale={locale}
        />
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <TrackingStatusBadge status={row.status} />,
    },
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.orderNumber || "--"}
        </span>
      ),
    },
    {
      id: "customer",
      header: t("table.customer"),
      cell: (row) =>
        row.customerName ? (
          <div className="flex flex-col gap-0.5">
            <p className="font-medium text-brand-black">{row.customerName}</p>
            {row.customerPhone ? (
              <p className="text-xs text-brand-gris">{row.customerPhone}</p>
            ) : null}
          </div>
        ) : (
          <span className="text-brand-gris">--</span>
        ),
    },
    {
      id: "usageDate",
      header: t("table.usageDate"),
      cell: (row) =>
        row.usageAtIso && row.usageTime ? (
          <TrackingDateCell
            isoDate={row.usageAtIso}
            clockTime={row.usageTime}
            locale={locale}
          />
        ) : (
          <span className="text-brand-gris">--</span>
        ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: () => (
        <Button variant="ghost" size="sm" className="h-8 px-2">
          -
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      {/* Top Bar / Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-brand-gris">
            {t("subtitle")}
          </p>
        </div>
        <AddTrackingModal />
      </div>

      {/* Indicator Cards Grid */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((card) => {
          const rawVal = indicators?.[card.key];
          const rawChange = indicators?.growthPercentage;
          return (
            <InfoCard
              key={card.key}
              title={t(`indicators.${card.key}`)}
              value={formatStatsCount(rawVal, isStatsLoading)}
              change={formatChangePercent(rawChange, isStatsLoading)}
              period={t("periodWeek")}
              iconSrc={card.iconSrc}
              bgClassName={card.bgClassName}
              valueClassName={card.valueClassName}
            />
          );
        })}
      </section>

      {/* Main Section */}
      <section className="flex flex-col gap-4">
        {/* Table Title Header */}
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/tag-2.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("logTitle")}</span>
        </h2>

        {/* Filter Bar */}
        <TrackingFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
        />

        {/* Data Table or Empty State */}
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          selectable
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/tag-2.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />

        {/* Table Pagination */}
        <TablePagination
          page={page}
          lastPage={1}
          total={rows.length}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
