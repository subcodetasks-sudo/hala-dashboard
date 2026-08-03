import type {
  ContentCategory,
  ContentFilterValues,
  ContentIndicators,
  ContentRow,
} from "@/features/content-management/types";

export const DEFAULT_CONTENT_FILTERS: ContentFilterValues = {
  search: "",
  status: "all",
};

/** Indicator numbers only — UI (icons, colors, period) lives in the view. */
export const CONTENT_INDICATORS_BY_CATEGORY: Record<
  ContentCategory,
  ContentIndicators
> = {
  faqs: {
    total: 28,
    published: 19,
    drafts: 9,
    changePercent: 24,
  },
  blog: {
    total: 42,
    published: 31,
    drafts: 11,
    changePercent: 12,
  },
  banners: {
    total: 14,
    published: 10,
    drafts: 4,
    changePercent: 8,
  },
  legal: {
    total: 6,
    published: 5,
    drafts: 1,
    changePercent: 0,
  },
};

export const CONTENT_ROWS: ContentRow[] = [
  {
    id: "faq-1",
    category: "faqs",
    title: "كيف أجدد عقد العمالة المنزلية؟",
    typeLabel: "FAQ",
    updatedDate: "الثلاثاء، 12 يناير 2026",
    updatedTime: "10:30 ص",
    updatedAtIso: "2026-01-12",
    appearance: "supportPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "faq-2",
    category: "faqs",
    title: "ما هي المستندات المطلوبة لتجديد العقد؟",
    typeLabel: "FAQ",
    updatedDate: "الثلاثاء، 12 يناير 2026",
    updatedTime: "10:30 ص",
    updatedAtIso: "2026-01-12",
    appearance: "supportPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "faq-3",
    category: "faqs",
    title: "كم تستغرق مدة تجديد العقد؟",
    typeLabel: "FAQ",
    updatedDate: "الثلاثاء، 12 يناير 2026",
    updatedTime: "10:30 ص",
    updatedAtIso: "2026-01-12",
    appearance: "supportPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "faq-4",
    category: "faqs",
    title: "هل يمكن تجديد العقد إلكترونياً بالكامل؟",
    typeLabel: "FAQ",
    updatedDate: "الثلاثاء، 12 يناير 2026",
    updatedTime: "10:30 ص",
    updatedAtIso: "2026-01-12",
    appearance: "supportPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "faq-5",
    category: "faqs",
    title: "ماذا أفعل إذا رفضت وزارة الموارد البشرية الطلب؟",
    typeLabel: "FAQ",
    updatedDate: "الثلاثاء، 12 يناير 2026",
    updatedTime: "10:30 ص",
    updatedAtIso: "2026-01-12",
    appearance: "supportPage",
    author: "systemAdmin",
    status: "draft",
  },
  {
    id: "blog-1",
    category: "blog",
    title: "دليل تجديد عقود العمالة المنزلية 2026",
    typeLabel: "Blog",
    updatedDate: "الإثنين، 11 يناير 2026",
    updatedTime: "09:15 ص",
    updatedAtIso: "2026-01-11",
    appearance: "blogPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "blog-2",
    category: "blog",
    title: "أبرز التحديثات في منصة هلا وسهلاً",
    typeLabel: "Blog",
    updatedDate: "الأحد، 10 يناير 2026",
    updatedTime: "02:40 م",
    updatedAtIso: "2026-01-10",
    appearance: "blogPage",
    author: "systemAdmin",
    status: "draft",
  },
  {
    id: "banner-1",
    category: "banners",
    title: "تنبيه صيانة مجدولة للمنصة",
    typeLabel: "Banner",
    updatedDate: "السبت، 9 يناير 2026",
    updatedTime: "08:00 ص",
    updatedAtIso: "2026-01-09",
    appearance: "homeBanner",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "banner-2",
    category: "banners",
    title: "عرض تجديد العقود لهذا الأسبوع",
    typeLabel: "Banner",
    updatedDate: "الجمعة، 8 يناير 2026",
    updatedTime: "11:20 ص",
    updatedAtIso: "2026-01-08",
    appearance: "homeBanner",
    author: "systemAdmin",
    status: "draft",
  },
  {
    id: "legal-1",
    category: "legal",
    title: "سياسة الخصوصية",
    typeLabel: "Legal",
    updatedDate: "الخميس، 7 يناير 2026",
    updatedTime: "04:10 م",
    updatedAtIso: "2026-01-07",
    appearance: "legalPage",
    author: "systemAdmin",
    status: "published",
  },
  {
    id: "legal-2",
    category: "legal",
    title: "الشروط والأحكام",
    typeLabel: "Legal",
    updatedDate: "الأربعاء، 6 يناير 2026",
    updatedTime: "01:05 م",
    updatedAtIso: "2026-01-06",
    appearance: "legalPage",
    author: "systemAdmin",
    status: "published",
  },
];

export function filterContentRows(
  rows: ContentRow[],
  category: ContentCategory,
  filters: ContentFilterValues
): ContentRow[] {
  const search = filters.search.trim().toLowerCase();

  return rows.filter((row) => {
    if (row.category !== category) return false;
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (!search) return true;
    return (
      row.title.toLowerCase().includes(search) ||
      row.typeLabel.toLowerCase().includes(search)
    );
  });
}

let contentRowsStore: ContentRow[] = [...CONTENT_ROWS];

export function getContentRowsStore(): ContentRow[] {
  return contentRowsStore;
}

export function addFaqToStore(row: ContentRow): ContentRow {
  contentRowsStore = [row, ...contentRowsStore];
  return row;
}

export function addBlogToStore(row: ContentRow): ContentRow {
  contentRowsStore = [row, ...contentRowsStore];
  return row;
}

export function addLegalToStore(row: ContentRow): ContentRow {
  contentRowsStore = [row, ...contentRowsStore];
  return row;
}

export function addBannerToStore(row: ContentRow): ContentRow {
  contentRowsStore = [row, ...contentRowsStore];
  return row;
}

export function unpublishContentInStore(id: string): ContentRow {
  let updated: ContentRow | undefined;
  contentRowsStore = contentRowsStore.map((row) => {
    if (row.id !== id) return row;
    updated = { ...row, status: "draft" };
    return updated;
  });
  if (!updated) {
    throw new Error(`Content with ID ${id} not found`);
  }
  return updated;
}

export function getIndicatorsForCategory(
  category: ContentCategory
): ContentIndicators {
  const rows = contentRowsStore.filter((row) => row.category === category);
  const published = rows.filter((row) => row.status === "published").length;
  const drafts = rows.filter((row) => row.status === "draft").length;
  const baseline = CONTENT_INDICATORS_BY_CATEGORY[category];

  return {
    total: rows.length,
    published,
    drafts,
    changePercent: baseline.changePercent,
  };
}
