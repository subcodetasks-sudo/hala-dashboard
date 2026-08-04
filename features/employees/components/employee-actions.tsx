"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmployeeFormDialog from "@/features/employees/components/employee-form-dialog";
import {
  useActivateAdmin,
  useDeactivateAdmin,
} from "@/features/employees/queries/use-toggle-admin-status";
import type { EmployeeRow } from "@/features/employees/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type EmployeeActionsProps = {
  employee: EmployeeRow;
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

export default function EmployeeActions({ employee }: EmployeeActionsProps) {
  const t = useTranslations("Employees.table");
  const routeT = useTranslations("Employees.route");
  const [isEditOpen, setEditOpen] = useState(false);

  const { mutate: deactivateAdmin, isPending: isDeactivating } =
    useDeactivateAdmin();
  const { mutate: activateAdmin, isPending: isActivating } = useActivateAdmin();

  const isPending = isDeactivating || isActivating;
  const isSuspended = employee.status === "suspended";

  const handleToggleStatus = () => {
    if (isPending) return;

    if (isSuspended) {
      activateAdmin(employee.id, {
        onSuccess: (data) => {
          toast.success(data.message || routeT("activateSuccess"));
        },
        onError: (error) => {
          toast.error(error.message || routeT("unableToActivate"));
        },
      });
    } else {
      deactivateAdmin(employee.id, {
        onSuccess: (data) => {
          toast.success(data.message || routeT("deactivateSuccess"));
        },
        onError: (error) => {
          toast.error(error.message || routeT("unableToDeactivate"));
        },
      });
    }
  };

  return (
    <>
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
              <Link href={`/employees/${employee.id}`}>
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
                setEditOpen(true);
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
              disabled={isPending}
              className={cn(
                ITEM_BASE_CLASS,
                isSuspended
                  ? "bg-brand-success-light text-brand-success focus:bg-brand-success/15 data-highlighted:bg-brand-success/15 focus:text-brand-success data-highlighted:text-brand-success"
                  : "bg-brand-accent/10 text-brand-accent focus:bg-brand-accent/15 data-highlighted:bg-brand-accent/15 focus:text-brand-accent data-highlighted:text-brand-accent",
              )}
              onSelect={handleToggleStatus}
            >
              <ActionItemContent
                toneClassName={
                  isSuspended ? "text-brand-success" : "text-brand-accent"
                }
                icon={
                  <CustomIcon
                    src={
                      isSuspended ? "/svg/person.svg" : "/svg/forbidden-2.svg"
                    }
                    size={20}
                    className={
                      isSuspended ? "text-brand-success" : "text-brand-accent"
                    }
                  />
                }
                label={isSuspended ? t("activate") : t("suspend")}
              />
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmployeeFormDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        employee={employee}
      />
    </>
  );
}
