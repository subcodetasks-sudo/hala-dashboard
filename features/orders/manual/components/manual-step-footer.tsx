"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ManualStepFooterProps = {
  /** Omit on the first step to hide the back control. */
  onBack?: () => void;
  nextLabel?: string;
};

export default function ManualStepFooter({
  onBack,
  nextLabel,
}: ManualStepFooterProps) {
  const t = useTranslations("Orders.Manual");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        onBack ? "justify-between" : "justify-end"
      )}
    >
      {onBack ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-12 gap-2 rounded-full bg-brand-background border-brand-black/10 px-6 font-semibold text-brand-gris hover:bg-brand-gris/10 hover:text-brand-gris"
        >
          <ChevronRight className="size-4 ltr:rotate-180" strokeWidth={2.25} />
          <span>{t("back")}</span>
        </Button>
      ) : null}

      <Button
        type="submit"
        className="group h-12 gap-2 rounded-full border-none bg-brand-primary px-6 font-semibold text-brand-white transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-md hover:shadow-brand-primary/20 active:scale-[0.98]"
      >
        <span>{nextLabel ?? t("next")}</span>
        <ArrowLeft
          className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
          strokeWidth={2.25}
        />
      </Button>
    </div>
  );
}
