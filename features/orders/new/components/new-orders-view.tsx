"use client";

import { Eye, Phone, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrdersFilters from "@/features/orders/components/orders-filters";
import StartReviewDialog from "@/features/orders/new/components/start-review-dialog";
import {
  StartReviewProvider,
  useStartReview,
} from "@/features/orders/new/context/start-review-context";
import {
  DEFAULT_ORDERS_FILTERS,
  filterNewOrders,
  NEW_ORDER_INDICATORS,
  NEW_ORDERS,
} from "@/features/orders/mock-data";
import type {
  NewOrderRow,
  OrdersFilterValues,
} from "@/features/orders/types";

export default function NewOrdersView() {
  return (
    <StartReviewProvider>
      <NewOrdersViewContent />
      <StartReviewDialog />
    </StartReviewProvider>
  );
}

function NewOrdersViewContent() {
  const t = useTranslations("Orders.New");
  const { openStartReview } = useStartReview();
  const [draftFilters, setDraftFilters] =
    useState<OrdersFilterValues>(DEFAULT_ORDERS_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<OrdersFilterValues>(DEFAULT_ORDERS_FILTERS);

  const rows = filterNewOrders(NEW_ORDERS, appliedFilters);

  const columns: DataTableColumn<NewOrderRow>[] = [
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">{row.orderNumber}</span>
      ),
    },
    {
      id: "customer",
      header: t("table.customer"),
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-brand-black">{row.customerName}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-gris">
            <Phone className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span dir="ltr">{row.customerPhone}</span>
          </span>
        </div>
      ),
    },
    {
      id: "handler",
      header: t("table.handler"),
      cell: (row) => (
        <span className="text-brand-black">{row.handlerName}</span>
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
      id: "source",
      header: t("table.source"),
      cell: (row) => (
        <Badge
          className={
            row.source === "eform"
              ? "w-full rounded-lg border-transparent bg-[#8B6BB5]/15 px-3 py-4 text-[#8B6BB5]"
              : "w-full rounded-lg border-transparent bg-brand-success/15 px-3 py-4 text-brand-success"
          }
        >
          {row.source === "eform"
            ? t("table.sourceEform")
            : t("table.sourceManual")}
        </Badge>
      ),
    },
    {
      id: "executionDate",
      header: t("table.executionDate"),
      cell: (row) => (
        <span className="text-brand-black">{row.executionDate}</span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: () => (
        <Badge className="rounded-full border-transparent bg-[#E8913A]/15 px-3 py-1 text-[#E8913A]">
          {t("table.statusNew")}
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <Button
          type="button"
          onClick={() =>
            openStartReview({
              id: row.id,
              orderNumber: row.orderNumber,
              customerName: row.customerName,
              handlerName: row.handlerName,
            })
          }
          className="h-9 gap-2 rounded-full border-none bg-brand-primary px-4 text-brand-white hover:bg-brand-primary/90"
        >
          <Eye className="size-4" strokeWidth={1.75} />
          <span>{t("table.startReview")}</span>
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
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("manualOrder")}</span>
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {NEW_ORDER_INDICATORS.map((indicator) => (
          <InfoCard
            key={indicator.key}
            title={t(`indicators.${indicator.key}`)}
            value={indicator.value}
            change={indicator.change}
            period={t("period")}
            iconSrc={indicator.iconSrc}
            bgClassName={indicator.bgClassName}
          />
        ))}
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
          onApply={() => setAppliedFilters(draftFilters)}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/receipt-item.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
