"use client";

import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyableEmail } from "@/features/employees/components/copyable-email";
import { CopyableEmployeeNumber } from "@/features/employees/components/copyable-employee-number";
import EmployeeFormDialog from "@/features/employees/components/employee-form-dialog";
import EmployeeRoleBadge from "@/features/employees/components/employee-role-badge";
import EmployeeStatusBadge from "@/features/employees/components/employee-status-badge";
import { useEmployee } from "@/features/employees/queries/use-employees";
import {
  useActivateAdmin,
  useDeactivateAdmin,
} from "@/features/employees/queries/use-toggle-admin-status";
import type { EmployeeActivityStats } from "@/features/employees/types";
import { CopyablePhoneNumber } from "@/features/orders/components/copyable-phone-number";
import { formatApiDateTime } from "@/lib/format-datetime";
import { formatStatsCount } from "@/lib/format-stats";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ActivityCardKey = keyof EmployeeActivityStats;

/** RTL: first item renders on the right (matches design order). */
const ACTIVITY_CARDS: {
  key: ActivityCardKey;
  iconSrc: string;
  bgClassName: string;
}[] = [
  {
    key: "todayRequests",
    iconSrc: "/svg/transaction-minus.svg",
    bgClassName: "bg-brand-background",
  },
  {
    key: "thisWeek",
    iconSrc: "/svg/receipt-4.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    key: "totalCompleted",
    iconSrc: "/svg/receipt-2.svg",
    // Soft pink wash — no brand token for this pastel (same as list suspended card)
    bgClassName: "bg-brand-purple/5",
  },
];

type EmployeeDetailsViewProps = {
  employeeId: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

function formatCreatedDate(isoDate: string, locale: "ar" | "en"): string {
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

function formatLastLoginLabel(
  value: string,
  locale: "ar" | "en",
  todayLabel: string,
): string {
  const formatted = formatApiDateTime(value, locale);
  if (!formatted.isoDate) return "—";

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const separator = locale === "ar" ? "، " : ", ";

  if (formatted.isoDate === todayIso) {
    return `${todayLabel}${separator}${formatted.timeLabel}`;
  }

  return `${formatted.dateLabel}${separator}${formatted.timeLabel}`;
}

export default function EmployeeDetailsView({
  employeeId,
}: EmployeeDetailsViewProps) {
  const t = useTranslations("Employees.Details");
  const routeT = useTranslations("Employees.route");
  const locale = useLocale() === "en" ? "en" : "ar";
  const router = useRouter();
  const [isEditOpen, setEditOpen] = useState(false);
  const { data: employee, isPending, isError } = useEmployee(employeeId);

  const { mutate: deactivateAdmin, isPending: isDeactivating } =
    useDeactivateAdmin();
  const { mutate: activateAdmin, isPending: isActivating } = useActivateAdmin();

  const isTogglePending = isDeactivating || isActivating;

  const handleBack = () => {
    router.push("/employees");
  };

  const handleToggleStatus = () => {
    if (!employee || isTogglePending) return;

    if (employee.status === "suspended") {
      activateAdmin(employee.id, {
        onSuccess: (data) => {
          toast.success(data.message || routeT("activateSuccess"));
        },
        onError: (error) => {
          toast.error(error.message || routeT("unableToActivate"));
        },
      });
    } else {
      deactivateAdmin(employee.id, {
        onSuccess: (data) => {
          toast.success(data.message || routeT("deactivateSuccess"));
        },
        onError: (error) => {
          toast.error(error.message || routeT("unableToDeactivate"));
        },
      });
    }
  };

  if (isPending) {
    return <EmployeeDetailsSkeleton />;
  }

  if (isError || !employee) {
    notFound();
  }

  const isSuspended = employee.status === "suspended";

  const infoRows = [
    {
      id: "employeeNumber",
      label: t("info.employeeNumber"),
      value: (
        <CopyableEmployeeNumber
          employeeNumber={employee.employeeNumber}
          className="font-semibold text-brand-black"
        />
      ),
    },
    {
      id: "dailyTarget",
      label: t("info.dailyTarget"),
      value: (
        <span className="font-clash font-semibold" dir="ltr">
          {employee.dailyTarget}
        </span>
      ),
    },
    {
      id: "lastLogin",
      label: t("info.lastLogin"),
      value: formatLastLoginLabel(
        employee.lastLoginAtDateTime,
        locale,
        t("info.today"),
      ),
    },
    {
      id: "createdAt",
      label: t("info.createdAt"),
      value: formatCreatedDate(employee.createdAtIso, locale),
    },
  ] as const;

  return (
    <div className="flex min-w-0 flex-col p-4 pb-8">
      <article className="flex w-full flex-col">
        <header className="flex items-center justify-between gap-4 px-1 py-4 sm:px-0">
          <h1 className="text-base font-bold text-brand-black sm:text-lg">
            {t("title", { employeeNumber: employee.employeeNumber })}
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
            <Avatar className="size-24 border-4 border-brand-background sm:size-28">
              {employee.avatarUrl ? (
                <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              ) : null}
              <AvatarFallback className="bg-brand-primary/15 text-xl font-semibold text-brand-primary">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>

            <EmployeeStatusBadge status={employee.status} />

            <h2 className="text-xl font-bold text-brand-black sm:text-2xl">
              {employee.name}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <CopyablePhoneNumber
                phone={employee.phone}
                className="text-sm text-brand-gris"
              />
              <div className="inline-flex items-center gap-1.5 text-sm text-brand-gris">
                <Mail className="size-3.5 shrink-0" strokeWidth={1.75} />
                <CopyableEmail email={employee.email} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:items-start">
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
                <EmployeeRoleBadge role={employee.role} />
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
                    <span className="font-semibold text-brand-black">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex min-w-0 flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
                <CustomIcon
                  src="/svg/tag-2.svg"
                  size={20}
                  className="text-brand-dark-blue"
                />
                <span>{t("activity.title")}</span>
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ACTIVITY_CARDS.map((card, index) => (
                  <ActivityCard
                    key={card.key}
                    title={t(`activity.${card.key}`)}
                    value={formatStatsCount(employee.activity[card.key], false)}
                    iconSrc={card.iconSrc}
                    bgClassName={card.bgClassName}
                    className={index === 2 ? "sm:col-span-2" : undefined}
                  />
                ))}
              </div>
            </section>
          </div>

          <section className="flex flex-col gap-4 rounded-[1.75rem] bg-brand-background/80 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
              <CustomIcon
                src="/svg/receipt-edit.svg"
                size={20}
                className="text-brand-dark-blue"
              />
              <span>{t("permissions.title")}</span>
            </h3>

            <ul className="flex flex-col gap-3">
              {employee.permissions.map((permissionKey) => (
                <li
                  key={permissionKey}
                  className="flex items-center gap-3 text-sm font-medium text-brand-black"
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-success text-brand-white"
                    aria-hidden
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span>{t(`permissions.items.${permissionKey}`)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-black/5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => setEditOpen(true)}
              className="h-11 gap-2 rounded-full bg-brand-primary px-5 font-semibold text-brand-white hover:bg-brand-primary/90"
            >
              <CustomIcon
                src="/svg/edit-2.svg"
                size={18}
                className="text-brand-white"
              />
              <span>{t("edit")}</span>
            </Button>
            <Button
              type="button"
              disabled={isTogglePending}
              onClick={handleToggleStatus}
              className={cn(
                "h-11 gap-2 rounded-full px-5 font-semibold text-brand-white",
                isSuspended
                  ? "bg-brand-success hover:bg-brand-success/90"
                  : "bg-brand-error hover:bg-brand-error/90",
              )}
            >
              <CustomIcon
                src={isSuspended ? "/svg/person.svg" : "/svg/forbidden-2.svg"}
                size={18}
                className="text-brand-white"
              />
              <span>{isSuspended ? t("activate") : t("suspend")}</span>
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

      <EmployeeFormDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        employee={employee}
      />
    </div>
  );
}

function ActivityCard({
  title,
  value,
  iconSrc,
  bgClassName,
  className,
}: {
  title: string;
  value: string;
  iconSrc: string;
  bgClassName: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-[1.75rem] p-4 text-start",
        bgClassName,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 text-sm font-medium text-brand-black">
          {title}
        </h4>
        <CustomIcon
          src={iconSrc}
          size={20}
          className="shrink-0 text-brand-gris"
        />
      </div>
      <p className="font-clash text-3xl font-semibold tracking-tight text-brand-dark-blue">
        {value}
      </p>
    </article>
  );
}

function EmployeeDetailsSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col p-4 pb-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex w-full flex-col gap-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-brand-primary/15" />
          <Skeleton className="size-9 rounded-full bg-brand-gris/15" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-28 rounded-full bg-brand-primary/15" />
          <Skeleton className="h-7 w-24 rounded-xl bg-brand-success/20" />
          <Skeleton className="h-8 w-56 bg-brand-primary/15" />
          <Skeleton className="h-5 w-72 bg-brand-gris/15" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-40 bg-brand-primary/15" />
          <Skeleton className="h-7 w-24 rounded-xl bg-brand-primary/15" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl bg-brand-background" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                "h-28 rounded-[1.75rem] bg-brand-primary/10",
                index === 2 && "sm:col-span-2",
              )}
            />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-[1.75rem] bg-brand-background" />
      </div>
    </div>
  );
}
