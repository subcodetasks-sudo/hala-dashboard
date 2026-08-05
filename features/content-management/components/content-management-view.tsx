"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Link } from "@/i18n/navigation";
import type { ContentSectionId } from "@/features/content-management/types";
import { cn } from "@/lib/utils";

type SectionCardConfig = {
  id: ContentSectionId;
  href: string | null;
  iconSrc: string;
  bgClassName: string;
};

/** RTL: first card renders on the right (matches design order). */
const SECTIONS: SectionCardConfig[] = [
  {
    id: "hero",
    href: "/content-management/hero",
    iconSrc: "/svg/home.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    id: "statistics",
    href: "/content-management/statistics",
    iconSrc: "/svg/chart.svg",
    bgClassName: "bg-brand-background",
  },
  {
    id: "services",
    href: "/content-management/services",
    iconSrc: "/svg/box-add.svg",
    bgClassName: "bg-brand-light-yellow",
  },
  {
    id: "workSteps",
    href: "/content-management/work-steps",
    iconSrc: "/svg/routing-2.svg",
    bgClassName: "bg-brand-success-light",
  },
  {
    id: "faqs",
    href: "/content-management/faqs",
    iconSrc: "/svg/info-circle.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    id: "blog",
    href: "/content-management/blog",
    iconSrc: "/svg/firstline.svg",
    bgClassName: "bg-brand-background",
  },
  {
    id: "legal",
    href: "/content-management/legal",
    iconSrc: "/svg/lamp-charge.svg",
    bgClassName: "bg-brand-background",
  },
  {
    id: "support",
    href: "/content-management/support",
    iconSrc: "/svg/phone.svg",
    bgClassName: "bg-brand-light-yellow",
  },
];

export default function ContentManagementView() {
  const t = useTranslations("ContentManagement");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="flex min-w-0 flex-col gap-8 p-4 pb-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-brand-dark-blue">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-gris">
          {t("description")}
        </p>
      </header>

      <section
        aria-label={t("sectionsLabel")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {SECTIONS.map((section) => {
          const title = t(`sections.${section.id}.title`);
          const description = t(`sections.${section.id}.description`);
          const isAvailable = Boolean(section.href);

          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand-white/70">
                  <CustomIcon
                    src={section.iconSrc}
                    size={22}
                    className="text-brand-dark-blue"
                  />
                </span>
                {isAvailable ? (
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-white/80 text-brand-primary">
                    {isRtl ? (
                      <ChevronLeft className="size-4" strokeWidth={2} />
                    ) : (
                      <ChevronRight className="size-4" strokeWidth={2} />
                    )}
                  </span>
                ) : (
                  <span className="rounded-full bg-brand-white/70 px-2.5 py-1 text-[11px] font-medium text-brand-gris">
                    {t("comingSoon")}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-base font-bold text-brand-black">{title}</h2>
                <p className="text-sm leading-relaxed text-brand-gris">
                  {description}
                </p>
              </div>
            </>
          );

          const cardClassName = cn(
            "flex flex-col gap-5 rounded-[1.75rem] p-5 text-start transition-shadow",
            section.bgClassName,
            isAvailable &&
              "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
            !isAvailable && "cursor-not-allowed opacity-70",
          );

          if (section.href) {
            return (
              <Link
                key={section.id}
                href={section.href}
                className={cardClassName}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={section.id}
              className={cardClassName}
              aria-disabled="true"
            >
              {content}
            </div>
          );
        })}
      </section>
    </div>
  );
}
