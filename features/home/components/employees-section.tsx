"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmins } from "@/features/employees/queries/use-admins";
import { useRoles } from "@/features/employees/queries/use-roles";
import {
  emptyEmployeeRoleGroups,
  groupAdminsByHomeRoles,
} from "@/features/employees/utils/group-admins-by-role";
import EmployeesCard from "@/features/home/components/employees-card";

function EmployeesSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-44 rounded-[2.25rem] bg-brand-background"
        />
      ))}
    </div>
  );
}

export default function EmployeesSection() {
  const t = useTranslations("HomePage");
  const { data, isLoading, isError } = useAdmins({
    perPage: 100,
    sort: "-created_at",
  });
  const admins = data?.items ?? [];
  const { data: roles = [], isLoading: areRolesLoading } = useRoles();
  const isEmployeesLoading = isLoading || areRolesLoading;

  const groups =
    isEmployeesLoading || isError
      ? emptyEmployeeRoleGroups()
      : groupAdminsByHomeRoles(admins, roles);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
        <CustomIcon
          src="/svg/profile-2user.svg"
          size={22}
          className="text-brand-primary"
        />
        <span>{t("sections.employees")}</span>
      </h2>

      {isEmployeesLoading ? (
        <EmployeesSectionSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <EmployeesCard
              key={group.key}
              title={t(`employees.${group.key}`)}
              count={String(group.count).padStart(2, "0")}
              avatars={group.avatars}
            />
          ))}
        </div>
      )}
    </section>
  );
}
