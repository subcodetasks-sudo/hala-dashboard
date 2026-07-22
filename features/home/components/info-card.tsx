import { ArrowUpRight } from "lucide-react";

import CustomIcon from "@/components/custom-svg";
import { cn } from "@/lib/utils";

type InfoCardTone = "accent" | "primary";

type InfoCardProps = {
  title: string;
  value: string | number;
  iconSrc: string;
  change: string;
  period: string;
  tone?: InfoCardTone;
  className?: string;
};

const toneStyles: Record<InfoCardTone, string> = {
  accent: "bg-brand-accent/10",
  primary: "bg-brand-primary/10",
};

export default function InfoCard({
  title,
  value,
  iconSrc,
  change,
  period,
  tone = "primary",
  className,
}: InfoCardProps) {
  const isAccent = tone === "accent";

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-[2.25rem] p-5 text-start",
        toneStyles[tone],
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
          isAccent ? "text-brand-accent" : "text-brand-black"
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
