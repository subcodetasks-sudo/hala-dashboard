"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import InfoCard from "@/components/info-card";
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

export default function IndicatorsSection() {
  const t = useTranslations("HomePage");

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {HOME_INDICATOR_META.map((indicator) => {
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
    </section>
  );
}
