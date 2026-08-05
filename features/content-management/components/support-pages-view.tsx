"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InquiryTypesSection from "@/features/content-management/components/inquiry-types-section";
import SupportCardsSection from "@/features/content-management/components/support-cards-section";
import SupportFormHeaderPanel from "@/features/content-management/components/support-form-header-panel";
import SupportHeaderPanel from "@/features/content-management/components/support-header-panel";
import SupportSubmissionsSection from "@/features/content-management/components/support-submissions-section";
import type { SupportTabId } from "@/features/content-management/types";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SUPPORT_TABS = [
  { id: "header" as const, iconSrc: "/svg/document-text.svg" },
  { id: "cards" as const, iconSrc: "/svg/clipboard.svg" },
  { id: "inquiryType" as const, iconSrc: "/svg/tag-2.svg" },
  { id: "submissions" as const, iconSrc: "/svg/directbox-notif.svg" },
] as const;

const TAB_TRIGGER_CLASS =
  "h-12 min-w-[140px] flex-1 gap-2 border border-black/10 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-primary data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

function tabRoundedClass(index: number, total: number): string {
  if (index === 0) return "rounded-s-full! rounded-e-xl!";
  if (index === total - 1) return "rounded-e-full! rounded-s-xl!";
  return "rounded-none!";
}

export default function SupportPagesView() {
  const t = useTranslations("ContentManagement.support");
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SupportTabId>("header");

  const handleBack = () => {
    router.push("/content-management");
  };

  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("back")}
            onClick={handleBack}
            className="size-9 shrink-0 rounded-full bg-brand-gris/10 text-brand-gris hover:bg-brand-gris/15 hover:text-brand-black"
          >
            {locale === "en" ? (
              <ArrowLeft className="size-4" strokeWidth={2} />
            ) : (
              <ArrowRight className="size-4" strokeWidth={2} />
            )}
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-brand-dark-blue">
              {t("title")}
            </h1>
            <p className="text-sm text-brand-gris">{t("description")}</p>
          </div>
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SupportTabId)}
        className="flex min-w-0 flex-col gap-6"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
          {SUPPORT_TABS.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                TAB_TRIGGER_CLASS,
                tabRoundedClass(index, SUPPORT_TABS.length),
              )}
            >
              <CustomIcon
                src={tab.iconSrc}
                size={18}
                className="shrink-0 text-current"
              />
              <span>{t(`tabs.${tab.id}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="header" className="mt-0">
          <div className="flex flex-col gap-6">
            <SupportHeaderPanel />
            <SupportFormHeaderPanel />
          </div>
        </TabsContent>
        <TabsContent value="cards" className="mt-0">
          <SupportCardsSection />
        </TabsContent>
        <TabsContent value="inquiryType" className="mt-0">
          <InquiryTypesSection />
        </TabsContent>
        <TabsContent value="submissions" className="mt-0">
          <SupportSubmissionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
