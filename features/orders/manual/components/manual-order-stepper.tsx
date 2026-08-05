"use client";

import { useTranslations } from "next-intl";

import { MANUAL_ORDER_STEPS } from "@/features/orders/manual/types";
import { cn } from "@/lib/utils";

type ManualOrderStepperProps = {
  currentStepIndex: number;
  /** Furthest step the user has unlocked — later steps stay disabled. */
  furthestStepIndex: number;
  onStepSelect: (stepIndex: number) => void;
};

export default function ManualOrderStepper({
  currentStepIndex,
  furthestStepIndex,
  onStepSelect,
}: ManualOrderStepperProps) {
  const t = useTranslations("Orders.Manual");

  return (
    <div className="rounded-3xl p-0.5 bg-linear-to-l from-brand-primary/60 to-brand-primary/5">
    <ol className="flex items-start rounded-3xl bg-brand-background px-2 py-6 sm:px-6">
      {MANUAL_ORDER_STEPS.map((step, index) => {
        const isCurrent = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isReachable = index <= furthestStepIndex;

        return (
          <li
            key={step}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {index > 0 ? (
              <span
                aria-hidden
                className="absolute top-3.5 inset-e-1/2 flex w-full justify-center"
              >
                <span
                  className={cn(
                    "h-px w-[80%]",
                    isCompleted ? "bg-brand-primary/30" : "bg-brand-black/8"
                  )}
                />
              </span>
            ) : null}

            <button
              type="button"
              disabled={!isReachable}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onStepSelect(index)}
              className="relative z-10 flex flex-col items-center gap-2 rounded-xl px-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full transition-colors",
                  isCurrent
                    ? "border-2 border-brand-primary bg-brand-white"
                    : isCompleted
                      ? "bg-brand-primary"
                      : "border border-brand-primary/10 bg-brand-white shadow-xs"
                )}
              >
                {isCurrent ? (
                  <span className="size-3.5 rounded-full bg-brand-primary" />
                ) : null}
              </span>
              <span className="text-[11px] font-medium text-brand-gris">
                {t("stepLabel", { number: index + 1 })}
              </span>
              <span
                className={cn(
                  "text-xs font-bold sm:text-sm",
                  isCurrent
                    ? "text-brand-dark-blue"
                    : isCompleted
                      ? "text-brand-primary"
                      : "text-brand-gris"
                )}
              >
                {t(`steps.${step}`)}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
    </div>
  );
}
