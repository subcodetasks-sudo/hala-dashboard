"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ManualOrderButton from "@/components/manual-order-button";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import { useRenewalRequestAuthenticationSentStats } from "@/features/orders/queries/use-renewal-request-authentication-sent-stats";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type {
  OrderListItem,
  VerificationOrderStatus,
} from "@/features/orders/types";
import {
  formatStatsCount,
  getOrderCreatedDisplay,
  getOrderEmployerName,
  getOrderPhoneDisplay,
  getOrderProcessedByName,
  getOrderRefInitials,
  getOrderWorkerName,
  parseVerificationOrdersFilters,
  serializeVerificationOrdersFilters,
  toIsoDate,
  useOrderFilters,
} from "@/features/orders/utils";
import VerificationOrderActions from "@/features/orders/verification/components/verification-order-actions";
import VerificationOrdersFilters from "@/features/orders/verification/components/verification-orders-filters";
import VerificationStatusBadge from "@/features/orders/verification/components/verification-status-badge";
import { DEFAULT_VERIFICATION_ORDERS_FILTERS } from "@/features/orders/verification/mock-data";

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

function getVerificationUiStatus(
  item: OrderListItem,
): VerificationOrderStatus {
  return item.has_final_contract
    ? "finalContractUploaded"
    : "sentForVerification";
}

export default function VerificationOrdersView() {
  const t = useTranslations("Orders.Verification");
  const locale = useLocale() === "en" ? "en" : "ar";
  const {
    totalSentForAuthentication,
    awaitingFinalContract,
    finalContractsUploadedToday,
    totalSentForAuthenticationChangePercent,
    awaitingFinalContractChangePercent,
    finalContractsUploadedChangePercent,
    isLoading: isStatsLoading,
  } = useRenewalRequestAuthenticationSentStats();
  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_VERIFICATION_ORDERS_FILTERS,
      serialize: serializeVerificationOrdersFilters,
      parse: parseVerificationOrdersFilters,
    });
  const [page, setPage] = useState(1);
  const handleApplyFilters = () => {
    setPage(1);
    applyFilters();
  };

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: "sent_for_authentication",
    search: appliedFilters.search,
    createdFrom: appliedFilters.fromDate
      ? toIsoDate(appliedFilters.fromDate)
      : undefined,
    createdTo: appliedFilters.toDate
      ? toIsoDate(appliedFilters.toDate)
      : undefined,
    perPage: 15,
    page,
  });

  const rows = (data?.items ?? []).filter((item) => {
    if (appliedFilters.status === "all") return true;
    const uiStatus = getVerificationUiStatus(item);
    return uiStatus === appliedFilters.status;
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
      id: "contractNumber",
      header: t("table.contractNumber"),
      cell: (row) => (
        <span className="whitespace-nowrap text-brand-black">
          {row.contract_number || "—"}
        </span>
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
      id: "handler",
      header: t("table.handler"),
      cell: (row) => {
        const name = getOrderProcessedByName(row, locale);
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
      id: "status",
      header: t("table.status"),
      cell: (row) => (
        <VerificationStatusBadge status={getVerificationUiStatus(row)} />
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <VerificationOrderActions
          orderId={String(row.id)}
          orderNumber={row.request_number ?? `#ORD-${row.id}`}
          status={getVerificationUiStatus(row)}
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
        <ManualOrderButton />
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((card) => {
          let value = "-";
          let change = "-";

          if (isStatsLoading) {
            value = "...";
            change = "...";
          } else if (card.key === "total") {
            value = formatStatsCount(
              totalSentForAuthentication,
              isStatsLoading,
            );
            change = totalSentForAuthenticationChangePercent;
          } else if (card.key === "awaitingContract") {
            value = formatStatsCount(awaitingFinalContract, isStatsLoading);
            change = awaitingFinalContractChangePercent;
          } else {
            value = formatStatsCount(
              finalContractsUploadedToday,
              isStatsLoading,
            );
            change = finalContractsUploadedChangePercent;
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

        <VerificationOrdersFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
        />

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.id)}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/export.svg"
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
