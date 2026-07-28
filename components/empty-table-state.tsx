import CustomIcon from "@/components/custom-svg";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type EmptyTableStateProps = {
  iconSrc: string;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
};

export default function EmptyTableState({
  iconSrc,
  title,
  description,
  className,
  iconClassName,
}: EmptyTableStateProps) {
  return (
    <Empty className={cn("border-none p-0", className)}>
      <EmptyHeader className="max-w-md gap-3">
        <EmptyMedia
          variant="icon"
          className={cn(
            "mb-1 size-16 rounded-2xl bg-brand-primary/5 text-brand-primary [&_svg:not([class*='size-'])]:size-8",
            iconClassName
          )}
        >
          <CustomIcon src={iconSrc} size={32} className="text-brand-primary" />
        </EmptyMedia>
        <EmptyTitle className="text-base font-bold text-brand-black">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-sm text-brand-gris">
          {description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
