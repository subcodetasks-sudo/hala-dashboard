"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type EmployeeActionsProps = {
  employeeId: string;
};

const ITEM_BASE_CLASS =
  "cursor-pointer gap-3 rounded-2xl border-none px-3.5 py-3.5 text-sm font-bold";

function ActionItemContent({
  icon,
  label,
  toneClassName,
}: {
  icon: ReactNode;
  label: string;
  toneClassName: string;
}) {
  return (
    <span className={cn("flex w-full items-center gap-3", toneClassName)}>
      <span className="flex size-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-start">{label}</span>
      <ChevronLeft
        className="size-4 shrink-0 ltr:rotate-180"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function EmployeeActions({ employeeId }: EmployeeActionsProps) {
  const t = useTranslations("Employees.table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          aria-label={t("action")}
          className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90 data-[state=open]:bg-brand-accent data-[state=open]:hover:bg-brand-accent"
        >
          <MoreVertical className="size-4" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-auto min-w-72 rounded-4xl border-none bg-white p-3",
          "shadow-[0_8px_28px_rgba(0,49,66,0.12)] ring-0",
        )}
      >
        <div className="flex flex-col gap-2">
          <DropdownMenuItem
            className={cn(
              ITEM_BASE_CLASS,
              "bg-brand-primary/8 text-brand-dark-blue focus:bg-brand-primary/15 data-highlighted:bg-brand-primary/15 focus:text-brand-dark-blue data-highlighted:text-brand-dark-blue",
            )}
            asChild
          >
            <Link href={`/employees/${employeeId}`}>
              <ActionItemContent
                toneClassName="text-brand-dark-blue"
                icon={
                  <CustomIcon
                    src="/svg/eye.svg"
                    size={20}
                    className="text-brand-dark-blue"
                  />
                }
                label={t("viewDetails")}
              />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(
              ITEM_BASE_CLASS,
              "bg-brand-success-light text-brand-success focus:bg-brand-success/15 data-highlighted:bg-brand-success/15 focus:text-brand-success data-highlighted:text-brand-success",
            )}
            onSelect={() => {
              void employeeId;
            }}
          >
            <ActionItemContent
              toneClassName="text-brand-success"
              icon={
                <CustomIcon
                  src="/svg/edit-2.svg"
                  size={20}
                  className="text-brand-success"
                />
              }
              label={t("edit")}
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(
              ITEM_BASE_CLASS,
              "bg-brand-accent/10 text-brand-accent focus:bg-brand-accent/15 data-highlighted:bg-brand-accent/15 focus:text-brand-accent data-highlighted:text-brand-accent",
            )}
            onSelect={() => {
              void employeeId;
            }}
          >
            <ActionItemContent
              toneClassName="text-brand-accent"
              icon={
                <CustomIcon
                  src="/svg/forbidden-2.svg"
                  size={20}
                  className="text-brand-accent"
                />
              }
              label={t("suspend")}
            />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
