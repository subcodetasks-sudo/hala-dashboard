"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type CompletedOrderActionsProps = {
  orderId: string;
};

export default function CompletedOrderActions({
  orderId,
}: CompletedOrderActionsProps) {
  const t = useTranslations("Orders.Completed.table");

  return (
    <Button
      type="button"
      asChild
      aria-label={t("viewDetails")}
      className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90"
    >
      <Link href={`/orders/${orderId}`}>
        <Eye className="size-4" strokeWidth={1.75} />
      </Link>
    </Button>
  );
}
