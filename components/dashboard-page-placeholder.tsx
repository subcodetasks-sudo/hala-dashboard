import { getTranslations } from "next-intl/server";

type DashboardPagePlaceholderProps = {
  /** Key under Dashboard.Sidebar.links */
  titleKey: string;
};

export default async function DashboardPagePlaceholder({
  titleKey,
}: DashboardPagePlaceholderProps) {
  const t = await getTranslations("Dashboard.Sidebar.links");

  return (
    <div className="mt-6 space-y-4">
      <h1 className="text-2xl font-semibold text-brand-black">
        {t(titleKey)}
      </h1>
    </div>
  );
}
