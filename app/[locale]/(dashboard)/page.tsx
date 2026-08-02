import { getTranslations } from "next-intl/server";

import { can } from "@/features/auth/lib/can";
import { getAuthAdmin } from "@/features/auth/lib/session";
import EmployeesSection from "@/features/home/components/employees-section";
import IndicatorsSection from "@/features/home/components/indicators-section";
import LatestOrdersSection, {
  ManualOrderButton,
} from "@/features/home/components/latest-orders-section";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const admin = await getAuthAdmin();
  const permissions = can(admin);

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-black md:text-3xl">
            {t("welcome", { name: admin?.name?.trim() || "" })}
          </h1>
          <p className="text-sm text-brand-gris">{t("welcomeSubtitle")}</p>
        </div>
        <ManualOrderButton />
      </div>

      <IndicatorsSection />

      {permissions.viewEmployees() ? <EmployeesSection /> : null}

      <LatestOrdersSection />
    </div>
  );
}
