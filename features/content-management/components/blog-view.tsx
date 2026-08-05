"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import BlogsSection from "@/features/content-management/components/blogs-section";
import { useRouter } from "@/i18n/navigation";

export default function BlogView() {
  const t = useTranslations("ContentManagement.blog");
  const locale = useLocale();
  const router = useRouter();

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

      <BlogsSection />
    </div>
  );
}
