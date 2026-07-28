"use client";

import { Phone, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import ConfirmFilterButton from "@/components/confirm-filter-button";
import CustomIcon from "@/components/custom-svg";
import SearchBar from "@/components/search-bar";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_ORDERS } from "@/features/home/mock-data";
import type { MockOrder } from "@/features/home/types";
import StartReviewAction from "@/features/orders/new/components/start-review-action";

export default function LatestOrdersSection() {
  const t = useTranslations("HomePage");
  const [status, setStatus] = useState("new");

  const columns: DataTableColumn<MockOrder>[] = [
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
              ? "rounded-lg w-full  border-transparent bg-[#8B6BB5]/15 px-3 py-4 text-[#8B6BB5]"
              : "rounded-lg w-full border-transparent bg-brand-success/15 px-3 py-4 text-brand-success"
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
        <StartReviewAction
          orderId={row.id}
          orderNumber={row.orderNumber}
          customerName={row.customerName}
          handlerName={row.handlerName}
          label={t("table.startReview")}
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
          <div className="flex flex-col gap-1.5 flex-1 min-w-[240px] max-w-md">
            <span className="text-xs font-semibold text-brand-black px-1">
              {t("filters.searchLabel")}
            </span>
            <SearchBar
              placeholder={t("filters.searchPlaceholder")}
              className="h-11 w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full h-full sm:w-auto">
            <span className="text-xs font-semibold text-brand-black px-1">
              {t("filters.status")}
            </span>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="!h-11 w-full rounded-full border-black/5 bg-[#F5F5F5] px-4 text-sm sm:w-44">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start">
                <SelectItem value="new">{t("filters.statusNew")}</SelectItem>
                <SelectItem value="pending">{t("filters.statusPending")}</SelectItem>
                <SelectItem value="processing">
                  {t("filters.statusProcessing")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("filters.statusCompleted")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ConfirmFilterButton label={t("filters.apply")} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_ORDERS}
        getRowId={(row) => row.id}
        selectable
        emptyMessage={t("table.empty")}
      />
    </section>
  );
}

export function ManualOrderButton() {
  const t = useTranslations("HomePage");

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
    >
      <Plus className="size-4" strokeWidth={2} />
      <span>{t("manualOrder")}</span>
    </Button>
  );
}
