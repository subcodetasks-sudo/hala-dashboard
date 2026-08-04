"use client";

import type { ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ReviewActionButton = {
  label: string;
  iconSrc: string;
  onClick: () => void;
  disabled?: boolean;
  /** Teal primary or bright blue secondary (matches design). */
  variant: "primary" | "secondary";
};

type ReviewActionsCardProps = {
  title: string;
  actions: ReviewActionButton[];
};

const VARIANT_CLASS: Record<ReviewActionButton["variant"], string> = {
  primary:
    "bg-brand-primary hover:bg-brand-primary/90 disabled:pointer-events-none disabled:opacity-40",
  secondary: "bg-brand-blue hover:bg-brand-blue/90",
};

/**
 * Shared “Review Actions” sidebar card used for processed /
 * sent_for_authentication (and any similar pill-button stage actions).
 */
export default function ReviewActionsCard({
  title,
  actions,
}: ReviewActionsCardProps) {
  return (
    <section className="rounded-[1.75rem] bg-[#F5F5F5] p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-black">
        <CustomIcon src="/svg/flash.svg" size={18} />
        <span>{title}</span>
      </h3>

      <div className="mt-3 flex flex-col gap-2.5">
        {actions.map((action) => (
          <ReviewActionPill key={action.label} action={action} />
        ))}
      </div>
    </section>
  );
}

function ReviewActionPill({ action }: { action: ReviewActionButton }): ReactNode {
  return (
    <Button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={cn(
        "h-12 gap-2 rounded-full border-none px-4 font-semibold text-brand-white shadow-sm",
        VARIANT_CLASS[action.variant]
      )}
    >
      <CustomIcon src={action.iconSrc} size={20} />
      {action.label}
    </Button>
  );
}
