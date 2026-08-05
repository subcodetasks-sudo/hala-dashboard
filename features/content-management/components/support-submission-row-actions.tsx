"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import DeleteSupportSubmissionDialog from "@/features/content-management/components/delete-support-submission-dialog";
import ViewSupportSubmissionDialog from "@/features/content-management/components/view-support-submission-dialog";
import { useMarkSupportSubmissionRead } from "@/features/content-management/queries/use-mark-support-submission-read";
import type { SupportSubmissionRow } from "@/features/content-management/types";

type SupportSubmissionRowActionsProps = {
  item: SupportSubmissionRow;
};

export default function SupportSubmissionRowActions({
  item,
}: SupportSubmissionRowActionsProps) {
  const t = useTranslations("ContentManagement.support.submissions.table");
  const markRead = useMarkSupportSubmissionRead();
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const displayName = item.fullName || item.phone || String(item.id);
  const isNew = item.status === "new";
  const isMarking = markRead.isPending;

  const handleMarkRead = () => {
    if (!isNew || isMarking) return;

    markRead.mutate(item.id, {
      onSuccess: (payload) => {
        toast.success(payload.message || t("toastMarkedRead"));
      },
      onError: (error) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : t("errorMarkRead"),
        );
      },
    });
  };

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
        {isNew ? (
          <Button
            type="button"
            variant="ghost"
            aria-label={t("markRead", { name: displayName })}
            disabled={isMarking}
            onClick={handleMarkRead}
            className="size-9 rounded-xl border border-brand-success/30 bg-brand-success-light p-0 text-brand-success hover:bg-brand-success-light hover:text-brand-success"
          >
            {isMarking ? (
              <Spinner className="size-4" />
            ) : (
              <CustomIcon
                src="/svg/tick-square.svg"
                size={16}
                className="text-current"
              />
            )}
          </Button>
        ) : null}
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

      <ViewSupportSubmissionDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        item={item}
      />
      <DeleteSupportSubmissionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={item}
      />
    </>
  );
}
