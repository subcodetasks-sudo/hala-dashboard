"use client";

import { ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import ClearFilterButton from "@/components/clear-filter-button";
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
} from "@/features/orders/utils";
import { useProfile } from "@/features/profile/queries/use-profile";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";

const STATUS_ITEM_CLASS =
  "relative h-auto w-full cursor-pointer rounded-full border-none px-4 py-2.5 font-bold text-brand-black outline-none focus:text-brand-black data-highlighted:text-brand-black [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:w-full bg-[#F5F5F5] focus:bg-[#EBEBEB] data-highlighted:bg-[#EBEBEB]";

const STATUS_SELECT_CONTENT_CLASS =
  "min-w-[14rem] rounded-3xl border border-brand-primary/25 bg-white p-3 shadow-[0_0_0_1px_rgba(14,165,180,0.12),0_8px_24px_rgba(14,165,180,0.08)] ring-0";

function StatusSelectOption({ label }: { label: string }) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="text-brand-black">{label}</span>
      <ChevronLeft
        className="size-4 shrink-0 text-brand-black ltr:rotate-180 [[data-slot=select-value]_&]:hidden"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

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

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
  } = useUrlFilters({
    defaults: DEFAULT_HOME_ORDERS_FILTERS,
    serialize: serializeOrdersFilters,
    parse: parseOrdersFilters,
  });
  const [page, setPage] = useState(1);

  const handleClearFilters = () => {
    setPage(1);
    clearFilters();
  };

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
  const canSeeUnderReview = filterOrderStatus("under_review");
  const shouldPinMyUnderReview =
    employeeId != null &&
    canSeeUnderReview &&
    (queryStatus == null || queryStatus === "under_review");

  // Separate fetch so assigned under-review rows stay on top across pagination.
  const { data: underReviewData, isLoading: isUnderReviewLoading } =
    useRenewalRequests({
      status: "under_review",
      search: appliedFilters.search,
      perPage: 100,
      page: 1,
      enabled: shouldPinMyUnderReview,
    });

  const myUnderReviewOrders = useMemo(() => {
    if (!shouldPinMyUnderReview || employeeId == null) {
      return [];
    }

    return (underReviewData?.items ?? []).filter((order) =>
      isMyUnderReviewAssignment(order, employeeId),
    );
  }, [employeeId, shouldPinMyUnderReview, underReviewData?.items]);

  const myUnderReviewIds = useMemo(
    () => new Set(myUnderReviewOrders.map((order) => order.id)),
    [myUnderReviewOrders],
  );

  // Hide others' under-review rows (super-admin sees all); pin own under-review to top.
  // Restricted roles also drop statuses outside their allowed set (needed when "all" is selected).
  const rows = useMemo(() => {
    const visible = (data?.items ?? []).filter((order) => {
      if (!filterOrderStatus(order.status)) {
        return false;
      }
      // Avoid duplicating pinned assignments that we prepend separately.
      if (myUnderReviewIds.has(order.id)) {
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

    // Lead with my under-review assignments on page 1; later pages exclude them
    // so they stay first overall instead of only sorting within a single page.
    if (page === 1 && myUnderReviewOrders.length > 0) {
      return [...myUnderReviewOrders, ...visible];
    }

    return visible;
  }, [
    data?.items,
    employeeId,
    filterOrderStatus,
    isSuperAdmin,
    myUnderReviewIds,
    myUnderReviewOrders,
    page,
  ]);

  const tableLoading =
    isLoading || (shouldPinMyUnderReview && isUnderReviewLoading);

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
              <SelectTrigger className="h-11! w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black sm:w-44">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="center"
                className={STATUS_SELECT_CONTENT_CLASS}
              >
                <div className="flex flex-col gap-2">
                  {allStatuses.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                      className={cn(STATUS_ITEM_CLASS)}
                    >
                      <StatusSelectOption label={status.label} />
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <ConfirmFilterButton
              label={t("filters.apply")}
              onClick={applyFilters}
            />
            <ClearFilterButton onClick={handleClearFilters} />
          </div>
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
        isLoading={tableLoading}
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
