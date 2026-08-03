"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import type { OrderCancellationInfo } from "@/features/orders/types";

type CancellationReasonCardProps = {
  cancellation: OrderCancellationInfo;
};

export default function CancellationReasonCard({
  cancellation,
}: CancellationReasonCardProps) {
  const t = useTranslations("Orders.New.Review.cancellation");

  return (
    <section className="rounded-2xl border border-brand-accent/25 bg-brand-accent/5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent">
            <CustomIcon
              src="/svg/forbidden-2.svg"
              size={22}
              className="text-brand-accent"
            />
          </div>
          <p className="text-sm font-medium text-brand-gris sm:text-base">
            {t("reasonLabel")}{" "}
            <span className="font-bold text-brand-black">
              {cancellation.reasonLabel}
            </span>
          </p>
        </div>

        <div className="flex flex-col text-start sm:text-end">
          <span className="text-xs font-bold text-brand-black">
            {cancellation.cancelledAtDateLabel}
          </span>
          {cancellation.cancelledAtTimeLabel ? (
            <span
              className="mt-0.5 text-[0.7rem] text-brand-gris"
              dir="ltr"
            >
              {cancellation.cancelledAtTimeLabel}
            </span>
          ) : null}
        </div>
      </div>

      {cancellation.notes ? (
        <div className="mt-4 space-y-2 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-gris">
            <CustomIcon
              src="/svg/receipt-2.svg"
              size={18}
              className="shrink-0 text-brand-gris"
            />
            <span>{t("notesLabel")}:</span>
          </div>
          <p className="text-sm leading-relaxed font-bold text-brand-dark-blue">
            {cancellation.notes}
          </p>
        </div>
      ) : null}
    </section>
  );
}
