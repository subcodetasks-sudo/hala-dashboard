"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import CustomIcon from "@/components/custom-svg";
import SearchBar from "@/components/search-bar";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCan } from "@/features/auth/lib/use-can";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import OrderRowActions from "@/features/orders/components/order-row-actions";
import { DEFAULT_HOME_ORDERS_FILTERS } from "@/features/orders/mock-data";
import { useOrderStatuses } from "@/features/orders/queries/use-order-statuses";
import { useRenewalRequests } from "@/features/orders/queries/use-renewal-requests";
import type { OrderListItem, OrderStatus, OrdersFilterValues } from "@/features/orders/types";
import {
  getOrderCreatedDisplay,
  getOrderEmployerName,
  getOrderExecutionDisplay,
  getOrderPhoneDisplay,
  getOrderWorkerName,
  parseOrdersFilters,
  serializeOrdersFilters,
  toUiOrderSource,
  useOrderFilters,
} from "@/features/orders/utils";
import { useProfile } from "@/features/profile/queries/use-profile";

/** Under-review order still assigned to the signed-in employee. */
function isMyUnderReviewAssignment(
  order: OrderListItem,
  employeeId: number | undefined,
): boolean {
  return (
    employeeId != null &&
    order.assigned_to?.id === employeeId &&
    order.status === "under_review"
  );
}

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case "new":
      return "rounded-full border-transparent bg-[#E8913A]/15 px-3 py-1 text-[#E8913A]";
    case "held":
      return "rounded-full border-transparent bg-brand-accent/15 px-3 py-1 text-brand-accent";
    case "under_review":
      return "rounded-full border-transparent bg-brand-primary/15 px-3 py-1 text-brand-primary";
    case "processed":
      return "rounded-full border-transparent bg-brand-primary/15 px-3 py-1 text-brand-primary";
    case "completed":
      return "rounded-full border-transparent bg-brand-success/15 px-3 py-1 text-brand-success";
    case "cancelled":
      return "rounded-full border-transparent bg-brand-accent/15 px-3 py-1 text-brand-accent";
    default:
      return "rounded-full border-transparent bg-brand-gris/15 px-3 py-1 text-brand-gris";
  }
}

export default function LatestOrdersSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale() === "en" ? "en" : "ar";
  const permissions = useCan();
  const { data: profile } = useProfile();
  const employeeId = profile?.id;

  const {
    data: statusOptions = [],
    isLoading: isStatusesLoading,
  } = useOrderStatuses();

  const { draftFilters, setDraftFilters, appliedFilters, applyFilters } =
    useOrderFilters({
      defaults: DEFAULT_HOME_ORDERS_FILTERS,
      serialize: serializeOrdersFilters,
      parse: parseOrdersFilters,
    });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const scopedStatusOptions = permissions.orderStatuses(statusOptions);

  const allStatuses = permissions.includeOrderStatusAllOption()
    ? [
        { value: "all" as const, label: t("filters.statusAll") },
        ...scopedStatusOptions,
      ]
    : scopedStatusOptions;

  const draftStatus = permissions.orderStatusSelectValue(draftFilters.status);
  const queryStatus = permissions.resolveOrderStatusFilter(
    appliedFilters.status,
  );

  const { data, isLoading, isError, error } = useRenewalRequests({
    status: queryStatus,
    search: appliedFilters.search,
    perPage: 10,
    page,
    enabled: true,
  });

  const isSuperAdmin = permissions.isSuperAdmin();
  const filterOrderStatus = permissions.filterOrderStatus;

  // Hide others' under-review rows (super-admin sees all); pin own under-review to top.
  // Restricted roles also drop statuses outside their allowed set (needed when "all" is selected).
  const rows = useMemo(() => {
    const visible = (data?.items ?? []).filter((order) => {
      if (!filterOrderStatus(order.status)) {
        return false;
      }
      if (order.status !== "under_review") {
        return true;
      }
      if (isSuperAdmin) {
        return true;
      }
      return (
        employeeId != null && order.assigned_to?.id === employeeId
      );
    });

    if (employeeId == null) {
      return visible;
    }

    return [...visible].sort((a, b) => {
      const aMine = isMyUnderReviewAssignment(a, employeeId) ? 0 : 1;
      const bMine = isMyUnderReviewAssignment(b, employeeId) ? 0 : 1;
      return aMine - bMine;
    });
  }, [data?.items, employeeId, filterOrderStatus, isSuperAdmin]);

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
      id: "customer",
      header: t("table.customer"),
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
      id: "handler",
      header: t("table.handler"),
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
      id: "source",
      header: t("table.source"),
      cell: (row) => {
        const source = toUiOrderSource(row.source);
        return (
          <Badge
            className={
              source === "eform"
                ? "rounded-lg w-full border-transparent bg-[#8B6BB5]/15 px-3 py-4 text-[#8B6BB5]"
                : "rounded-lg w-full border-transparent bg-brand-success/15 px-3 py-4 text-brand-success"
            }
          >
            {source === "eform"
              ? t("table.sourceEform")
              : t("table.sourceManual")}
          </Badge>
        );
      },
    },
    {
      id: "executionDate",
      header: t("table.executionDate"),
      cell: (row) => (
        <span className="text-brand-black">
          {getOrderExecutionDisplay(row, locale)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => (
        <Badge className={statusBadgeClass(row.status)}>
          {row.status_label ||
            (row.status === "under_review"
              ? t("table.statusUnderReview")
              : t("table.statusNew"))}
        </Badge>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      headerClassName: "min-w-40 w-48 text-center",
      className: "min-w-40 w-48 text-center",
      cell: (row) => (
        <OrderRowActions
          order={row}
          startReviewLabel={t("table.startReview")}
          viewOrderLabel={t("table.viewOrder")}
        />
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary shrink-0 self-start lg:self-end lg:pb-1.5">
          <CustomIcon
            src="/svg/tag-2.svg"
            size={20}
            className="text-brand-primary"
          />
          {t("sections.latestOrders")}
        </h2>

        <div className="flex flex-wrap items-end gap-3 flex-1 justify-end">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[240px] max-w-fit">
            <span className="text-xs font-semibold text-brand-black px-1">
              {t("filters.searchLabel")}
            </span>
            <SearchBar
              placeholder={t("filters.searchPlaceholder")}
              className="h-11 w-full"
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters({ ...draftFilters, search: event.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full h-full sm:w-auto">
            <span className="text-xs font-semibold text-brand-black px-1">
              {t("filters.status")}
            </span>
            <Select
              value={draftStatus}
              onValueChange={(value) =>
                setDraftFilters({
                  ...draftFilters,
                  status: value as OrdersFilterValues["status"],
                })
              }
              disabled={isStatusesLoading}
            >
              <SelectTrigger className="!h-11 w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm sm:w-44">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start">
                {allStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ConfirmFilterButton
            label={t("filters.apply")}
            onClick={applyFilters}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        getRowClassName={(row) =>
          isMyUnderReviewAssignment(row, employeeId)
            ? "bg-brand-light-yellow hover:bg-brand-light-yellow data-[state=selected]:bg-brand-light-yellow border-s-4 border-s-brand-warning"
            : undefined
        }
        selectable
        isLoading={isLoading}
        emptyMessage={
          isError
            ? error instanceof Error
              ? error.message
              : t("table.empty")
            : t("table.empty")
        }
      />

      <TablePagination
        page={data?.currentPage ?? page}
        lastPage={data?.lastPage ?? 1}
        total={data?.total}
        onPageChange={setPage}
      />
    </section>
  );
}
