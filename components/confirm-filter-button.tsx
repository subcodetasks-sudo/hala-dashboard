"use client";

import { WandSparkles } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmFilterButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "variant" | "size"
> & {
  label: string;
};

export default function ConfirmFilterButton({
  label,
  className,
  type = "button",
  ...props
}: ConfirmFilterButtonProps) {
  return (
    <Button
      type={type}
      className={cn(
        "h-11 gap-2 rounded-full border-none bg-brand-accent px-5 text-brand-white hover:bg-brand-accent/90",
        className
      )}
      {...props}
    >
      <WandSparkles className="size-4" strokeWidth={1.75} />
      <span>{label}</span>
    </Button>
  );
}
