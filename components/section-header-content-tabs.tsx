"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import CustomIcon from "@/components/custom-svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TAB_TRIGGER_CLASS =
  "h-12 min-w-[140px] flex-1 gap-2 border border-black/10 bg-[#F5F5F5] px-4 text-sm font-semibold text-brand-black shadow-none data-active:border-transparent data-active:bg-brand-primary data-active:text-brand-white data-active:shadow-none data-active:hover:text-brand-white";

export type SectionTabId = "header" | "content";

type SectionHeaderContentTabsProps = {
  headerLabel: string;
  contentLabel: string;
  header: ReactNode;
  content: ReactNode;
  defaultValue?: SectionTabId;
  className?: string;
};

export default function SectionHeaderContentTabs({
  headerLabel,
  contentLabel,
  header,
  content,
  defaultValue = "header",
  className,
}: SectionHeaderContentTabsProps) {
  const [activeTab, setActiveTab] = useState<SectionTabId>(defaultValue);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as SectionTabId)}
      className={cn("flex min-w-0 flex-col gap-6", className)}
    >
      <TabsList className="flex h-auto w-full flex-wrap gap-3 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto!">
        <TabsTrigger
          value="header"
          className={cn(TAB_TRIGGER_CLASS, "rounded-s-full! rounded-e-xl!")}
        >
          <CustomIcon
            src="/svg/document-text.svg"
            size={18}
            className="shrink-0 text-current"
          />
          <span>{headerLabel}</span>
        </TabsTrigger>
        <TabsTrigger
          value="content"
          className={cn(TAB_TRIGGER_CLASS, "rounded-e-full! rounded-s-xl!")}
        >
          <CustomIcon
            src="/svg/clipboard.svg"
            size={18}
            className="shrink-0 text-current"
          />
          <span>{contentLabel}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="header" className="mt-0">
        {header}
      </TabsContent>
      <TabsContent value="content" className="mt-0">
        {content}
      </TabsContent>
    </Tabs>
  );
}
