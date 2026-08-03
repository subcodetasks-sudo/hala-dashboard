"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function ManualOrderButton() {
  const t = useTranslations("Dashboard.Sidebar.links");

  return (
    <Button
      asChild
      variant="outline"
      className="h-11 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 text-brand-white hover:bg-brand-gris/80 hover:text-brand-white"
    >
      <Link href="/orders/manual">
        <Plus className="size-4" strokeWidth={2} />
        <span>{t("manualOrder")}</span>
      </Link>
    </Button>
  );
}
