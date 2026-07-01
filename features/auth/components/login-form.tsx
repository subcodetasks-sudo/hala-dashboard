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
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginForm() {
  const t = useTranslations("Auth.Login");
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
        password: z
          .string()
          .min(1, t("validation.passwordRequired"))
          .min(8, t("validation.passwordMin")),
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
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: LoginFormValues) {
    void values;
  }

  return (
    <Card className="w-full max-w-lg rounded-2xl border-0 bg-white px-2 py-8 shadow-xl ring-0">
      <CardContent className="flex flex-col gap-8 px-6 sm:px-8">
        <div className="flex flex-col items-center gap-3 text-center">

          <span className="text-3xl" aria-hidden>
            👋
          </span>
          <h1 className="text-xl font-semibold text-foreground">
            {t("title")}
          </h1>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-5">
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                {t("email.label")}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t("email.placeholder")}
                aria-invalid={!!errors.email}
                className="h-11 rounded-xl border-[#E5E7EB] bg-white px-3 text-base shadow-none"
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password" className="text-sm font-medium">
                {t("password.label")}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("password.placeholder")}
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-white px-3 pe-11 text-base shadow-none"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showPassword
                      ? t("password.hide")
                      : t("password.show")
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

          <div className="flex items-center justify-between gap-4">


            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <Checkbox
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 "
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  {t("rememberMe")}
                </label>
              )}
            />

<Link
              href="/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-blue-600 px-4 pe-2 text-base font-medium text-white hover:bg-blue-500"
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span>{t("submit")}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white">
                <ArrowUpLeft className="size-4 text-blue-600" />
              </span>
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
