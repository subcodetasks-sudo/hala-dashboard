"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import BlogFormDialog from "@/features/content-management/components/blog-form-dialog";
import DeleteBlogDialog from "@/features/content-management/components/delete-blog-dialog";
import ViewBlogDialog from "@/features/content-management/components/view-blog-dialog";
import type { BlogRow } from "@/features/content-management/types";

type BlogRowActionsProps = {
  item: BlogRow;
};

export default function BlogRowActions({ item }: BlogRowActionsProps) {
  const t = useTranslations("ContentManagement.blog.table");
  const locale = useLocale();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const displayName =
    locale === "ar"
      ? item.titleAr || item.titleEn
      : item.titleEn || item.titleAr;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("view", { name: displayName })}
          onClick={() => setViewOpen(true)}
          className="size-9 rounded-xl border border-brand-primary/20 bg-brand-background p-0 text-brand-black hover:bg-brand-background hover:text-brand-black"
        >
          <CustomIcon src="/svg/eye.svg" size={16} className="text-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("edit", { name: displayName })}
          onClick={() => setEditOpen(true)}
          className="size-9 rounded-xl border border-brand-primary/25 bg-brand-primary/10 p-0 text-brand-dark-blue hover:bg-brand-primary/15 hover:text-brand-dark-blue"
        >
          <CustomIcon src="/svg/edit.svg" size={16} className="text-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("delete", { name: displayName })}
          onClick={() => setDeleteOpen(true)}
          className="size-9 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-0 text-brand-accent hover:bg-brand-accent/15 hover:text-brand-accent"
        >
          <CustomIcon src="/svg/trash.svg" size={16} className="text-current" />
        </Button>
      </div>

      <ViewBlogDialog open={viewOpen} onOpenChange={setViewOpen} item={item} />
      <BlogFormDialog open={editOpen} onOpenChange={setEditOpen} item={item} />
      <DeleteBlogDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={item}
      />
    </>
  );
}
