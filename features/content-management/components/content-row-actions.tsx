"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import UnpublishContentDialog from "@/features/content-management/components/unpublish-content-dialog";

type ContentRowActionsProps = {
  contentId: string;
  title: string;
};

export default function ContentRowActions({
  contentId,
  title,
}: ContentRowActionsProps) {
  const t = useTranslations("ContentManagement.table");
  const [unpublishOpen, setUnpublishOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-label={t("view", { title })}
          data-content-id={contentId}
          className="size-9 rounded-xl border border-brand-primary/20 bg-brand-background p-0 text-brand-black hover:bg-brand-background hover:text-brand-black"
        >
          <CustomIcon src="/svg/eye.svg" size={16} className="text-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("edit", { title })}
          data-content-id={contentId}
          className="size-9 rounded-xl border border-brand-primary/25 bg-brand-primary/10 p-0 text-brand-dark-blue hover:bg-brand-primary/15 hover:text-brand-dark-blue"
        >
          <CustomIcon src="/svg/edit.svg" size={16} className="text-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("block", { title })}
          data-content-id={contentId}
          onClick={() => setUnpublishOpen(true)}
          className="size-9 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-0 text-brand-accent hover:bg-brand-accent/15 hover:text-brand-accent"
        >
          <CustomIcon src="/svg/block.svg" size={16} className="text-current" />
        </Button>
      </div>

      <UnpublishContentDialog
        open={unpublishOpen}
        onOpenChange={setUnpublishOpen}
        contentId={contentId}
        title={title}
      />
    </>
  );
}
