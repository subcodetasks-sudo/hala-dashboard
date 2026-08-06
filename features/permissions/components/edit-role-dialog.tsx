"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import {
  areAllPermissionIdsSelected,
  collectPermissionIds,
  getPermissionModuleIcon,
  mapSelectedPermissionNames,
  permissionActionKey,
  sortPermissionsByAction,
  splitPermissionGroupsIntoColumns,
} from "@/features/permissions/create-role-config";
import { permissionKeys } from "@/features/permissions/query-keys";
import { usePermissionsGrouped } from "@/features/permissions/queries";
import {
  createRoleFormSchema,
  type CreateRoleFieldValues,
} from "@/features/permissions/schemas/create-role-schema";
import type {
  ApiPermission,
  ApiPermissionGroup,
  PermissionRoleRow,
} from "@/features/permissions/types";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

const SAVE_BUTTON_CLASS =
  "group relative h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-brand-primary px-6 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98] disabled:opacity-70";

const PERMISSION_SWITCH_CLASS =
  "relative inline-flex h-6 w-11 min-w-11 shrink-0 items-center justify-start rounded-full border-transparent p-0.5 hover:bg-transparent hover:text-inherit focus-visible:ring-3 focus-visible:ring-brand-primary/30 disabled:opacity-50 data-[state=off]:bg-brand-gris/30 data-[state=on]:bg-brand-success aria-pressed:bg-brand-success";

const PERMISSION_SWITCH_THUMB_CLASS =
  "block size-5 shrink-0 rounded-full bg-brand-white shadow-sm transition-[margin] duration-200 ease-in-out group-data-[state=on]/toggle:ms-auto";

type EditRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: PermissionRoleRow | null;
};

function toFormValues(role: PermissionRoleRow): CreateRoleFieldValues {
  const displayName = role.label || role.name;
  return {
    name: displayName,
    description: displayName,
    status: role.status,
  };
}

export default function EditRoleDialog({
  open,
  onOpenChange,
  role,
}: EditRoleDialogProps) {
  const t = useTranslations("Permissions.Edit");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<
    Set<number>
  >(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: permissionGroups = [],
    isLoading: isPermissionsLoading,
    error: groupedPermissionsError,
  } = usePermissionsGrouped();

  useEffect(() => {
    if (open && groupedPermissionsError) {
      toast.error(
        groupedPermissionsError instanceof Error
          ? groupedPermissionsError.message
          : t("errorToast"),
      );
    }
  }, [groupedPermissionsError, open, t]);

  const schema = useMemo(
    () =>
      createRoleFormSchema({
        nameRequired: t("validation.nameRequired"),
        descriptionRequired: t("validation.descriptionRequired"),
        statusRequired: t("validation.statusRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoleFieldValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (!open || !role) return;

    reset(toFormValues(role));
    setSelectedPermissionIds(
      new Set(role.permissions.map((permission) => permission.id)),
    );
  }, [open, reset, role]);

  const status = watch("status");
  const allPermissionIds = useMemo(
    () => collectPermissionIds(permissionGroups),
    [permissionGroups],
  );
  const allPermissionsEnabled = areAllPermissionIdsSelected(
    permissionGroups,
    selectedPermissionIds,
  );

  const columns = useMemo(
    () => splitPermissionGroupsIntoColumns(permissionGroups),
    [permissionGroups],
  );

  const handleMasterToggle = (checked: boolean) => {
    setSelectedPermissionIds(checked ? new Set(allPermissionIds) : new Set());
  };

  const handlePermissionToggle = (permissionId: number, checked: boolean) => {
    setSelectedPermissionIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!role) return;

    setIsSubmitting(true);
    try {
      const permissionNames = mapSelectedPermissionNames(
        permissionGroups,
        selectedPermissionIds,
      );

      const response = await fetch(
        `/api/roles/${encodeURIComponent(role.id)}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Accept-Language": locale,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            permissions: permissionNames,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || t("errorToast"));
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: permissionKeys.roles() }),
        queryClient.invalidateQueries({
          queryKey: permissionKeys.role(role.id),
        }),
      ]);

      toast.success(data.message || t("successToast"));
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t("errorToast"),
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  if (!role) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[1.75rem] border-none bg-white p-0 ring-0 sm:max-w-5xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 flex-col gap-0.5">
            <DialogTitle className="text-base font-bold text-brand-black sm:text-lg">
              {t("title")}
            </DialogTitle>
            <p className="truncate text-sm text-brand-gris">{t("subtitle")}</p>
          </div>
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

        <div className="flex shrink-0 flex-col gap-3 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3 rounded-full border border-black/5 bg-brand-white px-4 py-2.5">
            <span className="text-sm font-semibold text-brand-black">
              {t("selectAll")}
            </span>
            <Toggle
              pressed={allPermissionsEnabled}
              onPressedChange={handleMasterToggle}
              aria-label={t("activateAll")}
              disabled={isPermissionsLoading || allPermissionIds.length === 0}
              className={PERMISSION_SWITCH_CLASS}
            >
              <span aria-hidden className={PERMISSION_SWITCH_THUMB_CLASS} />
            </Toggle>
            <span className="text-sm text-brand-gris">{t("activateAll")}</span>
          </div>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className={SAVE_BUTTON_CLASS}
          >
            {isSubmitting ? (
              <Spinner className="size-4 text-brand-white" />
            ) : (
              <span
                className="confirm-chevron-start inline-flex items-center"
                aria-hidden
              >
                <ChevronsLeft
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                  strokeWidth={2.25}
                />
              </span>
            )}
            <span className="tracking-wide">{t("save")}</span>
            {isSubmitting ? null : (
              <span
                className="confirm-chevron-end inline-flex items-center"
                aria-hidden
              >
                <ChevronsRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                  strokeWidth={2.25}
                />
              </span>
            )}
          </Button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="edit-role-name"
                className="text-sm font-semibold text-brand-black"
              >
                {t("fields.name")}
                <span className="text-brand-accent"> *</span>
              </Label>
              <Input
                id="edit-role-name"
                placeholder={t("fields.namePlaceholder")}
                className={cn(FIELD_CLASS, errors.name && "border-brand-accent")}
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-brand-accent">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="edit-role-description"
                className="text-sm font-semibold text-brand-black"
              >
                {t("fields.description")}
                <span className="text-brand-accent"> *</span>
              </Label>
              <Input
                id="edit-role-description"
                placeholder={t("fields.descriptionPlaceholder")}
                className={cn(
                  FIELD_CLASS,
                  errors.description && "border-brand-accent",
                )}
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-xs text-brand-accent">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="edit-role-status"
                className="text-sm font-semibold text-brand-black"
              >
                {t("fields.status")}
                <span className="text-brand-accent"> *</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as CreateRoleFieldValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id="edit-role-status"
                  className={SELECT_TRIGGER_CLASS}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-black/10 bg-brand-white">
                  <SelectItem value="active" className="rounded-xl font-semibold">
                    {t("fields.statusActive")}
                  </SelectItem>
                  <SelectItem
                    value="inactive"
                    className="rounded-xl font-semibold"
                  >
                    {t("fields.statusInactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status ? (
                <p className="text-xs text-brand-accent">
                  {errors.status.message}
                </p>
              ) : null}
            </div>
          </div>

          <section className="flex flex-col gap-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
              <CustomIcon
                src="/svg/shield-tick.svg"
                size={20}
                className="text-brand-dark-blue"
              />
              <span>{t("permissionsTitle")}</span>
            </h2>

            {isPermissionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="size-5 text-brand-primary" />
              </div>
            ) : permissionGroups.length === 0 ? (
              <p className="py-8 text-center text-sm text-brand-gris">
                {t("emptyPermissions")}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {columns.map((columnGroups, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-4">
                    {columnGroups.map((group) => (
                      <PermissionModuleCard
                        key={group.module}
                        group={group}
                        selectedPermissionIds={selectedPermissionIds}
                        onToggle={handlePermissionToggle}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type PermissionModuleCardProps = {
  group: ApiPermissionGroup;
  selectedPermissionIds: ReadonlySet<number>;
  onToggle: (permissionId: number, checked: boolean) => void;
};

function PermissionModuleCard({
  group,
  selectedPermissionIds,
  onToggle,
}: PermissionModuleCardProps) {
  const permissions = sortPermissionsByAction(group.permissions);
  const iconSrc = getPermissionModuleIcon(group.module);

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-primary/10 bg-brand-background/40">
      <div className="flex items-center gap-3 border-b border-black/5 bg-brand-white px-4 py-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
          <CustomIcon src={iconSrc} size={20} className="text-brand-primary" />
        </span>
        <h3 className="text-sm font-bold text-brand-dark-blue">{group.module}</h3>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:gap-x-5">
        {permissions.map((permission) => (
          <PermissionToggleRow
            key={permission.id}
            permission={permission}
            moduleLabel={group.module}
            checked={selectedPermissionIds.has(permission.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </article>
  );
}

type PermissionToggleRowProps = {
  permission: ApiPermission;
  moduleLabel: string;
  checked: boolean;
  onToggle: (permissionId: number, checked: boolean) => void;
};

function PermissionToggleRow({
  permission,
  moduleLabel,
  checked,
  onToggle,
}: PermissionToggleRowProps) {
  const actionLabel = permissionActionKey(permission.name);

  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <Toggle
        pressed={checked}
        onPressedChange={(pressed) => onToggle(permission.id, pressed)}
        aria-label={`${moduleLabel} — ${actionLabel}`}
        className={PERMISSION_SWITCH_CLASS}
      >
        <span aria-hidden className={PERMISSION_SWITCH_THUMB_CLASS} />
      </Toggle>
      <span className="text-sm font-medium text-brand-black">{actionLabel}</span>
    </label>
  );
}
