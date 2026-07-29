"use client";

import { Phone, Plus, SaudiRiyal } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  parsePaymentOrdersFilters,
  serializePaymentOrdersFilters,
  useOrderFilters,
} from "@/features/orders/utils";

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
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_PAYMENT_ORDERS_FILTERS,
      serialize: serializePaymentOrdersFilters,
      parse: parsePaymentOrdersFilters,
    });

  const { data: rows = [], isLoading } = usePaymentOrders(appliedFilters);
  const { data: indicators } = usePaymentIndicators();

  const columns: DataTableColumn<PaymentOrderRow>[] = [
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
      id: "processedAt",
      header: t("table.processedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.processedDate}</span>
          <span className="text-xs text-brand-gris">{row.processedTime}</span>
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
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("manualOrder")}</span>
        </Button>
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
        />

        <DataTable
          columns={columns}
          data={isLoading ? [] : rows}
          getRowId={(row) => row.id}
          selectable
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
