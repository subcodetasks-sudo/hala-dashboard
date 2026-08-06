"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import DisableRoleDialog from "@/features/permissions/components/disable-role-dialog";
import EditRoleDialog from "@/features/permissions/components/edit-role-dialog";
import PermissionRoleBadge from "@/features/permissions/components/permission-role-badge";
import PermissionRoleStatusBadge from "@/features/permissions/components/permission-role-status-badge";
import {
  getPermissionModuleIcon,
  permissionActionKey,
} from "@/features/permissions/create-role-config";
import { useRole } from "@/features/permissions/queries";
import { getRoleIconConfig } from "@/features/permissions/role-ui-config";
import type { ApiPermission } from "@/features/permissions/types";
import { groupRolePermissionsByModule } from "@/features/permissions/utils/map-role-to-row";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type RoleDetailsViewProps = {
  roleId: string;
};

function formatUpdatedDate(isoDate: string, locale: "ar" | "en"): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;

  return new Date(year, month - 1, day).toLocaleDateString(
    locale === "ar" ? "ar" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      calendar: "gregory",
    },
  );
}

function formatModuleLabel(module: string): string {
  return module
    .split(".")
    .map((segment) =>
      segment
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    )
    .join(" · ");
}

export default function RoleDetailsView({ roleId }: RoleDetailsViewProps) {
  const t = useTranslations("Permissions.Details");
  const tRoot = useTranslations("Permissions");
  const locale = useLocale() === "en" ? "en" : "ar";
  const router = useRouter();
  const [disableOpen, setDisableOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: role, isLoading, isError, error } = useRole(roleId);

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : tRoot("loadError"),
      );
    }
  }, [error, isError, tRoot]);

  const permissionGroups = useMemo(
    () => (role ? groupRolePermissionsByModule(role.permissions) : []),
    [role],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <Spinner className="size-8 text-brand-primary" />
      </div>
    );
  }

  if (!isLoading && !isError && !role) {
    notFound();
  }

  if (!role) {
    return null;
  }

  const iconConfig = getRoleIconConfig(role.roleKey);
  const roleName = role.label || role.name;
  const isInactive = role.status === "inactive";

  const handleBack = () => {
    router.push("/permissions");
  };

  const infoRows = [
    {
      id: "permissionsCount",
      label: t("info.permissionsCount"),
      value: (
        <span className="font-clash font-semibold" dir="ltr">
          {String(role.permissionsCount).padStart(2, "0")}
        </span>
      ),
    },
    {
      id: "status",
      label: t("info.status"),
      value: <PermissionRoleStatusBadge status={role.status} />,
    },
    {
      id: "updatedAt",
      label: t("info.updatedAt"),
      value: formatUpdatedDate(role.updatedAtIso, locale),
    },
  ] as const;

  return (
    <div className="flex min-w-0 flex-col p-4 pb-8">
      <article className="flex w-full flex-col">
        <header className="flex items-center justify-between gap-4 px-1 py-4 sm:px-0">
          <h1 className="text-base font-bold text-brand-black sm:text-lg">
            {t("title", { roleName })}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("back")}
            onClick={handleBack}
            className="size-9 shrink-0 rounded-full bg-brand-gris/10 text-brand-gris hover:bg-brand-gris/15 hover:text-brand-black"
          >
            {locale === "en" ? (
              <ArrowRight className="size-4 rtl:rotate-0" strokeWidth={2} />
            ) : (
              <ArrowLeft className="size-4 rtl:rotate-0" strokeWidth={2} />
            )}
          </Button>
        </header>

        <div className="flex flex-col gap-8 py-6 sm:py-8">
          <section className="flex flex-col items-center gap-3 pt-2 text-center">
            <span
              className={cn(
                "flex size-24 items-center justify-center rounded-3xl sm:size-28",
                iconConfig.iconBgClassName,
              )}
            >
              <CustomIcon
                src={iconConfig.iconSrc}
                size={40}
                className={iconConfig.iconClassName}
              />
            </span>

            <h2 className="text-xl font-bold text-brand-black sm:text-2xl">
              {roleName}
            </h2>

            <p className="max-w-lg text-sm leading-relaxed text-brand-gris">
              {role.name}
            </p>
          </section>

          <section className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
                <CustomIcon
                  src="/svg/quote-down-circle.svg"
                  size={20}
                  className="text-brand-dark-blue"
                />
                <span>{t("info.title")}</span>
              </h3>
              <PermissionRoleBadge label={roleName} roleKey={role.roleKey} />
            </div>

            <div className="overflow-hidden rounded-2xl bg-brand-background/60">
              {infoRows.map((row, index) => (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center justify-between gap-4 px-4 py-3.5 text-sm",
                    index % 2 === 1 && "bg-brand-white/70",
                  )}
                >
                  <span className="text-brand-gris">{row.label}</span>
                  <span className="font-semibold text-brand-black">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
              <CustomIcon
                src="/svg/receipt-edit.svg"
                size={20}
                className="text-brand-dark-blue"
              />
              <span>{t("permissions.title")}</span>
            </h3>

            {permissionGroups.length === 0 ? (
              <p className="text-sm text-brand-gris">{t("permissions.empty")}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {permissionGroups.map((group) => (
                  <PermissionGroupCard
                    key={group.module}
                    module={group.module}
                    permissions={group.permissions}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-black/5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              disabled={isInactive || role.isProtected}
              onClick={() => setDisableOpen(true)}
              className="h-11 gap-2 rounded-full bg-brand-error px-5 font-semibold text-brand-white hover:bg-brand-error/90 disabled:opacity-50"
            >
              <CustomIcon
                src="/svg/disabled-2.svg"
                size={18}
                className="text-brand-white"
              />
              <span>{t("disable")}</span>
            </Button>
            <Button
              type="button"
              onClick={() => setEditOpen(true)}
              className="h-11 gap-2 rounded-full bg-brand-primary px-5 font-semibold text-brand-white hover:bg-brand-primary/90"
            >
              <CustomIcon
                src="/svg/edit-pencil.svg"
                size={18}
                className="text-brand-white"
              />
              <span>{t("editPermissions")}</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            className="h-11 rounded-full bg-brand-gris/15 px-6 font-semibold text-brand-black hover:bg-brand-gris/25"
          >
            {t("close")}
          </Button>
        </footer>
      </article>

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
    </div>
  );
}

function PermissionGroupCard({
  module,
  permissions,
}: {
  module: string;
  permissions: ApiPermission[];
}) {
  const t = useTranslations("Permissions.Details");
  const iconSrc = getPermissionModuleIcon(module);

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-primary/10 bg-brand-white shadow-[0_2px_12px_rgba(0,49,66,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-brand-primary/8 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15">
            <CustomIcon
              src={iconSrc}
              size={20}
              className="text-brand-primary"
            />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 text-start">
            <span className="text-sm font-bold text-brand-dark-blue">
              {formatModuleLabel(module)}
            </span>
            <span className="text-xs text-brand-gris">
              {t("permissions.enabledCount", { count: permissions.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-4 sm:gap-2.5 sm:px-5">
        {permissions.map((permission) => (
          <span
            key={permission.id}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-success-light/70 px-3 py-2 text-sm font-semibold text-brand-black"
          >
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-success text-brand-white"
              aria-hidden
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span>{permissionActionKey(permission.name)}</span>
          </span>
        ))}
      </div>
    </article>
  );
}
