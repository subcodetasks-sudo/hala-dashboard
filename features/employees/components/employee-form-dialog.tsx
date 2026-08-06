"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ChevronsLeft, ChevronsRight, Eye, EyeOff, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useCreateAdmin } from "@/features/employees/queries/use-create-admin";
import { useUpdateAdmin } from "@/features/employees/queries/use-update-admin";
import { useRoles } from "@/features/employees/queries/use-roles";
import {
  createEmployeeFormSchema,
  toSaudiMobileApi,
  type EmployeeFormValues,
} from "@/features/employees/schemas/employee-form-schema";
import type { EmployeeRow } from "@/features/employees/types";
import { mapJobRoleToApiFilter } from "@/features/employees/utils/map-admin-to-employee-row";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const PASSWORD_FIELD_CLASS = cn(FIELD_CLASS, "pe-11");

const PASSWORD_TOGGLE_CLASS =
  "absolute inset-e-3 top-1/2 -translate-y-1/2 text-brand-gris transition-colors hover:text-brand-primary disabled:pointer-events-none disabled:opacity-50";

const SELECT_TRIGGER_CLASS =
  "h-11! w-full rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm font-medium text-brand-black [&_svg]:text-brand-accent";

const EMPTY_FORM_VALUES: EmployeeFormValues = {
  nationalId: "",
  name: "",
  phone: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};

type EmployeeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  /** Required when `mode` is `"edit"`. List row fields are enough to prefill. */
  employee?: EmployeeRow;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

function toFormValues(employee: EmployeeRow): EmployeeFormValues {
  const rawPhone = employee.phone === "—" ? "" : employee.phone.replace(/\D/g, "");
  // Local input expects 9-digit mobile (e.g. 531321321), stripping leading 0 or 966 prefix
  const phone = rawPhone.startsWith("966")
    ? rawPhone.slice(3)
    : rawPhone.startsWith("0")
      ? rawPhone.slice(1)
      : rawPhone;

  return {
    nationalId: employee.nationalId || employee.idNumber || "",
    name: employee.name === "—" ? "" : employee.name,
    phone,
    email: employee.email === "—" ? "" : employee.email,
    role: mapJobRoleToApiFilter(employee.role),
    password: "",
    confirmPassword: "",
  };
}

function getDefaultValues(
  mode: "create" | "edit",
  employee?: EmployeeRow,
): EmployeeFormValues {
  if (mode === "edit" && employee) {
    return toFormValues(employee);
  }
  return EMPTY_FORM_VALUES;
}

export default function EmployeeFormDialog({
  open,
  onOpenChange,
  mode,
  employee,
}: EmployeeFormDialogProps) {
  const t = useTranslations("Employees.FormDialog");
  const tAuth = useTranslations("Auth.Login");
  const locale = useLocale();
  const isCreate = mode === "create";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    isCreate ? undefined : employee?.avatarUrl,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: roles = [], isLoading: isRolesLoading } = useRoles();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();

  const schema = useMemo(
    () =>
      createEmployeeFormSchema({
        passwordOptional: !isCreate,
        messages: {
          nationalIdRequired: t("validation.nationalIdRequired"),
          nationalIdFormat: t("validation.nationalIdFormat"),
          nameRequired: t("validation.nameRequired"),
          phoneRequired: t("validation.phoneRequired"),
          phoneFormat: t("validation.phoneFormat"),
          emailRequired: t("validation.emailRequired"),
          emailInvalid: t("validation.emailInvalid"),
          roleRequired: t("validation.roleRequired"),
          passwordRequired: t("validation.passwordRequired"),
          passwordMin: t("validation.passwordMin"),
          passwordUppercase: t("validation.passwordUppercase"),
          passwordLowercase: t("validation.passwordLowercase"),
          passwordSymbol: t("validation.passwordSymbol"),
          confirmPasswordRequired: t("validation.confirmPasswordRequired"),
          passwordsMismatch: t("validation.passwordsMismatch"),
        },
      }),
    [isCreate, t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(mode, employee),
  });

  const watchedName = watch("name");
  const watchedRole = watch("role");

  useEffect(() => {
    if (!open) return;
    reset(getDefaultValues(mode, employee));
    setAvatarFile(undefined);
    setAvatarPreview(isCreate ? undefined : employee?.avatarUrl);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [employee, isCreate, mode, open, reset]);

  useEffect(() => {
    if (!open || !isCreate || roles.length === 0) return;
    if (watchedRole) return;
    setValue("role", roles[0].name, { shouldValidate: false });
  }, [isCreate, open, roles, setValue, watchedRole]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (isSubmitting) return;
      reset(getDefaultValues(mode, employee));
      setAvatarFile(undefined);
      setAvatarPreview(isCreate ? undefined : employee?.avatarUrl);
    }
    onOpenChange(nextOpen);
  };

  const handleAvatarPick = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!/^image\/(png|jpe?g)$/i.test(file.type)) {
      toast.error(t("photoInvalidType"));
      return;
    }

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = handleSubmit(
    async (values) => {
      setIsSubmitting(true);
      try {
        // UI has one ID field; backend accepts both `id_number` and `national_id`.
        const nationalId = values.nationalId.trim();

        if (isCreate) {
          const result = await createAdmin.mutateAsync({
            name: values.name.trim(),
            email: values.email.trim(),
            idNumber: nationalId,
            nationalId,
            phone: toSaudiMobileApi(values.phone),
            password: values.password,
            confirmPassword: values.confirmPassword,
            status: "active",
            role: values.role.trim(),
            avatar: avatarFile,
          });

          toast.success(result.message || t("successToastCreate"));
          onOpenChange(false);
          return;
        }

        if (!employee?.id) {
          toast.error(t("errorToastEdit"));
          return;
        }

        const result = await updateAdmin.mutateAsync({
          adminId: employee.id,
          input: {
            name: values.name.trim(),
            email: values.email.trim(),
            // Keep existing employee number (e.g. EMP-009); national ID is separate.
            idNumber: employee.idNumber?.trim() || nationalId,
            nationalId,
            phone: toSaudiMobileApi(values.phone),
            password: values.password,
            confirmPassword: values.confirmPassword,
            status: employee.status,
            role: values.role.trim(),
            avatar: avatarFile,
          },
        });

        toast.success(result.message || t("successToastEdit"));
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : isCreate
              ? t("errorToastCreate")
              : t("errorToastEdit"),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    (invalidErrors) => {
      console.warn("Employee form validation failed:", invalidErrors);
      const firstError = Object.values(invalidErrors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      }
    },
  );

  const avatarAlt =
    employee?.name ||
    watchedName.trim() ||
    t(isCreate ? "titleCreate" : "titleEdit");

  const roleOptions = useMemo(() => {
    if (roles.length > 0) return roles;

    // Edit fallback when roles fail to load: keep the prefilled API name selectable.
    if (mode === "edit" && employee) {
      const apiName = mapJobRoleToApiFilter(employee.role);
      return [{ id: 0, name: apiName, label: apiName }];
    }

    return [];
  }, [employee, mode, roles]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="no-scrollbar max-h-[90vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-[1.75rem] border-none bg-white p-6 ring-0 sm:max-w-2xl"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <DialogTitle className="min-w-0 truncate text-base font-bold text-brand-black">
            {isCreate ? t("titleCreate") : t("titleEdit")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              aria-label={t("close")}
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <form
          className="flex min-w-0 flex-col gap-5 px-5 py-6"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold text-brand-black">
                {t("photoLabel")}
              </Label>
              <span className="text-xs text-brand-gris">{t("photoHint")}</span>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
                aria-label={t("photoChange")}
                className="group relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-brand-background bg-brand-background outline-none transition hover:border-brand-primary/40 focus-visible:ring-3 focus-visible:ring-brand-primary/30 disabled:opacity-60"
              >
                <Avatar className="size-full rounded-full">
                  {avatarPreview ? (
                    <AvatarImage
                      src={avatarPreview}
                      alt={avatarAlt}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-brand-primary/15 text-xl font-semibold text-brand-primary">
                    {watchedName.trim() ? (
                      getInitials(watchedName)
                    ) : (
                      <CustomIcon
                        src="/svg/person.svg"
                        size={40}
                        className="text-brand-primary"
                      />
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute inset-0 flex items-center justify-center bg-brand-dark-blue/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera
                    className="size-6 text-brand-white"
                    strokeWidth={1.75}
                  />
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="sr-only"
                disabled={isSubmitting}
                onChange={(event) => {
                  handleAvatarPick(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="employee-form-national-id"
              label={t("nationalId")}
              required
              error={errors.nationalId?.message}
            >
              <Input
                id="employee-form-national-id"
                disabled={isSubmitting}
                dir="ltr"
                inputMode="numeric"
                maxLength={10}
                placeholder={t("nationalIdPlaceholder")}
                className={cn(FIELD_CLASS, "font-clash")}
                aria-invalid={Boolean(errors.nationalId)}
                {...register("nationalId", {
                  onChange: (event) => {
                    event.target.value = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  },
                })}
              />
            </Field>

            <Field
              id="employee-form-name"
              label={t("name")}
              required
              error={errors.name?.message}
            >
              <Input
                id="employee-form-name"
                disabled={isSubmitting}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </Field>

            <Field
              id="employee-form-phone"
              label={t("phone")}
              required
              error={errors.phone?.message}
            >
              <Input
                id="employee-form-phone"
                disabled={isSubmitting}
                dir="ltr"
                inputMode="tel"
                maxLength={10}
                placeholder={t("phonePlaceholder")}
                className={cn(FIELD_CLASS, "font-clash")}
                aria-invalid={Boolean(errors.phone)}
                {...register("phone", {
                  onChange: (event) => {
                    event.target.value = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  },
                })}
              />
            </Field>

            <Field
              id="employee-form-email"
              label={t("email")}
              required
              error={errors.email?.message}
            >
              <Input
                id="employee-form-email"
                type="email"
                disabled={isSubmitting}
                dir="ltr"
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </Field>

            <Field
              id="employee-form-role"
              label={t("role")}
              required
              error={errors.role?.message}
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    dir={locale === "en" ? "ltr" : "rtl"}
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || isRolesLoading}
                  >
                    <SelectTrigger
                      id="employee-form-role"
                      className={SELECT_TRIGGER_CLASS}
                      aria-invalid={Boolean(errors.role)}
                    >
                      <SelectValue
                        placeholder={
                          isRolesLoading
                            ? t("rolesLoading")
                            : t("rolePlaceholder")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="rounded-2xl border-brand-primary/20"
                      side="bottom"
                      align="start"
                      sideOffset={8} // increases the gap between the trigger and the dropdown
                      avoidCollisions={false}
                    >
                      {roleOptions.map((role) => (
                        <SelectItem key={role.id || role.name} value={role.name}>
                          {role.label || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
           
                )}
              />
            </Field>
          </div>

          <div className="relative flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-black/10" />
            <span className="shrink-0 text-sm font-semibold text-brand-black">
              {t("passwordSection")}
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="employee-form-password"
              label={t("password")}
              required={isCreate}
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="employee-form-password"
                  type={showPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  className={PASSWORD_FIELD_CLASS}
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  className={PASSWORD_TOGGLE_CLASS}
                  aria-label={
                    showPassword
                      ? tAuth("password.hide")
                      : tAuth("password.show")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="size-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </Field>

            <Field
              id="employee-form-confirm-password"
              label={t("confirmPassword")}
              required={isCreate}
              error={errors.confirmPassword?.message}
            >
              <div className="relative">
                <Input
                  id="employee-form-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  className={PASSWORD_FIELD_CLASS}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  disabled={isSubmitting}
                  className={PASSWORD_TOGGLE_CLASS}
                  aria-label={
                    showConfirmPassword
                      ? tAuth("password.hide")
                      : tAuth("password.show")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="size-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </Field>
          </div>

          <div className="flex min-w-0 flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative h-11 w-full items-center justify-center gap-2 rounded-full border-none bg-brand-dark-blue px-5 text-sm font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-dark-blue/90 hover:shadow-md active:scale-[0.98] sm:h-12 sm:flex-[1.4] sm:text-base"
            >
              {isSubmitting ? (
                <Spinner className="size-4 text-brand-white sm:size-5" />
              ) : (
                <>
                  <span
                    className="confirm-chevron-start inline-flex items-center"
                    aria-hidden
                  >
                    <ChevronsLeft
                      className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180 sm:size-4"
                      strokeWidth={2.25}
                    />
                  </span>
                  <span className="tracking-wide">
                    {isCreate ? t("saveCreate") : t("saveEdit")}
                  </span>
                  <span
                    className="confirm-chevron-end inline-flex items-center"
                    aria-hidden
                  >
                    <ChevronsRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180 sm:size-4"
                      strokeWidth={2.25}
                    />
                  </span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
              className="h-11 w-full rounded-full bg-[#F5F5F5] px-5 text-sm font-semibold text-brand-black hover:bg-[#EBEBEB] sm:h-12 sm:flex-1 sm:text-base"
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-brand-black">
        {label}{" "}
        {required ? (
          <span className="text-brand-accent" aria-hidden>
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-brand-accent">{error}</p> : null}
    </div>
  );
}
