"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitiesFilters from "@/features/cities/components/cities-filters";
import CityFormDialog from "@/features/cities/components/city-form-dialog";
import CityRowActions from "@/features/cities/components/city-row-actions";
import CityStatusBadge from "@/features/cities/components/city-status-badge";
import IssuePlacesPanel from "@/features/cities/components/issue-places-panel";
import {
  CITIES_PER_PAGE,
  DEFAULT_CITY_FILTERS,
} from "@/features/cities/mock-data";
import { useCitiesIndicators } from "@/features/cities/queries/use-cities-indicators";
import { useCitiesList } from "@/features/cities/queries/use-cities-list";
import type {
  CitiesTab,
  CityFilterValues,
  CityRow,
} from "@/features/cities/types";
import {
  formatChangePercent,
  formatStatsCount,
} from "@/lib/format-stats";
import { cn } from "@/lib/utils";

const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/location.svg",
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

/** RTL: first tab renders on the right (matches design order). */
const CITY_TABS = [
  { id: "cities" as const, iconSrc: "/svg/location.svg" },
  { id: "issuePlaces" as const, iconSrc: "/svg/routing-2.svg" },
] as const;

const TAB_TRIGGER_CLASS =
  "h-12 min-w-[140px] flex-1 gap-2 border border-black/10 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-primary data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

function tabRoundedClass(index: number, total: number): string {
  if (index === 0) return "rounded-s-full! rounded-e-xl!";
  if (index === total - 1) return "rounded-e-full! rounded-s-xl!";
  return "rounded-none!";
}

export default function CitiesView() {
  const t = useTranslations("Cities");
  const [activeTab, setActiveTab] = useState<CitiesTab>("cities");
  const [draftFilters, setDraftFilters] = useState<CityFilterValues>(
    DEFAULT_CITY_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] = useState<CityFilterValues>(
    DEFAULT_CITY_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [createCityOpen, setCreateCityOpen] = useState(false);
  const [createIssuePlaceOpen, setCreateIssuePlaceOpen] = useState(false);

  const isCitiesTab = activeTab === "cities";

  const { data: indicators, isLoading: isStatsLoading } =
    useCitiesIndicators(activeTab);
  const { data, isLoading, isError, error } = useCitiesList(
    activeTab,
    appliedFilters,
    page,
    CITIES_PER_PAGE,
  );

  const rows = data?.items ?? [];

  const handleTabChange = (value: string) => {
    setActiveTab(value as CitiesTab);
    setDraftFilters(DEFAULT_CITY_FILTERS);
    setAppliedFilters(DEFAULT_CITY_FILTERS);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(draftFilters);
  };

  const columns: DataTableColumn<CityRow>[] = [
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
      cell: (row) => <CityRowActions city={row} />,
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
          onClick={() =>
            isCitiesTab
              ? setCreateCityOpen(true)
              : setCreateIssuePlaceOpen(true)
          }
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{isCitiesTab ? t("addCity") : t("addIssuePlace")}</span>
        </Button>
      </div>

      <CityFormDialog open={createCityOpen} onOpenChange={setCreateCityOpen} />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="gap-0"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
          {CITY_TABS.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                TAB_TRIGGER_CLASS,
                tabRoundedClass(index, CITY_TABS.length),
              )}
            >
              <CustomIcon
                src={tab.iconSrc}
                size={18}
                className="text-current"
              />
              <span>{t(`tabs.${tab.id}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isCitiesTab ? (
        <>
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
                  title={t(`indicators.cities.${indicator.key}`)}
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

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
              <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
                <CustomIcon
                  src="/svg/tag-2.svg"
                  size={20}
                  className="shrink-0 text-brand-primary"
                />
                <span>{t("listTitle.cities")}</span>
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
                  iconSrc="/svg/location.svg"
                  title={
                    isError
                      ? error instanceof Error
                        ? error.message
                        : t("empty.cities.title")
                      : t("empty.cities.title")
                  }
                  description={
                    isError ? " " : t("empty.cities.description")
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
      ) : (
        <IssuePlacesPanel
          createOpen={createIssuePlaceOpen}
          onCreateOpenChange={setCreateIssuePlaceOpen}
        />
      )}
    </div>
  );
}
