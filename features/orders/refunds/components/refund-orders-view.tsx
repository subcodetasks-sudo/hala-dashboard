"use client";

import { SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import ManualOrderButton from "@/components/manual-order-button";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import RefundOrderActions from "@/features/orders/refunds/components/refund-order-actions";
import RefundOrdersFilters from "@/features/orders/refunds/components/refund-orders-filters";
import RefundStatusBadge from "@/features/orders/refunds/components/refund-status-badge";
import { DEFAULT_REFUND_ORDERS_FILTERS } from "@/features/orders/refunds/mock-data";
import {
  useRefundIndicators,
  useRefundOrders,
} from "@/features/orders/refunds/queries/use-refund-orders";
import type { RefundOrderRow } from "@/features/orders/types";
import {
  formatIsoDateWithClockTime,
  formatRelativeTimeLabel,
  parseRefundOrdersFilters,
  serializeRefundOrdersFilters,
  useOrderFilters,
} from "@/features/orders/utils";
import { cn } from "@/lib/utils";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "pending" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-recive.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "refunded" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/money-send.svg",
    bgClassName: "bg-brand-success-light",
  },
  {
    key: "totalAmount" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/shield-tick.svg",
    bgClassName: "bg-brand-purple/5",
  },
] as const;

export default function RefundOrdersView() {
  const t = useTranslations("Orders.Refunds");
  const locale = useLocale() === "en" ? "en" : "ar";
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_REFUND_ORDERS_FILTERS,
      serialize: serializeRefundOrdersFilters,
      parse: parseRefundOrdersFilters,
    });

  const { data: rows = [], isLoading } = useRefundOrders(appliedFilters);
  const { data: indicators } = useRefundIndicators();

  const columns: DataTableColumn<RefundOrderRow>[] = [
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
      id: "type",
      header: t("table.type"),
      cell: (row) => (
        <Badge
          className={
            row.source === "eform"
              ? "w-full rounded-lg border-transparent bg-brand-purple/15 px-3 py-4 font-bold text-brand-black"
              : "w-full rounded-lg border-transparent bg-brand-success/15 px-3 py-4 font-bold text-brand-success"
          }
        >
          {row.source === "eform" ? t("table.typeEform") : t("table.typeManual")}
        </Badge>
      ),
    },
    {
      id: "requestedAt",
      header: t("table.requestedAt"),
      cell: (row) => {
        const requested = formatIsoDateWithClockTime(
          row.requestedAtIso,
          row.requestedTime,
          locale,
        );
        const relative = formatRelativeTimeLabel(
          row.requestedAtDateTime,
          locale,
        );
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-brand-black">{requested.dateLabel}</span>
            <span className="text-xs text-brand-gris">
              {requested.timeLabel}
              {relative ? ` • ${relative}` : null}
            </span>
          </div>
        );
      },
    },
    {
      id: "amount",
      header: t("table.amount"),
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 whitespace-nowrap font-semibold",
            row.status === "pending" ? "text-brand-accent" : "text-brand-gris",
          )}
        >
          <span>-{row.refundAmount}</span>
          <SaudiRiyal className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <RefundStatusBadge status={row.status} />,
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <RefundOrderActions orderId={row.id} />,
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {INDICATOR_CARDS.map((card) => {
          const raw = indicators?.[card.key] ?? 0;
          const value =
            card.key === "totalAmount"
              ? String(raw)
              : String(raw).padStart(2, "0");
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <RefundOrdersFilters
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
              iconSrc="/svg/refresh-2.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
