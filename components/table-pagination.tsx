"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  lastPage: number;
  total?: number;
  onPageChange: (page: number) => void;
  className?: string;
  /**
   * Hide when only one page.
   * Defaults to false so the controls stay visible under list tables.
   */
  hideWhenSinglePage?: boolean;
};

function buildPageItems(
  current: number,
  last: number,
): Array<number | "ellipsis"> {
  if (last <= 7) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < last - 1) {
    items.push("ellipsis");
  }

  items.push(last);
  return items;
}

export default function TablePagination({
  page,
  lastPage,
  total,
  onPageChange,
  className,
  hideWhenSinglePage = false,
}: TablePaginationProps) {
  const t = useTranslations("Common.Pagination");
  const isRtl = useLocale() === "ar";

  if (hideWhenSinglePage && lastPage <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(page, 1), Math.max(lastPage, 1));
  const pageItems = buildPageItems(safePage, Math.max(lastPage, 1));
  const canGoPrevious = safePage > 1;
  const canGoNext = safePage < lastPage;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 sm:flex-row",
        className,
      )}
    >
      {typeof total === "number" ? (
        <p className="text-sm text-brand-gris">
          {t("summary", { page: safePage, lastPage, total })}
        </p>
      ) : (
        <span className="hidden sm:block" />
      )}

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canGoPrevious}
              onClick={() => onPageChange(safePage - 1)}
              className="gap-1 text-brand-black hover:bg-brand-background hover:text-brand-black disabled:opacity-40"
              aria-label={t("previous")}
            >
              {isRtl ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
              <span className="hidden sm:inline">{t("previous")}</span>
            </Button>
          </PaginationItem>

          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-brand-gris" />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  type="button"
                  variant={item === safePage ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => onPageChange(item)}
                  aria-label={t("goToPage", { page: item })}
                  aria-current={item === safePage ? "page" : undefined}
                  className={cn(
                    "size-8 text-sm",
                    item === safePage
                      ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15 hover:text-brand-primary"
                      : "text-brand-black hover:bg-brand-background hover:text-brand-black",
                  )}
                >
                  {item}
                </Button>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canGoNext}
              onClick={() => onPageChange(safePage + 1)}
              className="gap-1 text-brand-black hover:bg-brand-background hover:text-brand-black disabled:opacity-40"
              aria-label={t("next")}
            >
              <span className="hidden sm:inline">{t("next")}</span>
              {isRtl ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
