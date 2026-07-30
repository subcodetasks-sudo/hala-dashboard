"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { HoldReasonValue, OrderHoldInfo } from "@/features/orders/types";

type HoldReasonCardProps = {
  hold: OrderHoldInfo;
};

/** Hold reasons that have a translated label under `Orders.Pending.reasons`. */
const TRANSLATED_REASONS: HoldReasonValue[] = [
  "employer_data_incomplete",
  "worker_data_unclear",
  "missing_document",
  "unclear_document",
  "data_conflict",
  "other",
];

export default function HoldReasonCard({ hold }: HoldReasonCardProps) {
  const t = useTranslations("Orders.New.Review.hold");
  const reasons = useTranslations("Orders.Pending.reasons");

  const reasonLabel =
    hold.reason && TRANSLATED_REASONS.includes(hold.reason)
      ? reasons(hold.reason)
      : hold.reasonLabel;

  return (
    <section className="rounded-2xl border border-[#FDE3D3] bg-[#FFFBF0] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Hold reason & Warning icon (Left side of card in RTL flow: icon at far right of its group, text to its left) */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#FCD6B9] bg-[#FFEEDD] text-[#D97706]">
            <CustomIcon src="/svg/info-circle.svg" size={22} className="text-[#D97706]" />
          </div>
          <p className="text-sm font-medium text-brand-gris sm:text-base">
            {t("reasonLabel")}{" "}
            <span className="font-bold text-brand-black">{reasonLabel}</span>
          </p>
        </div>

        {/* Held Date & Employee info (Right side of card in RTL flow / Far left end of layout) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar size="default" className="size-9 border border-white shadow-xs">
              {hold.heldByAvatarUrl ? (
                <AvatarImage src={hold.heldByAvatarUrl} alt={hold.heldByName} />
              ) : null}
              <AvatarFallback className="bg-brand-dark-blue/10 text-xs font-bold text-brand-dark-blue">
                {hold.heldByInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-bold text-brand-black">
              {hold.heldByName}
            </span>
          </div>

          <span className="inline-block size-1.5 rounded-full bg-black/15" aria-hidden />

          <div className="flex flex-col text-start">
            <span className="text-xs font-bold text-brand-black">
              {hold.heldAtDateLabel}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-brand-gris">
              {hold.relativeTimeLabel ? (
                <>
                  <span>{hold.relativeTimeLabel}</span>
                  <span className="inline-block size-1 rounded-full bg-black/20" />
                </>
              ) : null}
              {hold.heldAtTimeLabel ? (
                <span dir="ltr">{hold.heldAtTimeLabel}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {hold.notes ? (
        <div className="mt-4 pt-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-gris">
            <CustomIcon
              src="/svg/receipt-2.svg"
              size={18}
              className="shrink-0 text-brand-gris"
            />
            <span>{t("notesLabel")}:</span>
          </div>
          <p className="text-sm leading-relaxed font-bold text-[#0F3B4C]">
            {hold.notes}
          </p>
        </div>
      ) : null}
    </section>
  );
}

