import { getTranslations } from "next-intl/server";

import CustomIcon from "@/components/custom-svg";
import InfoCard from "@/components/info-card";
import EmployeesCard from "@/features/home/components/employees-card";
import LatestOrdersSection, {
  ManualOrderButton,
} from "@/features/home/components/latest-orders-section";
import {
  MOCK_EMPLOYEE_GROUPS,
  MOCK_INDICATORS,
} from "@/features/home/mock-data";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("welcome")}
          </h1>
          <p className="text-sm text-brand-gris">{t("welcomeSubtitle")}</p>
        </div>
        <ManualOrderButton />
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/receipt-item.svg"
            size={20}
            className="text-brand-primary"
          />
          <span>{t("sections.indicators")}</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {MOCK_INDICATORS.map((indicator) => (
            <InfoCard
              key={indicator.key}
              title={t(`indicators.${indicator.key}`)}
              value={indicator.value}
              change={indicator.change}
              period={t("period")}
              iconSrc={indicator.iconSrc}
              bgClassName={indicator.bgClassName}
              valueClassName={indicator.valueClassName}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <CustomIcon
            src="/svg/profile-2user.svg"
            size={22}
            className="text-brand-primary"
          />
          <span>{t("sections.employees")}</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MOCK_EMPLOYEE_GROUPS.map((group) => (
            <EmployeesCard
              key={group.key}
              title={t(`employees.${group.key}`)}
              count={group.count}
              avatars={group.avatars}
            />
          ))}
        </div>
      </section>

      <LatestOrdersSection />
    </div>
  );
}
