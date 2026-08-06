"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ClearFilterButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "variant" | "size"
>;

export default function ClearFilterButton({
  className,
  type = "button",
  ...props
}: ClearFilterButtonProps) {
  const t = useTranslations("Common.Filters");

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type={type}
            variant="outline"
            aria-label={t("clearFilter")}
            className={cn(
              "size-11 shrink-0 rounded-full border-brand-accent bg-brand-accent/10 p-0 text-brand-accent hover:bg-brand-accent/15 hover:text-brand-accent",
              className
            )}
            {...props}
          >
            <CustomIcon
              src="/svg/trash.svg"
              size={18}
              className="text-brand-accent"
              aria-hidden
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <p>{t("clearFilterTooltip")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
