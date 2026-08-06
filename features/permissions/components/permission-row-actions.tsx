"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DisableRoleDialog from "@/features/permissions/components/disable-role-dialog";
import EditRoleDialog from "@/features/permissions/components/edit-role-dialog";
import type { PermissionRoleRow } from "@/features/permissions/types";
import { Link } from "@/i18n/navigation";

type PermissionRowActionsProps = {
  role: PermissionRoleRow;
};

export default function PermissionRowActions({ role }: PermissionRowActionsProps) {
  const t = useTranslations("Permissions.table");
  const roleName = role.label || role.name;
  const [disableOpen, setDisableOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const viewLabel = t("view", { name: roleName });
  const editLabel = t("edit", { name: roleName });
  const deactivateLabel = t("deactivate", { name: roleName });
  const isInactive = role.status === "inactive";

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                aria-label={viewLabel}
                className="size-9 rounded-xl border border-brand-primary/20 bg-brand-background p-0 text-brand-black hover:bg-brand-background hover:text-brand-black"
              >
                <Link href={`/permissions/${role.id}`}>
                  <CustomIcon src="/svg/eye.svg" size={16} className="text-current" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{viewLabel}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label={editLabel}
                onClick={() => setEditOpen(true)}
                className="size-9 rounded-xl border border-brand-primary/25 bg-brand-primary/10 p-0 text-brand-dark-blue hover:bg-brand-primary/15 hover:text-brand-dark-blue"
              >
                <CustomIcon
                  src="/svg/edit-pencil.svg"
                  size={16}
                  className="text-current"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{editLabel}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label={deactivateLabel}
                disabled={isInactive || role.isProtected}
                onClick={() => setDisableOpen(true)}
                className="size-9 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-0 text-brand-accent hover:bg-brand-accent/15 hover:text-brand-accent disabled:opacity-40"
              >
                <CustomIcon
                  src="/svg/disabled-2.svg"
                  size={16}
                  className="text-current"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p>{deactivateLabel}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <EditRoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        role={role}
      />

      <DisableRoleDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        role={role}
      />
    </>
  );
}
