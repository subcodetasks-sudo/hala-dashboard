"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Employee } from "@/features/profile/types";
import { useSetProfile } from "@/features/profile/queries/use-profile";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type LoginFormValues = {
  idNumber: string;
  password: string;
  rememberMe: boolean;
};

type LoginSuccessResponse = {
  success: true;
  message: string;
  data: {
    admin: Employee;
  };
};

type LoginErrorResponse = {
  success?: false;
  message?: string;
};

export default function LoginForm() {
  const t = useTranslations("Auth.Login");
  const locale = useLocale();
  const router = useRouter();
  const setProfile = useSetProfile();
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(
    () =>
      z.object({
        idNumber: z
          .string()
          .trim()
          .min(1, t("validation.idNumberRequired"))
          .regex(/^[12]\d{9}$/, t("validation.idNumberFormat")),
        password: z
          .string()
          .min(1, t("validation.passwordRequired"))
          .min(6, t("validation.passwordMin")),
        rememberMe: z.boolean(),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      idNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idNumber: values.idNumber,
          password: values.password,
          rememberMe: values.rememberMe,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | LoginSuccessResponse
        | LoginErrorResponse
        | null;

      if (!response.ok || !payload || !("success" in payload) || !payload.success) {
        const message =
          payload && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : t("errorToast");

        toast.error(message);
        return;
      }

      setProfile(payload.data.admin);

      const adminName =
        payload.data.admin.name?.trim() || t("fallbackEmployeeName");

      toast.success(t("welcomeToast", { name: adminName }));
      router.replace("/");
      router.refresh();
    } catch {
      toast.error(t("errorToast"));
    }
  }

  return (
    <Card className="w-full overflow-hidden rounded-[1.75rem] border border-brand-primary/10 bg-brand-white p-0 shadow-2xl shadow-brand-primary/15 ring-0">
      <div className="flex items-center justify-center bg-brand-white px-8 pt-10 pb-2">
        <Image
          src="/logo.png"
          alt={t("brand")}
          width={220}
          height={56}
          priority
          className="h-12 w-auto object-contain sm:h-14"
          draggable={false}
        />
      </div>

      <CardContent className="flex flex-col gap-7 px-6 py-8 sm:px-9 sm:py-9">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-brand-dark-blue sm:text-2xl">
            {t("title")}
          </h1>
          <p className="text-sm text-brand-gris">{t("subtitle")}</p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-5">
            <Field data-invalid={!!errors.idNumber}>
              <FieldLabel
                htmlFor="idNumber"
                className="text-sm font-medium text-brand-black"
              >
                {t("idNumber.label")}
                <span className="text-brand-accent">*</span>
              </FieldLabel>
              <Input
                id="idNumber"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                placeholder={t("idNumber.placeholder")}
                aria-invalid={!!errors.idNumber}
                disabled={isSubmitting}
                className="h-12 rounded-xl border-brand-primary/15 bg-brand-background/60 px-3.5 text-base text-brand-black shadow-none placeholder:text-brand-gris/70 focus-visible:border-brand-primary/50 focus-visible:bg-brand-white focus-visible:ring-brand-primary/20"
                {...register("idNumber")}
              />
              <FieldError errors={[errors.idNumber]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel
                htmlFor="password"
                className="text-sm font-medium text-brand-black"
              >
                {t("password.label")}
                <span className="text-brand-accent">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("password.placeholder")}
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                  className="h-12 rounded-xl border-brand-primary/15 bg-brand-background/60 px-3.5 pe-11 text-base text-brand-black shadow-none placeholder:text-brand-gris/70 focus-visible:border-brand-primary/50 focus-visible:bg-brand-white focus-visible:ring-brand-primary/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-brand-gris transition-colors hover:text-brand-primary disabled:pointer-events-none disabled:opacity-50"
                  aria-label={
                    showPassword ? t("password.hide") : t("password.show")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-2xl border-none bg-brand-primary text-base font-semibold text-brand-white shadow-sm transition-all hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/25 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-5 text-brand-white" />
                <span>{t("submitting")}</span>
              </span>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
