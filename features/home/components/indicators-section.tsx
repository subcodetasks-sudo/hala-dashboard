"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import InfoCard from "@/components/info-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCan } from "@/features/auth/lib/use-can";
import { HOME_INDICATOR_META } from "@/features/home/indicator-meta";
import type { HomeIndicatorKey } from "@/features/home/types";
import {
  useRenewalRequestAuthenticationSentStats,
  useRenewalRequestCancelledStats,
  useRenewalRequestCompletedStats,
  useRenewalRequestPaymentStats,
  useRenewalRequestProcessedStats,
  useRenewalRequestRefundStats,
} from "@/features/orders/queries";
import {
  formatChangePercent,
  formatStatsCount,
} from "@/features/orders/utils";

function IndicatorCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-[2.25rem] bg-brand-primary/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24 bg-brand-gris/20" />
        <Skeleton className="size-5 shrink-0 rounded-md bg-brand-gris/15" />
      </div>
      <Skeleton className="h-9 w-16 bg-brand-primary/20" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-12 bg-brand-success/25" />
        <Skeleton className="h-3 w-20 bg-brand-gris/15" />
      </div>
    </div>
  );
}

function IndicatorsSectionSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <IndicatorCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function IndicatorsSection() {
  const t = useTranslations("HomePage");
  const permissions = useCan();

  const processed = useRenewalRequestProcessedStats();
  const authenticationSent = useRenewalRequestAuthenticationSentStats();
  const payment = useRenewalRequestPaymentStats();
  const completed = useRenewalRequestCompletedStats();
  const cancelled = useRenewalRequestCancelledStats();
  const refund = useRenewalRequestRefundStats();

  const byKey: Record<
    HomeIndicatorKey,
    { value: string; change: string }
  > = {
    processing: {
      value: formatStatsCount(
        processed.processedRequestsCount,
        processed.isLoading,
      ),
      change: processed.weeklyPercentage,
    },
    verification: {
      value: formatStatsCount(
        authenticationSent.totalSentForAuthentication,
        authenticationSent.isLoading,
      ),
      change: formatChangePercent(
        authenticationSent.changePercent,
        authenticationSent.isLoading,
      ),
    },
    payment: {
      value: formatStatsCount(payment.awaitingPayment, payment.isLoading),
      change: formatChangePercent(undefined, payment.isLoading),
    },
    completed: {
      value: formatStatsCount(completed.totalCompleted, completed.isLoading),
      change: formatChangePercent(undefined, completed.isLoading),
    },
    cancelled: {
      value: formatStatsCount(cancelled.totalCancelled, cancelled.isLoading),
      change: formatChangePercent(undefined, cancelled.isLoading),
    },
    refund: {
      value: formatStatsCount(refund.totalRefundRequests, refund.isLoading),
      change: formatChangePercent(undefined, refund.isLoading),
    },
  };

  const visibleIndicators = permissions.homeIndicators(HOME_INDICATOR_META);
  const isCompactGrid = permissions.isContractOfficer();

  if (!permissions.isPending && !permissions.viewIndicatorsSection()) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
        <CustomIcon
          src="/svg/receipt-item.svg"
          size={20}
          className="text-brand-primary"
        />
        <span>{t("sections.indicators")}</span>
      </h2>
      {permissions.isPending ? (
        <IndicatorsSectionSkeleton count={HOME_INDICATOR_META.length} />
      ) : (
        <div
          className={
            isCompactGrid
              ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
          }
        >
          {visibleIndicators.map((indicator) => {
            const stats = byKey[indicator.key];

            return (
              <InfoCard
                key={indicator.key}
                title={t(`indicators.${indicator.key}`)}
                value={stats.value}
                change={stats.change}
                period={t("period")}
                iconSrc={indicator.iconSrc}
                bgClassName={indicator.bgClassName}
                valueClassName={indicator.valueClassName}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
