"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangeHistoryTable from "@/features/orders/components/change-history-table";
import DocumentDataPanel from "@/features/orders/components/document-data-panel";
import EmployerDataPanel from "@/features/orders/components/employer-data-panel";
import HoldReasonCard from "@/features/orders/components/hold-reason-card";
import ReviewOrderSidebar from "@/features/orders/components/review-order-sidebar";
import WorkerDataPanel from "@/features/orders/components/worker-data-panel";
import type { EmployerFormValues } from "@/features/orders/schemas/employer-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";
import type { HoldReasonValue, OrderReviewDetail } from "@/features/orders/types";
import {
  useOrder,
  useUpdateOrderEmployer,
  useUpdateOrderWorker,
} from "@/features/orders/queries/use-orders";
import { Link } from "@/i18n/navigation";

export type ReviewTabId = "employer" | "worker" | "documents";

const REVIEW_TABS: { id: ReviewTabId; iconSrc: string }[] = [
  { id: "employer", iconSrc: "/svg/user-square.svg" },
  { id: "worker", iconSrc: "/svg/user-tag.svg" },
  { id: "documents", iconSrc: "/svg/receipt-2.svg" },
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

type OrderViewProps = {
  order: OrderReviewDetail;
};

export default function OrderView({ order: initialOrder }: OrderViewProps) {
  const t = useTranslations("Orders.New.Review");
  const { data: fetchedOrder } = useOrder(initialOrder.id);
  const order = fetchedOrder ?? initialOrder;
  const updateEmployer = useUpdateOrderEmployer();
  const updateWorker = useUpdateOrderWorker();

  const [activeTab, setActiveTab] = useState<ReviewTabId>("employer");
  const [editingTab, setEditingTab] = useState<ReviewTabId | null>(null);

  const isEditing = editingTab !== null;
  const flaggedTab = order.hold?.reason
    ? HOLD_REASON_TAB[order.hold.reason]
    : undefined;

  const handleTabChange = (value: string) => {
    setEditingTab(null);
    setActiveTab(value as ReviewTabId);
  };

  const handleEmployerSaved = (values: EmployerFormValues) => {
    updateEmployer.mutate({ id: order.id, values });
  };

  const handleWorkerSaved = (values: WorkerFormValues) => {
    updateWorker.mutate({ id: order.id, values });
  };

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
              <BreadcrumbLink asChild>
                {order.status === "held" || order.hold ? (
                  <Link href="/orders/pending">{t("breadcrumbs.pendingOrders")}</Link>
                ) : order.status === "processed" ? (
                  <Link href="/orders/processed">{t("breadcrumbs.processedOrders")}</Link>
                ) : order.status === "sent_for_authentication" ? (
                  <Link href="/orders/verification">{t("breadcrumbs.verificationOrders")}</Link>
                ) : (
                  <Link href="/orders/new">{t("breadcrumbs.newOrders")}</Link>
                )}
              </BreadcrumbLink>
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
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-brand-gris">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-sm font-semibold text-brand-black">
              {t("orderStatus")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF5EC] px-3.5 py-1.5 text-xs font-bold text-brand-black">
              <span className="size-1.5 rounded-full bg-[#E08337]" />
              {order.statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-black/10 px-4 py-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryItem
          iconSrc="/svg/person.svg"
          label={t("summary.employerName")}
          value={order.employerName}
        />
        <SummaryItem
          iconSrc="/svg/phone.svg"
          label={t("summary.contactNumber")}
          value={`+966 ${order.phoneLocal}`}
          dir="ltr"
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

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="gap-4"
          >
            <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
              {REVIEW_TABS.map(({ id, iconSrc }) => (
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

            <TabsContent value="employer" className="mt-2 p-4 rounded-2xl border border-black/5">
              <EmployerDataPanel
                order={order}
                isEditing={editingTab === "employer"}
                onEditingChange={(editing) =>
                  setEditingTab(editing ? "employer" : null)
                }
                onSaved={handleEmployerSaved}
              />
            </TabsContent>
            <TabsContent value="worker" className="mt-2">
              <WorkerDataPanel
                order={order}
                isEditing={editingTab === "worker"}
                onEditingChange={(editing) =>
                  setEditingTab(editing ? "worker" : null)
                }
                onSaved={handleWorkerSaved}
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-2">
              <DocumentDataPanel order={order} />
            </TabsContent>
          </Tabs>

          <ChangeHistoryTable rows={order.changeHistory} />
        </div>

        <ReviewOrderSidebar orderId={order.id} isEditing={isEditing} />
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
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <CustomIcon src={iconSrc} size={16} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-brand-gris">{label}</p>
        <p
          className="truncate text-sm font-semibold text-brand-black"
          dir={dir}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
