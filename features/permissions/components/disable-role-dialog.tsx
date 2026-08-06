"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import PermissionRoleBadge from "@/features/permissions/components/permission-role-badge";
import type { PermissionRoleRow } from "@/features/permissions/types";
import { cn } from "@/lib/utils";

type DisableRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: PermissionRoleRow | null;
  onConfirm?: (role: PermissionRoleRow) => void;
};

export default function DisableRoleDialog({
  open,
  onOpenChange,
  role,
  onConfirm,
}: DisableRoleDialogProps) {
  const t = useTranslations("Permissions.disableDialog");

  if (!role) {
    return null;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(role);
    } else {
      toast.success(t("successToast"));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-md"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 py-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-accent/10">
            <CustomIcon
              src="/svg/disabled-2.svg"
              size={28}
              className="text-brand-accent"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-brand-black">{t("heading")}</h3>
            <DialogDescription className="text-sm leading-relaxed text-brand-gris">
              {t("description")}
            </DialogDescription>
          </div>

          <div className="w-full rounded-[1.5rem] bg-brand-primary/10 px-4 py-1 text-start">
            <DetailRow
              icon={
                <CustomIcon
                  src="/svg/shield-tick.svg"
                  size={16}
                  className="text-brand-gris"
                />
              }
              label={t("permissionsCount")}
              value={
                <span dir="ltr">
                  {String(role.permissionsCount).padStart(2, "0")}
                </span>
              }
            />
            <DetailRow
              icon={
                <CustomIcon
                  src="/svg/personalcard.svg"
                  size={16}
                  className="text-brand-gris"
                />
              }
              label={t("roleName")}
              value={
                <PermissionRoleBadge
                  label={role.label || role.name}
                  roleKey={role.roleKey}
                />
              }
              showDivider={false}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center">
          <Button
            type="button"
            onClick={handleConfirm}
            className="group relative h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-accent px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-accent/90 hover:shadow-md hover:shadow-brand-accent/20 active:scale-[0.98] sm:flex-[1.6]"
          >
            <span
              className="confirm-chevron-start inline-flex items-center"
              aria-hidden
            >
              <ChevronsLeft
                className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
            <span className="tracking-wide">{t("confirm")}</span>
            <span
              className="confirm-chevron-end inline-flex items-center"
              aria-hidden
            >
              <ChevronsRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                strokeWidth={2.25}
              />
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-2xl bg-brand-black/5 px-5 font-semibold text-brand-gris hover:bg-brand-black/5 sm:flex-1 hover:text-brand-black/70"
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  value,
  showDivider = true,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  showDivider?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3.5",
        showDivider && "border-b border-black/5",
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-sm text-brand-gris">
        {icon}
        <span>{label}</span>
      </div>
      <div className="min-w-0 text-sm font-semibold text-brand-black">
        {value}
      </div>
    </div>
  );
}
