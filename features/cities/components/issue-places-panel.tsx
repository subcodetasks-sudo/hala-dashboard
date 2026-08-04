"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitiesFilters from "@/features/cities/components/cities-filters";
import CityStatusBadge from "@/features/cities/components/city-status-badge";
import IssuePlaceFormDialog from "@/features/cities/components/issue-place-form-dialog";
import IssuePlaceRowActions from "@/features/cities/components/issue-place-row-actions";
import {
  DEFAULT_ISSUE_PLACE_FILTERS,
  ISSUE_PLACES_PER_PAGE,
} from "@/features/cities/mock-data";
import { useIssuePlacesIndicators } from "@/features/cities/queries/use-issue-places-indicators";
import { useIssuePlacesList } from "@/features/cities/queries/use-issue-places-list";
import type {
  CityFilterValues,
  IssuePlaceCountry,
  IssuePlaceRow,
} from "@/features/cities/types";
import {
  formatChangePercent,
  formatStatsCount,
} from "@/features/orders/utils/format-stats";
import { cn } from "@/lib/utils";

const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/routing-2.svg",
    bgClassName: "bg-brand-primary/10",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "active" as const,
    iconSrc: "/svg/tick-square.svg",
    bgClassName: "bg-brand-success-light",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "inactive" as const,
    iconSrc: "/svg/forbidden-2.svg",
    bgClassName: "bg-brand-light-yellow",
    valueClassName: "text-brand-dark-blue",
  },
] as const;

const COUNTRY_TABS = [
  { id: "sa" as const, iconSrc: "/svg/location.svg" },
  { id: "ph" as const, iconSrc: "/svg/routing-2.svg" },
] as const;

const TAB_TRIGGER_CLASS =
  "h-12 min-w-[140px] flex-1 gap-2 border border-black/10 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-primary data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

function tabRoundedClass(index: number, total: number): string {
  if (index === 0) return "rounded-s-full! rounded-e-xl!";
  if (index === total - 1) return "rounded-e-full! rounded-s-xl!";
  return "rounded-none!";
}

type IssuePlacesPanelProps = {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
};

export default function IssuePlacesPanel({
  createOpen,
  onCreateOpenChange,
}: IssuePlacesPanelProps) {
  const t = useTranslations("Cities");
  const [country, setCountry] = useState<IssuePlaceCountry>("sa");
  const [draftFilters, setDraftFilters] = useState<CityFilterValues>(
    DEFAULT_ISSUE_PLACE_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] = useState<CityFilterValues>(
    DEFAULT_ISSUE_PLACE_FILTERS,
  );
  const [page, setPage] = useState(1);

  const { data: indicators, isLoading: isStatsLoading } =
    useIssuePlacesIndicators(country);
  const { data, isLoading, isError, error } = useIssuePlacesList(
    country,
    appliedFilters,
    page,
    ISSUE_PLACES_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const handleCountryChange = (value: string) => {
    setCountry(value as IssuePlaceCountry);
    setDraftFilters(DEFAULT_ISSUE_PLACE_FILTERS);
    setAppliedFilters(DEFAULT_ISSUE_PLACE_FILTERS);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(draftFilters);
  };

  const columns: DataTableColumn<IssuePlaceRow>[] = [
    {
      id: "nameAr",
      header: t("table.nameAr"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.nameAr || "—"}
        </span>
      ),
    },
    {
      id: "nameEn",
      header: t("table.nameEn"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {row.nameEn || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <CityStatusBadge status={row.status} />,
    },
    {
      id: "createdAt",
      header: t("table.createdAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.createdDate}
          </span>
          <span className="text-xs text-brand-gris">{row.createdTime}</span>
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.updatedDate}
          </span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <IssuePlaceRowActions place={row} />,
    },
  ];

  return (
    <>
      <IssuePlaceFormDialog
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        defaultCountry={country}
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((indicator) => {
          const rawValue =
            indicator.key === "total"
              ? indicators?.total
              : indicator.key === "active"
                ? indicators?.active
                : indicators?.inactive;

          return (
            <InfoCard
              key={indicator.key}
              title={t(`indicators.issuePlaces.${indicator.key}`)}
              value={formatStatsCount(rawValue, isStatsLoading)}
              change={formatChangePercent(undefined, isStatsLoading)}
              period={t("period")}
              iconSrc={indicator.iconSrc}
              bgClassName={indicator.bgClassName}
              valueClassName={indicator.valueClassName}
            />
          );
        })}
      </section>

      <Tabs
        value={country}
        onValueChange={handleCountryChange}
        className="gap-0"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
          {COUNTRY_TABS.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                TAB_TRIGGER_CLASS,
                tabRoundedClass(index, COUNTRY_TABS.length),
              )}
            >
              <CustomIcon
                src={tab.iconSrc}
                size={18}
                className="text-current"
              />
              <span>{t(`countryTabs.${tab.id}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
          <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
            <CustomIcon
              src="/svg/tag-2.svg"
              size={20}
              className="shrink-0 text-brand-primary"
            />
            <span>{t(`listTitle.issuePlacesByCountry.${country}`)}</span>
          </h2>

          <CitiesFilters
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={handleApplyFilters}
          />
        </div>

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => String(row.id)}
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/routing-2.svg"
              title={
                isError
                  ? error instanceof Error
                    ? error.message
                    : t("empty.issuePlaces.title")
                  : t("empty.issuePlaces.title")
              }
              description={
                isError ? " " : t("empty.issuePlaces.description")
              }
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
    </>
  );
}
