"use client";

import { Eye, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PendingOrdersFilters from "@/features/orders/pending/components/pending-orders-filters";
import SuspensionReasonBadge from "@/features/orders/pending/components/suspension-reason-badge";
import {
  DEFAULT_PENDING_ORDERS_FILTERS,
  filterPendingOrders,
  PENDING_ORDER_INDICATORS,
  PENDING_ORDERS,
} from "@/features/orders/pending/mock-data";
import type {
  PendingOrderRow,
  PendingOrdersFilterValues,
} from "@/features/orders/types";
import { Link } from "@/i18n/navigation";

export default function PendingOrdersView() {
  const t = useTranslations("Orders.Pending");
  const [draftFilters, setDraftFilters] = useState<PendingOrdersFilterValues>(
    DEFAULT_PENDING_ORDERS_FILTERS
  );
  const [appliedFilters, setAppliedFilters] =
    useState<PendingOrdersFilterValues>(DEFAULT_PENDING_ORDERS_FILTERS);

  const rows = filterPendingOrders(PENDING_ORDERS, appliedFilters);

  const columns: DataTableColumn<PendingOrderRow>[] = [
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
        <span className="text-brand-black">{row.workerName}</span>
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
      id: "suspensionReason",
      header: t("table.suspensionReason"),
      cell: (row) => <SuspensionReasonBadge reason={row.suspensionReason} />,
    },
    {
      id: "suspendedAt",
      header: t("table.suspendedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-black">{row.suspendedDate}</span>
          <span className="text-xs text-brand-gris">{row.suspendedTime}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: () => (
        <Badge className="inline-flex items-center gap-1.5 rounded-xl border-transparent bg-[#FDF2F8] p-5 text-xs font-medium text-[#D946EF]">
          <span
            className="size-1.5 shrink-0 rounded-full bg-[#D946EF]"
            aria-hidden
          />
          <span>{t("table.statusPending")}</span>
        </Badge>
      ),
    },
    {
      id: "suspendedBy",
      header: t("table.suspendedBy"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-8">
            {row.suspendedByAvatarUrl ? (
              <AvatarImage
                src={row.suspendedByAvatarUrl}
                alt={row.suspendedByName}
              />
            ) : null}
            <AvatarFallback className="bg-brand-primary/15 text-xs font-semibold text-brand-primary">
              {row.suspendedByInitials}
            </AvatarFallback>
          </Avatar>
          <span className="whitespace-nowrap text-brand-black">
            {row.suspendedByName}
          </span>
        </div>
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm text-brand-gris">{t("description")}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PENDING_ORDER_INDICATORS.map((indicator) => (
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <PendingOrdersFilters
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
              iconSrc="/svg/check.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
