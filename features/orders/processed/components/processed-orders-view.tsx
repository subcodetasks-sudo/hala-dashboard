"use client";

import { Phone, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProcessedOrderActions from "@/features/orders/processed/components/processed-order-actions";
import ProcessedOrdersFilters from "@/features/orders/processed/components/processed-orders-filters";
import {
  DEFAULT_PROCESSED_ORDERS_FILTERS,
  filterProcessedOrders,
  PROCESSED_ORDER_INDICATORS,
  PROCESSED_ORDERS,
} from "@/features/orders/processed/mock-data";
import type {
  ProcessedOrderRow,
  ProcessedOrdersFilterValues,
} from "@/features/orders/types";

export default function ProcessedOrdersView() {
  const t = useTranslations("Orders.Processed");
  const [draftFilters, setDraftFilters] =
    useState<ProcessedOrdersFilterValues>(DEFAULT_PROCESSED_ORDERS_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ProcessedOrdersFilterValues>(DEFAULT_PROCESSED_ORDERS_FILTERS);

  const rows = filterProcessedOrders(PROCESSED_ORDERS, appliedFilters);

  const columns: DataTableColumn<ProcessedOrderRow>[] = [
    {
      id: "orderNumber",
      header: t("table.orderNumber"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">{row.orderNumber}</span>
      ),
    },
    {
      id: "contractNumber",
      header: t("table.contractNumber"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">
          {row.contractNumber}
        </span>
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
      id: "approvedAt",
      header: t("table.approvedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.approvedDate}</span>
          <span className="text-xs text-brand-gris">{row.approvedTime}</span>
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
      id: "reviewer",
      header: t("table.reviewer"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-8">
            {row.reviewerAvatarUrl ? (
              <AvatarImage
                src={row.reviewerAvatarUrl}
                alt={row.reviewerName}
              />
            ) : null}
            <AvatarFallback className="bg-brand-primary/15 text-xs font-semibold text-brand-primary">
              {row.reviewerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="whitespace-nowrap text-brand-black">
            {row.reviewerName}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: () => (
        <Badge className="inline-flex items-center gap-1.5 rounded-xl border-transparent bg-brand-success/15 p-5 text-xs font-medium text-brand-success">
          <span
            className="size-1.5 shrink-0 rounded-full bg-brand-success"
            aria-hidden
          />
          <span>{t("table.statusProcessed")}</span>
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <ProcessedOrderActions
          orderId={row.id}
          orderNumber={row.orderNumber}
          employerName={row.employerName}
          workerName={row.workerName}
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PROCESSED_ORDER_INDICATORS.map((indicator) => (
          <InfoCard
            key={indicator.key}
            title={t(`indicators.${indicator.key}`)}
            value={indicator.value}
            change={indicator.change}
            period={t(indicator.periodKey)}
            iconSrc={indicator.iconSrc}
            bgClassName={indicator.bgClassName}
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

        <ProcessedOrdersFilters
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
