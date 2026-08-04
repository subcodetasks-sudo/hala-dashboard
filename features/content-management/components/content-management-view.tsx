"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import InfoCard from "@/components/info-card";
import DataTable, { type DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddBannerDialog from "@/features/content-management/components/add-banner-dialog";
import AddBlogDialog from "@/features/content-management/components/add-blog-dialog";
import AddFaqDialog from "@/features/content-management/components/add-faq-dialog";
import AddLegalDialog from "@/features/content-management/components/add-legal-dialog";
import ContentFilters from "@/features/content-management/components/content-filters";
import ContentMetaBadge from "@/features/content-management/components/content-meta-badge";
import ContentRowActions from "@/features/content-management/components/content-row-actions";
import ContentStatusBadge from "@/features/content-management/components/content-status-badge";
import { DEFAULT_CONTENT_FILTERS } from "@/features/content-management/mock-data";
import { useContentIndicators } from "@/features/content-management/queries/use-content-indicators";
import { useContentList } from "@/features/content-management/queries/use-content-list";
import type {
  ContentCategory,
  ContentFilterValues,
  ContentRow,
} from "@/features/content-management/types";
import {
  formatChangePercent,
  formatStatsCount,
} from "@/lib/format-stats";
import { cn } from "@/lib/utils";

/** RTL: first item renders on the right (matches design order). */
const INDICATOR_CARDS = [
  {
    key: "total" as const,
    iconSrc: "/svg/receipt-2.svg",
    bgClassName: "bg-brand-primary/10",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "published" as const,
    iconSrc: "/svg/tick-square.svg",
    bgClassName: "bg-brand-light-yellow",
    valueClassName: "text-brand-dark-blue",
  },
  {
    key: "drafts" as const,
    iconSrc: "/svg/information.svg",
    // Soft pink wash — no brand token for this pastel (same as completed pickup card)
    bgClassName: "bg-[#FDEAF7]",
    valueClassName: "text-brand-dark-blue",
  },
] as const;

/** RTL: first tab renders on the right (matches design order). */
const CONTENT_TABS = [
  { id: "faqs" as const, iconSrc: "/svg/info-circle.svg" },
  { id: "blog" as const, iconSrc: "/svg/firstline.svg" },
  { id: "banners" as const, iconSrc: "/svg/notification-status.svg" },
  { id: "legal" as const, iconSrc: "/svg/lamp-charge.svg" },
] as const;

const TAB_TRIGGER_CLASS =
  "h-12 min-w-[140px] flex-1 gap-2 border border-black/10 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-primary data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

function tabRoundedClass(index: number, total: number): string {
  // `!` beats TabsTrigger's base `rounded-md` (twMerge won't drop it for side radii).
  if (index === 0) return "rounded-s-full! rounded-e-xl!";
  if (index === total - 1) return "rounded-e-full! rounded-s-xl!";
  return "rounded-none!";
}

export default function ContentManagementView() {
  const t = useTranslations("ContentManagement");
  const [activeCategory, setActiveCategory] =
    useState<ContentCategory>("faqs");
  const [draftFilters, setDraftFilters] = useState<ContentFilterValues>(
    DEFAULT_CONTENT_FILTERS
  );
  const [appliedFilters, setAppliedFilters] = useState<ContentFilterValues>(
    DEFAULT_CONTENT_FILTERS
  );
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [addBlogOpen, setAddBlogOpen] = useState(false);
  const [addLegalOpen, setAddLegalOpen] = useState(false);
  const [addBannerOpen, setAddBannerOpen] = useState(false);

  const { data: indicators, isLoading: isStatsLoading } =
    useContentIndicators(activeCategory);
  const { data: rows = [], isLoading } = useContentList(
    activeCategory,
    appliedFilters
  );

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value as ContentCategory);
    setDraftFilters(DEFAULT_CONTENT_FILTERS);
    setAppliedFilters(DEFAULT_CONTENT_FILTERS);
  };

  const columns: DataTableColumn<ContentRow>[] = [
    {
      id: "title",
      header: t("table.title"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand-black">{row.title}</span>
          <CustomIcon
            src="/svg/info-circle.svg"
            size={16}
            className="shrink-0 text-brand-gris"
          />
        </div>
      ),
    },
    {
      id: "type",
      header: t("table.type"),
      cell: (row) => (
        <ContentMetaBadge
          label={row.typeLabel}
          className="bg-[#FDEAF7] text-brand-purple"
        />
      ),
    },
    {
      id: "updatedAt",
      header: t("table.lastUpdate"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.updatedDate}
          </span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    ...(activeCategory === "faqs"
      ? []
      : [
          {
            id: "appearance",
            header: t("table.appearance"),
            cell: (row: ContentRow) => (
              <ContentMetaBadge
                label={
                  row.appearance
                    ? t(`appearance.${row.appearance}`)
                    : "—"
                }
                className="bg-brand-primary/10 text-brand-dark-blue"
              />
            ),
          } satisfies DataTableColumn<ContentRow>,
        ]),
    {
      id: "author",
      header: t("table.by"),
      cell: (row) => (
        <ContentMetaBadge
          label={t(
            `author.${activeCategory === "faqs" ? "superAdmin" : row.author}`
          )}
          className="bg-brand-light-yellow text-brand-warning"
          dotClassName="bg-brand-warning"
        />
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => <ContentStatusBadge status={row.status} />,
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => (
        <ContentRowActions contentId={row.id} title={row.title} />
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
          data-category={activeCategory}
          onClick={() => {
            if (activeCategory === "faqs") {
              setAddFaqOpen(true);
            } else if (activeCategory === "blog") {
              setAddBlogOpen(true);
            } else if (activeCategory === "banners") {
              setAddBannerOpen(true);
            } else if (activeCategory === "legal") {
              setAddLegalOpen(true);
            }
          }}
          className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span>{t("addContent")}</span>
        </Button>
      </div>

      <AddFaqDialog open={addFaqOpen} onOpenChange={setAddFaqOpen} />
      <AddBlogDialog open={addBlogOpen} onOpenChange={setAddBlogOpen} />
      <AddBannerDialog open={addBannerOpen} onOpenChange={setAddBannerOpen} />
      <AddLegalDialog open={addLegalOpen} onOpenChange={setAddLegalOpen} />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INDICATOR_CARDS.map((indicator) => {
          const rawValue =
            indicator.key === "total"
              ? indicators?.total
              : indicator.key === "published"
                ? indicators?.published
                : indicators?.drafts;

          return (
            <InfoCard
              key={indicator.key}
              title={t(`indicators.${indicator.key}`)}
              value={formatStatsCount(rawValue, isStatsLoading)}
              change={formatChangePercent(
                indicators?.changePercent,
                isStatsLoading
              )}
              period={t("period")}
              iconSrc={indicator.iconSrc}
              bgClassName={indicator.bgClassName}
              valueClassName={indicator.valueClassName}
            />
          );
        })}
      </section>

      <Tabs
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="gap-0"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
          {CONTENT_TABS.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                TAB_TRIGGER_CLASS,
                tabRoundedClass(index, CONTENT_TABS.length)
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

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
          <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
            <CustomIcon
              src="/svg/tag-2.svg"
              size={20}
              className="shrink-0 text-brand-primary"
            />
            <span>{t(`listTitle.${activeCategory}`)}</span>
          </h2>

          <ContentFilters
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={() => setAppliedFilters(draftFilters)}
          />
        </div>

        <DataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          selectable
          isLoading={isLoading}
          emptyContent={
            <EmptyTableState
              iconSrc="/svg/receipt-2.svg"
              title={t("empty.title")}
              description={t("empty.description")}
            />
          }
        />
      </section>
    </div>
  );
}
