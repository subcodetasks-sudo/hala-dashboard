"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/features/settings/queries/use-settings";
import { useUpsertSettings } from "@/features/settings/queries/use-upsert-settings";
import {
  createSettingsFormSchema,
  EMPTY_SETTINGS_FORM_VALUES,
} from "@/features/settings/schemas/settings-form-schema";
import type {
  SettingsApiItem,
  SettingsFormValues,
} from "@/features/settings/types";
import { resolveMediaUrl } from "@/lib/resolve-media-url";

const FIELD_CLASS =
  "h-11 rounded-full border-black/10 bg-[#FBFBFB] px-4 text-sm text-brand-black placeholder:text-brand-gris/60";

const TEXTAREA_CLASS =
  "min-h-24 rounded-2xl border-black/10 bg-[#FBFBFB] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gris/60";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

function revokeIfBlob(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function readTaxAmount(settings: SettingsApiItem): string {
  const value = settings.taxAmount ?? settings.tax_amount;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return "";
}

function toFormValues(
  settings: SettingsApiItem | null | undefined,
): SettingsFormValues {
  if (!settings) return EMPTY_SETTINGS_FORM_VALUES;

  return {
    descriptionAr: settings.description?.ar ?? "",
    descriptionEn: settings.description?.en ?? "",
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    facebook: settings.facebook ?? "",
    twitter: settings.twitter ?? "",
    instagram: settings.instagram ?? "",
    linkedin: settings.linkedin ?? "",
    youtube: settings.youtube ?? "",
    tiktok: settings.tiktok ?? "",
    snapchat: settings.snapchat ?? "",
    whatsapp: settings.whatsapp ?? "",
    commercialRegister:
      settings.commercialRegister ?? settings.commercial_register ?? "",
    taxNumber: settings.taxNumber ?? settings.tax_number ?? "",
    taxAmount: readTaxAmount(settings),
  };
}

export default function SettingsView() {
  const t = useTranslations("Settings");
  const { data: settings, isLoading, isError, error, refetch } = useSettings();
  const upsertSettings = useUpsertSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>();
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewUrl = localPreviewUrl ?? existingLogoUrl;
  const formValues = useMemo(() => toFormValues(settings), [settings]);

  const schema = useMemo(
    () =>
      createSettingsFormSchema({
        descriptionArRequired: t("validation.descriptionArRequired"),
        descriptionEnRequired: t("validation.descriptionEnRequired"),
        phoneRequired: t("validation.phoneRequired"),
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        taxAmountInvalid: t("validation.taxAmountInvalid"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    values: formValues,
  });

  useEffect(() => {
    setLogoFile(undefined);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return undefined;
    });
    setExistingLogoUrl(resolveMediaUrl(settings?.logo));
    setImageLoadFailed(false);
  }, [settings]);

  useEffect(() => {
    return () => {
      revokeIfBlob(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const isPending = upsertSettings.isPending;

  const handleSelectLogo = (file: File) => {
    setLogoFile(file);
    setImageLoadFailed(false);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveLogo = () => {
    setLogoFile(undefined);
    setImageLoadFailed(false);
    setLocalPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return undefined;
    });
    setExistingLogoUrl(undefined);
  };

  const onSubmit = handleSubmit((values) => {
    upsertSettings.mutate(
      { values, logo: logoFile },
      {
        onSuccess: (payload) => {
          toast.success(payload.message || t("toastSaved"));
          setLogoFile(undefined);
          setLocalPreviewUrl((prev) => {
            revokeIfBlob(prev);
            return undefined;
          });
        },
        onError: (err) => {
          toast.error(
            err instanceof Error && err.message ? err.message : t("errorToast"),
          );
        },
      },
    );
  });

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-dark-blue">
            {t("title")}
          </h1>
          <p className="text-sm text-brand-gris">{t("description")}</p>
        </header>
        <div className="flex flex-col items-start gap-3 rounded-[1.75rem] border border-black/5 bg-brand-white p-6">
          <p className="text-sm text-brand-gris">
            {error instanceof Error && error.message
              ? error.message
              : t("loadError")}
          </p>
          <Button
            type="button"
            onClick={() => void refetch()}
            className="h-10 rounded-full bg-brand-primary px-5 text-brand-white hover:bg-brand-primary/90"
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-dark-blue">{t("title")}</h1>
        <p className="text-sm text-brand-gris">{t("description")}</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-6 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6"
      >
        <Section title={t("sections.company")}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="descriptionAr"
              label={t("descriptionArLabel")}
              error={errors.descriptionAr?.message}
              required
            >
              <Textarea
                id="descriptionAr"
                dir="rtl"
                className={TEXTAREA_CLASS}
                placeholder={t("descriptionArPlaceholder")}
                disabled={isPending}
                {...register("descriptionAr")}
              />
            </Field>
            <Field
              id="descriptionEn"
              label={t("descriptionEnLabel")}
              error={errors.descriptionEn?.message}
              required
            >
              <Textarea
                id="descriptionEn"
                dir="ltr"
                className={TEXTAREA_CLASS}
                placeholder={t("descriptionEnPlaceholder")}
                disabled={isPending}
                {...register("descriptionEn")}
              />
            </Field>
          </div>
        </Section>

        <Section title={t("sections.contact")}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="phone"
              label={t("phoneLabel")}
              error={errors.phone?.message}
              required
            >
              <Input
                id="phone"
                dir="ltr"
                className={FIELD_CLASS}
                placeholder={t("phonePlaceholder")}
                disabled={isPending}
                {...register("phone")}
              />
            </Field>
            <Field
              id="email"
              label={t("emailLabel")}
              error={errors.email?.message}
              required
            >
              <Input
                id="email"
                dir="ltr"
                type="email"
                className={FIELD_CLASS}
                placeholder={t("emailPlaceholder")}
                disabled={isPending}
                {...register("email")}
              />
            </Field>
            <Field
              id="whatsapp"
              label={t("whatsappLabel")}
              error={errors.whatsapp?.message}
            >
              <Input
                id="whatsapp"
                dir="ltr"
                className={FIELD_CLASS}
                placeholder={t("whatsappPlaceholder")}
                disabled={isPending}
                {...register("whatsapp")}
              />
            </Field>
          </div>
        </Section>

        <Section title={t("sections.social")}>
          <div className="grid gap-5 md:grid-cols-2">
            {(
              [
                ["facebook", t("facebookLabel"), t("facebookPlaceholder")],
                ["twitter", t("twitterLabel"), t("twitterPlaceholder")],
                ["instagram", t("instagramLabel"), t("instagramPlaceholder")],
                ["linkedin", t("linkedinLabel"), t("linkedinPlaceholder")],
                ["youtube", t("youtubeLabel"), t("youtubePlaceholder")],
                ["tiktok", t("tiktokLabel"), t("tiktokPlaceholder")],
                ["snapchat", t("snapchatLabel"), t("snapchatPlaceholder")],
              ] as const
            ).map(([name, label, placeholder]) => (
              <Field
                key={name}
                id={name}
                label={label}
                error={errors[name]?.message}
              >
                <Input
                  id={name}
                  dir="ltr"
                  className={FIELD_CLASS}
                  placeholder={placeholder}
                  disabled={isPending}
                  {...register(name)}
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title={t("sections.business")}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="commercialRegister"
              label={t("commercialRegisterLabel")}
              error={errors.commercialRegister?.message}
            >
              <Input
                id="commercialRegister"
                dir="ltr"
                className={FIELD_CLASS}
                placeholder={t("commercialRegisterPlaceholder")}
                disabled={isPending}
                {...register("commercialRegister")}
              />
            </Field>
            <Field
              id="taxNumber"
              label={t("taxNumberLabel")}
              error={errors.taxNumber?.message}
            >
              <Input
                id="taxNumber"
                dir="ltr"
                className={FIELD_CLASS}
                placeholder={t("taxNumberPlaceholder")}
                disabled={isPending}
                {...register("taxNumber")}
              />
            </Field>
            <Field
              id="taxAmount"
              label={t("taxAmountLabel")}
              error={errors.taxAmount?.message}
            >
              <Input
                id="taxAmount"
                dir="ltr"
                className={FIELD_CLASS}
                placeholder={t("taxAmountPlaceholder")}
                disabled={isPending}
                {...register("taxAmount")}
              />
            </Field>
          </div>
        </Section>

        <Section title={t("sections.logo")}>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-brand-black">
              {t("logoLabel")}
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              disabled={isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleSelectLogo(file);
                event.target.value = "";
              }}
            />
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-black/10 bg-[#FBFBFB] p-4">
              {previewUrl && !imageLoadFailed ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={previewUrl}
                      src={previewUrl}
                      alt={t("logoPreviewAlt")}
                      className="mx-auto max-h-40 w-full object-contain"
                      onError={() => setImageLoadFailed(true)}
                      onLoad={() => setImageLoadFailed(false)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      aria-label={t("removeLogo")}
                      onClick={handleRemoveLogo}
                      className="absolute inset-e-2 top-2 size-8 rounded-full bg-brand-white/90 text-brand-gris hover:bg-brand-white hover:text-brand-black"
                    >
                      <X className="size-4" strokeWidth={2} />
                    </Button>
                  </div>
                  {logoFile ? (
                    <p
                      title={logoFile.name}
                      className="truncate text-xs text-brand-gris"
                    >
                      {logoFile.name}
                    </p>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 rounded-full border-black/10 text-brand-black"
                  >
                    {t("changeLogo")}
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 py-6 text-center disabled:opacity-50"
                >
                  <CustomIcon
                    src="/svg/upload.svg"
                    size={28}
                    className="text-brand-primary"
                  />
                  <span className="text-sm font-medium text-brand-black">
                    {imageLoadFailed
                      ? t("logoLoadError")
                      : t("logoUploadTitle")}
                  </span>
                  <span className="text-xs text-brand-gris">
                    {t("logoUploadHint")}
                  </span>
                </button>
              )}
            </div>
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => reset(formValues)}
            className="h-11 rounded-full border-black/10 px-5 text-brand-black"
          >
            {t("reset")}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="group relative h-11 gap-2 overflow-hidden rounded-full bg-brand-primary px-6 text-brand-white hover:bg-brand-primary/90"
          >
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              <>
                <span
                  className="confirm-chevron-start inline-flex items-center"
                  aria-hidden
                >
                  <ChevronsLeft
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                    strokeWidth={2.25}
                  />
                </span>
                <span className="tracking-wide">{t("save")}</span>
                <span
                  className="confirm-chevron-end inline-flex items-center"
                  aria-hidden
                >
                  <ChevronsRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                    strokeWidth={2.25}
                  />
                </span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-brand-dark-blue">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-brand-black">
        {label}
        {required ? (
          <>
            {" "}
            <span className="text-brand-accent" aria-hidden>
              *
            </span>
          </>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-brand-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8" aria-busy="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40 bg-brand-primary/15" />
        <Skeleton className="h-4 w-72 bg-brand-gris/15" />
      </div>
      <div className="flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-brand-white p-5 sm:p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
            <Skeleton className="h-11 w-full rounded-full bg-brand-gris/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
