"use client";

import { Phone, Plus, SaudiRiyal } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import CompletedDeliveryStatusBadge from "@/features/orders/completed/components/completed-delivery-status-badge";
import CompletedOrderActions from "@/features/orders/completed/components/completed-order-actions";
import CompletedOrdersFilters from "@/features/orders/completed/components/completed-orders-filters";
import CompletedPaymentMethodBadge from "@/features/orders/completed/components/completed-payment-method-badge";
import { DEFAULT_COMPLETED_ORDERS_FILTERS } from "@/features/orders/completed/mock-data";
import {
  useCompletedIndicators,
  useCompletedOrders,
} from "@/features/orders/completed/queries/use-completed-orders";
import type { CompletedOrderRow } from "@/features/orders/types";
import {
  parseCompletedOrdersFilters,
  serializeCompletedOrdersFilters,
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
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_COMPLETED_ORDERS_FILTERS,
      serialize: serializeCompletedOrdersFilters,
      parse: parseCompletedOrdersFilters,
    });

  const { data: rows = [], isLoading } = useCompletedOrders(appliedFilters);
  const { data: indicators } = useCompletedIndicators();

  const columns: DataTableColumn<CompletedOrderRow>[] = [
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">{row.orderNumber}</span>
      ),
    },
    {
      id: "employer",
      header: t("table.employer"),
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-brand-black">{row.employerName}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-gris">
            <Phone className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span dir="ltr">{row.employerPhone}</span>
          </span>
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
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.createdDate}</span>
          <span className="text-xs text-brand-gris">{row.createdTime}</span>
        </div>
      ),
    },
    {
      id: "contractUploadedAt",
      header: t("table.contractUploadedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.contractUploadedDate}</span>
          <span className="text-xs text-brand-gris">
            {row.contractUploadedTime}
          </span>
        </div>
      ),
    },
    {
      id: "paidAt",
      header: t("table.paidAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.paidDate}</span>
          <span className="text-xs text-brand-gris">{row.paidTime}</span>
        </div>
      ),
    },
    {
      id: "paymentMethod",
      header: t("table.paymentMethod"),
      cell: (row) => (
        <CompletedPaymentMethodBadge method={row.paymentMethod} />
      ),
    },
    {
      id: "dueFees",
      header: t("table.dueFees"),
      cell: (row) => (
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-success">
          <span>+{row.dueFees}</span>
          <SaudiRiyal className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        </span>
      ),
    },
    {
      id: "deliveryStatus",
      header: t("table.deliveryStatus"),
      cell: (row) => (
        <CompletedDeliveryStatusBadge status={row.deliveryStatus} />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <CompletedOrderActions orderId={row.id} />,
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
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("manualOrder")}</span>
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {INDICATOR_CARDS.map((card) => (
          <InfoCard
            key={card.key}
            title={t(`indicators.${card.key}`)}
            value={indicators?.[card.key] ?? 0}
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <CompletedOrdersFilters
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
              iconSrc="/svg/shield-tick.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
