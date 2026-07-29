"use client";

import { Phone, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { VerificationOrderRow } from "@/features/orders/types";
import {
  parseVerificationOrdersFilters,
  serializeVerificationOrdersFilters,
  useOrderFilters,
} from "@/features/orders/utils";
import VerificationOrderActions from "@/features/orders/verification/components/verification-order-actions";
import VerificationOrdersFilters from "@/features/orders/verification/components/verification-orders-filters";
import VerificationStatusBadge from "@/features/orders/verification/components/verification-status-badge";
import { DEFAULT_VERIFICATION_ORDERS_FILTERS } from "@/features/orders/verification/mock-data";
import {
  useVerificationIndicators,
  useVerificationOrders,
} from "@/features/orders/verification/queries/use-verification-orders";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    periodKey: "periodToday" as const,
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "awaitingContract" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/scan.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "uploadedToday" as const,
    periodKey: "periodWeek" as const,
    iconSrc: "/svg/export-squred.svg",
    bgClassName: "bg-brand-success-light",
  },
];

function formatIndicatorValue(value: number) {
  return String(value).padStart(2, "0");
}

export default function VerificationOrdersView() {
  const t = useTranslations("Orders.Verification");
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_VERIFICATION_ORDERS_FILTERS,
      serialize: serializeVerificationOrdersFilters,
      parse: parseVerificationOrdersFilters,
    });

  const { data: rows = [], isLoading } = useVerificationOrders(appliedFilters);
  const { data: indicators } = useVerificationIndicators();

  const columns: DataTableColumn<VerificationOrderRow>[] = [
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
      id: "handler",
      header: t("table.handler"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-8">
            {row.handlerAvatarUrl ? (
              <AvatarImage src={row.handlerAvatarUrl} alt={row.handlerName} />
            ) : null}
            <AvatarFallback className="bg-brand-primary/15 text-xs font-semibold text-brand-primary">
              {row.handlerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="whitespace-nowrap text-brand-black">
            {row.handlerName}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <VerificationStatusBadge status={row.status} />,
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <VerificationOrderActions
          orderId={row.id}
          orderNumber={row.orderNumber}
          status={row.status}
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
            src="/svg/location.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <VerificationOrdersFilters
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
              iconSrc="/svg/export.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
