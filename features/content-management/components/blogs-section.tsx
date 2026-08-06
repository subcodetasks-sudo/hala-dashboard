"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import EmptyTableState from "@/components/empty-table-state";
import DataTable, { type DataTableColumn } from "@/components/table";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BlogFormDialog from "@/features/content-management/components/blog-form-dialog";
import BlogRowActions from "@/features/content-management/components/blog-row-actions";
import BlogsFilters from "@/features/content-management/components/blogs-filters";
import { useBlogs } from "@/features/content-management/queries/use-blogs";
import {
  BLOGS_PER_PAGE,
  DEFAULT_BLOG_FILTERS,
} from "@/features/content-management/schemas/blog-form-schema";
import type {
  BlogFilterValues,
  BlogRow,
} from "@/features/content-management/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";
import { cn } from "@/lib/utils";

export default function BlogsSection() {
  const t = useTranslations("ContentManagement.blog");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<BlogFilterValues>({
    ...DEFAULT_BLOG_FILTERS,
  });
  const [appliedFilters, setAppliedFilters] = useState<BlogFilterValues>({
    ...DEFAULT_BLOG_FILTERS,
  });

  const { data, isLoading, isError, error } = useBlogs(
    page,
    BLOGS_PER_PAGE,
    appliedFilters,
  );

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPage(1);
    setDraftFilters({ ...DEFAULT_BLOG_FILTERS });
    setAppliedFilters({ ...DEFAULT_BLOG_FILTERS });
  };

  const rows = data?.items ?? [];

  const columns: DataTableColumn<BlogRow>[] = [
    {
      id: "image",
      header: t("table.image"),
      cell: (row) => {
        const src = resolveMediaUrl(row.image);
        if (!src) {
          return <span className="text-sm text-brand-gris">—</span>;
        }
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-10 rounded-xl object-cover" />
        );
      },
    },
    {
      id: "title",
      header: t("table.title"),
      cell: (row) => (
        <span className="font-semibold text-brand-black">
          {locale === "ar"
            ? row.titleAr || row.titleEn || "—"
            : row.titleEn || row.titleAr || "—"}
        </span>
      ),
    },
    {
      id: "slug",
      header: t("table.slug"),
      cell: (row) => (
        <span className="text-sm text-brand-gris" dir="ltr">
          {row.slug || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      cell: (row) => {
        const isActive = row.status !== "inactive";
        return (
          <Badge
            className={cn(
              "h-auto! inline-flex items-center gap-1.5 rounded-md border-transparent px-3 py-1.5 text-xs font-semibold",
              isActive
                ? "bg-brand-success-light text-brand-success"
                : "bg-brand-light-yellow text-brand-warning",
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                isActive ? "bg-brand-success" : "bg-brand-warning",
              )}
              aria-hidden
            />
            <span>
              {isActive ? t("table.statusActive") : t("table.statusInactive")}
            </span>
          </Badge>
        );
      },
    },
    {
      id: "publishedAt",
      header: t("table.publishedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.publishedDate || "—"}
          </span>
          {row.publishedTime ? (
            <span className="text-xs text-brand-gris">{row.publishedTime}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: t("table.updatedAt"),
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-start">
          <span className="font-semibold text-brand-black">
            {row.updatedDate || "—"}
          </span>
          <span className="text-xs text-brand-gris">{row.updatedTime}</span>
        </div>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      cell: (row) => <BlogRowActions item={row} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/firstline.svg"
            size={20}
            className="shrink-0 text-brand-primary"
          />
          <span>{t("listTitle")}</span>
        </h2>

        <div className="flex w-full min-w-0 flex-wrap items-end justify-end gap-3 sm:w-auto sm:flex-1">
          <BlogsFilters
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
          >
            <Plus className="size-4" strokeWidth={2} />
            <span>{t("addItem")}</span>
          </Button>
        </div>
      </div>

      <BlogFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        emptyContent={
          <EmptyTableState
            iconSrc="/svg/firstline.svg"
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
  );
}
