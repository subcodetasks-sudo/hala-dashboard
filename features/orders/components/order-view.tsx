"use client";

import { useEffect, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCan } from "@/features/auth/lib/use-can";
import ChangeHistoryTable from "@/features/orders/components/change-history-table";
import CancellationReasonCard from "@/features/orders/cancelled/components/cancellation-reason-card";
import { CopyableOrderNumber } from "@/features/orders/components/copyable-order-number";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import DocumentDataPanel from "@/features/orders/components/document-data-panel";
import EmployerDataPanel from "@/features/orders/components/employer-data-panel";
import HoldReasonCard from "@/features/orders/components/hold-reason-card";
import ReviewOrderSidebar from "@/features/orders/components/review-order-sidebar";
import WorkerDataPanel from "@/features/orders/components/worker-data-panel";
import type { UpdateEmployerInput } from "@/features/orders/schemas/employer-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";
import type { HoldReasonValue, OrderReviewDetail } from "@/features/orders/types";
import {
  seedOrderDetail,
  useOrder,
} from "@/features/orders/queries/use-orders";
import { useUpdateRenewalRequestEmployer } from "@/features/orders/queries/use-update-renewal-request-employer";
import { useUpdateRenewalRequestWorker } from "@/features/orders/queries/use-update-renewal-request-worker";
import { isMockOrderDetailId } from "@/features/orders/mock-order-details";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ORDER_STATUS_LABEL_KEYS } from "@/features/orders/utils";
import { toSaudiPhoneWithLeadingZero } from "@/lib/format-saudi-phone";
import { cn } from "@/lib/utils";

export type ReviewTabId = "employer" | "worker" | "documents" | "delivery";

const TAB_QUERY_KEY = "tab";

const REVIEW_TABS: { id: ReviewTabId; iconSrc: string; completedOnly?: boolean }[] =
  [
    { id: "employer", iconSrc: "/svg/user-square.svg" },
    { id: "worker", iconSrc: "/svg/user-tag.svg" },
    { id: "documents", iconSrc: "/svg/receipt-2.svg" },
    {
      id: "delivery",
      iconSrc: "/svg/location.svg",
      completedOnly: true,
    },
  ];

const TAB_TRIGGER_CLASS =
  "h-11 min-w-[120px] flex-1 gap-2 rounded-xl border border-black/10 bg-[#F5F5F5] px-4 font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-dark-blue data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

/** Tab holding the data that caused the hold, flagged with a warning dot. */
const HOLD_REASON_TAB: Partial<Record<HoldReasonValue, ReviewTabId>> = {
  employer_data_incomplete: "employer",
  worker_data_unclear: "worker",
  missing_document: "documents",
  unclear_document: "documents",
};

function parseReviewTab(value: string | null): ReviewTabId {
  if (
    value === "employer" ||
    value === "worker" ||
    value === "documents" ||
    value === "delivery"
  ) {
    return value;
  }
  return "employer";
}

function getOrderHeaderContent(
  order: OrderReviewDetail,
  t: ReturnType<typeof useTranslations<"Orders.New.Review">>,
): { title: string; subtitle: string } {
  switch (order.status) {
    case "held":
      return {
        title: t("headers.held.title"),
        subtitle: order.hold
          ? t("headers.held.subtitle", {
              heldByName: order.hold.heldByName,
              heldAtDate: order.hold.heldAtDateLabel,
              heldAtTime: order.hold.heldAtTimeLabel,
            })
          : t("headers.held.subtitleFallback"),
      };
    case "processed":
      return {
        title: t("headers.processed.title"),
        subtitle: t("headers.processed.subtitle"),
      };
    case "sent_for_authentication":
      return {
        title: t("headers.sentForAuthentication.title"),
        subtitle: t("headers.sentForAuthentication.subtitle"),
      };
    case "awaiting_payment":
      return {
        title: t("headers.awaitingPayment.title"),
        subtitle: t("headers.awaitingPayment.subtitle"),
      };
    case "completed":
      return {
        title: t("headers.completed.title"),
        subtitle: t("headers.completed.subtitle"),
      };
    case "cancelled":
      return {
        title: t("headers.cancelled.title"),
        subtitle: t("headers.cancelled.subtitle"),
      };
    default:
      return {
        title: t("title"),
        subtitle: t("subtitle"),
      };
  }
}

type OrderViewProps = {
  orderId: string;
};

export default function OrderView({ orderId }: OrderViewProps) {
  const t = useTranslations("Orders.New.Review");
  const tEmployer = useTranslations("Orders.New.Review.employer");
  const tWorker = useTranslations("Orders.New.Review.worker");
  const tStatus = useTranslations("Orders.New.Review.statuses");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const permissions = useCan();
  // useOrder resolves real API details and known mock ids
  // (payment / completed / refund) from `mock-order-details`.
  const { data: order, isPending, isError } = useOrder(orderId);
  const updateRenewalRequestEmployer = useUpdateRenewalRequestEmployer();
  const updateRenewalRequestWorker = useUpdateRenewalRequestWorker();

  const requestedTab = parseReviewTab(searchParams.get(TAB_QUERY_KEY));
  const [editingTab, setEditingTab] = useState<ReviewTabId | null>(null);

  useEffect(() => {
    if (order) {
      seedOrderDetail(order);
    }
  }, [order]);

  const canViewOrderDetail =
    !order ||
    permissions.isPending ||
    permissions.viewOrderDetail(order.status);

  useEffect(() => {
    if (!order || permissions.isPending || canViewOrderDetail) {
      return;
    }

    router.replace("/");
  }, [canViewOrderDetail, order, permissions.isPending, router]);

  // Delivery tab exists only on completed orders — fall back if the query is stale.
  useEffect(() => {
    if (!order) return;
    if (requestedTab === "delivery" && order.status !== "completed") {
      const params = new URLSearchParams(searchParams.toString());
      params.set(TAB_QUERY_KEY, "employer");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [order, pathname, requestedTab, router, searchParams]);

  if (isPending || permissions.isPending) {
    return <OrderViewSkeleton />;
  }

  if (isError || !order) {
    notFound();
  }

  if (!canViewOrderDetail) {
    return <OrderViewSkeleton />;
  }

  // Editable only while reviewing new/held orders (under_review is assignee/super-admin only).
  const canEditForms = permissions.canEditOrderDetail(
    order.status,
    order.assignedToId,
  );

  const isCompleted = order.status === "completed";
  const visibleTabs = REVIEW_TABS.filter(
    (tab) => !tab.completedOnly || isCompleted,
  );
  const activeTab =
    requestedTab === "delivery" && !isCompleted ? "employer" : requestedTab;

  const isCancelled = order.status === "cancelled";
  const isEditing = canEditForms && editingTab !== null;
  const flaggedTab = order.hold?.reason
    ? HOLD_REASON_TAB[order.hold.reason]
    : undefined;
  const statusLabel = tStatus(ORDER_STATUS_LABEL_KEYS[order.status]);
  const headerContent = getOrderHeaderContent(order, t);

  const handleTabChange = (value: string) => {
    setEditingTab(null);
    const tab = parseReviewTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set(TAB_QUERY_KEY, tab);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleEditingChange = (tab: ReviewTabId, editing: boolean) => {
    if (!canEditForms) {
      setEditingTab(null);
      return;
    }
    setEditingTab(editing ? tab : null);
  };

  const handleEmployerSaved = (values: UpdateEmployerInput) => {
    const promise = updateRenewalRequestEmployer
      .mutateAsync({ renewalRequestId: order.id, values })
      .then(() => {
        router.refresh();
      });

    toast.promise(promise, {
      loading: tEmployer("loadingToast"),
      success: tEmployer("successToast"),
      error: (error) =>
        error instanceof Error && error.message
          ? error.message
          : tEmployer("errorToast"),
    });

    void promise.catch(() => {
      setEditingTab("employer");
    });
  };

  const handleWorkerSaved = (
    values: WorkerFormValues,
    meta: { passportIssuePlaceId: number },
  ) => {
    if (order.salary == null && !isMockOrderDetailId(order.id)) {
      toast.error(tWorker("salaryMissingToast"));
      setEditingTab("worker");
      return;
    }

    const promise = updateRenewalRequestWorker
      .mutateAsync({
        renewalRequestId: order.id,
        values,
        passportIssuePlaceId: meta.passportIssuePlaceId,
        salary: order.salary,
      })
      .then(() => {
        router.refresh();
      });

    toast.promise(promise, {
      loading: tWorker("loadingToast"),
      success: tWorker("successToast"),
      error: (error) =>
        error instanceof Error && error.message
          ? error.message
          : tWorker("errorToast"),
    });

    void promise.catch(() => {
      setEditingTab("worker");
    });
  };

  const listBreadcrumb =
    order.linkedToRefund ? (
      <Link href="/orders/refunds">{t("breadcrumbs.refundOrders")}</Link>
    ) : order.status === "awaiting_payment" ? (
      <Link href="/orders/payment">{t("breadcrumbs.paymentOrders")}</Link>
    ) : order.status === "completed" ? (
      <Link href="/orders/completed">{t("breadcrumbs.completedOrders")}</Link>
    ) : order.status === "held" || order.hold ? (
      <Link href="/orders/pending">{t("breadcrumbs.pendingOrders")}</Link>
    ) : order.status === "processed" ? (
      <Link href="/orders/processed">{t("breadcrumbs.processedOrders")}</Link>
    ) : order.status === "sent_for_authentication" ? (
      <Link href="/orders/verification">
        {t("breadcrumbs.verificationOrders")}
      </Link>
    ) : isCancelled ? (
      <Link href="/orders/cancelled">{t("breadcrumbs.cancelledOrders")}</Link>
    ) : (
      <Link href="/orders/new">{t("breadcrumbs.newOrders")}</Link>
    );

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-brand-gris">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t("breadcrumbs.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>{listBreadcrumb}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-brand-black">
                {t("breadcrumbs.review", {
                  orderNumber: order.orderNumber.replace("#", "REQ-"),
                })}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
              {headerContent.title}
            </h1>
            <p className="mt-1 text-sm text-brand-gris">
              {headerContent.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-sm font-semibold text-brand-black">
              {t("orderStatus")}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl p-4 text-xs font-bold",
                isCancelled
                  ? "bg-brand-accent/10 text-brand-accent"
                  : isCompleted
                    ? "bg-brand-success-light text-brand-success"
                    : "bg-[#FFF5EC] text-brand-black"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isCancelled
                    ? "bg-brand-accent"
                    : isCompleted
                      ? "bg-brand-success"
                      : "bg-[#E08337]"
                )}
              />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-black/10 px-4 py-3 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryItem
          iconSrc="/svg/tag-2.svg"
          label={t("summary.orderNumber")}
          value={
            <CopyableOrderNumber
              orderNumber={order.orderNumber}
              className="text-sm font-semibold text-brand-black"
            />
          }
        />
        <SummaryItem
          iconSrc="/svg/person.svg"
          label={t("summary.employerName")}
          value={order.employerName}
        />
        <SummaryItem
          iconSrc="/svg/phone.svg"
          label={t("summary.contactNumber")}
          value={
            <CopyablePhoneNumber
              phone={toSaudiPhoneWithLeadingZero(order.phoneLocal)}
              className="text-sm font-semibold text-brand-black"
            />
          }
        />
        <SummaryItem
          iconSrc="/svg/location.svg"
          label={t("summary.city")}
          value={order.city}
        />
        <SummaryItem
          iconSrc="/svg/person.svg"
          label={t("summary.workerName")}
          value={order.workerName}
        />
        <SummaryItem
          iconSrc="/svg/time.svg"
          label={t("summary.expectedExecution")}
          value={order.expectedExecutionLabel}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {order.hold ? <HoldReasonCard hold={order.hold} /> : null}
          {order.cancellation ? (
            <CancellationReasonCard cancellation={order.cancellation} />
          ) : null}

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="gap-4"
          >
            <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
              {visibleTabs.map(({ id, iconSrc }) => (
                <TabsTrigger key={id} value={id} className={TAB_TRIGGER_CLASS}>
                  <CustomIcon src={iconSrc} size={16} />
                  {t(`tabs.${id}`)}
                  {flaggedTab === id ? (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-brand-warning"
                      aria-hidden
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="employer"
              className="mt-2 rounded-2xl border border-black/5 p-6 sm:p-8"
            >
              <EmployerDataPanel
                order={order}
                canEdit={canEditForms}
                isEditing={editingTab === "employer"}
                onEditingChange={(editing) =>
                  handleEditingChange("employer", editing)
                }
                onSaved={handleEmployerSaved}
                isSaving={updateRenewalRequestEmployer.isPending}
              />
            </TabsContent>
            <TabsContent
              value="worker"
              className="mt-2 rounded-2xl border border-black/5 p-6 sm:p-8"
            >
              <WorkerDataPanel
                order={order}
                canEdit={canEditForms}
                isEditing={editingTab === "worker"}
                onEditingChange={(editing) =>
                  handleEditingChange("worker", editing)
                }
                onSaved={handleWorkerSaved}
                isSaving={updateRenewalRequestWorker.isPending}
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-2">
              <DocumentDataPanel order={order} />
            </TabsContent>
            {isCompleted ? (
              <TabsContent
                value="delivery"
                className="mt-2 rounded-2xl border border-black/5 p-6 sm:p-8"
              >
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <CustomIcon
                    src="/svg/location.svg"
                    size={32}
                    className="text-brand-gris"
                  />
                  <p className="text-sm font-medium text-brand-gris">
                    {t("tabs.deliveryPlaceholder")}
                  </p>
                </div>
              </TabsContent>
            ) : null}
          </Tabs>

          <ChangeHistoryTable rows={order.changeHistory} />
        </div>

        <ReviewOrderSidebar
          orderId={order.id}
          isEditing={isEditing}
          canMutate={canEditForms}
        />
      </div>
    </div>
  );
}

function OrderViewSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6 p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-64 bg-brand-gris/15" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-48 bg-brand-primary/15" />
          <Skeleton className="h-10 w-36 bg-brand-gris/10" />
        </div>
      </div>

      <Skeleton className="h-20 w-full rounded-2xl bg-brand-background" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4 rounded-2xl border border-brand-primary/10 bg-brand-white p-5">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-lg bg-brand-primary/15" />
            <Skeleton className="h-10 w-32 rounded-lg bg-brand-gris/10" />
            <Skeleton className="h-10 w-28 rounded-lg bg-brand-gris/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-11 w-full rounded-xl bg-brand-gris/10"
              />
            ))}
            <Skeleton className="h-11 w-full rounded-xl bg-brand-gris/10 md:col-span-2" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-80">
          <Skeleton className="h-48 w-full rounded-2xl bg-brand-primary/10" />
          <Skeleton className="h-40 w-full rounded-2xl bg-brand-gris/10" />
          <Skeleton className="h-28 w-full rounded-2xl bg-brand-primary/10" />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  iconSrc,
  label,
  value,
  dir,
}: {
  iconSrc: string;
  label: string;
  value: React.ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <CustomIcon src={iconSrc} size={16} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-brand-gris">{label}</p>
        <div
          className="truncate text-sm font-semibold text-brand-black"
          dir={dir}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
