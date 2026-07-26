import { ArrowUpRight } from "lucide-react";

import CustomIcon from "@/components/custom-svg";
import { cn } from "@/lib/utils";

type InfoCardProps = {
  title: string;
  value: string | number;
  iconSrc: string;
  change: string;
  period: string;
  /** Background color class, e.g. `bg-brand-primary/10` */
  bgClassName?: string;
  /** Value text color class, e.g. `text-brand-accent` */
  valueClassName?: string;
  className?: string;
};

export default function InfoCard({
  title,
  value,
  iconSrc,
  change,
  period,
  bgClassName = "bg-brand-primary/10",
  valueClassName = "text-brand-black",
  className,
}: InfoCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-[2.25rem] p-5 text-start",
        bgClassName,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-sm font-medium leading-snug text-brand-black">
          {title}
        </h3>
        <CustomIcon
          src={iconSrc}
          size={22}
          className="mt-0.5 shrink-0 text-brand-gris"
        />
      </div>

      <p
        className={cn(
          "text-3xl font-bold tracking-tight",
          valueClassName
        )}
      >
        {value}
      </p>

      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-0.5 font-semibold text-brand-success">
          {change}
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
        </span>
        <span className="text-brand-gris">{period}</span>
      </div>
    </article>
  );
}
