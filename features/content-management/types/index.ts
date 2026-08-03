export type ContentCategory =
  | "faqs"
  | "blog"
  | "banners"
  | "legal";

export type ContentStatus = "published" | "draft";

export type ContentTypeLabel = "FAQ" | "Blog" | "Banner" | "Legal";

export type FaqAppearance = "homePage" | "supportPage";

export type BannerAppearance = "siteTop" | "homeBanner";

export type BannerAlertType = "warning" | "info" | "success";

export type ContentIndicators = {
  total: number;
  published: number;
  drafts: number;
  changePercent: number;
};

export type ContentRow = {
  id: string;
  category: ContentCategory;
  title: string;
  typeLabel: ContentTypeLabel;
  updatedDate: string;
  updatedTime: string;
  updatedAtIso: string;
  appearance?: string;
  author: string;
  status: ContentStatus;
  displayOrder?: string;
  answer?: string;
  summary?: string;
  keywords?: string;
  readingTime?: string;
  content?: string;
  alertText?: string;
  alertType?: BannerAlertType;
  startDate?: string;
  endDate?: string;
};

export type ContentFilterValues = {
  search: string;
  status: "all" | ContentStatus;
};

export type AddFaqFormValues = {
  question: string;
  answer: string;
  appearance: FaqAppearance;
  displayOrder: string;
  status: ContentStatus;
};

export type BlogCategory = "blog";

export type AddBlogFormValues = {
  title: string;
  summary: string;
  keywords: string;
  category: BlogCategory;
  status: ContentStatus;
  author: string;
  readingTime: string;
  content: string;
};

export type AddLegalFormValues = {
  pageName: string;
  status: ContentStatus;
  content: string;
};

export type AddBannerFormValues = {
  title: string;
  alertText: string;
  appearance: BannerAppearance;
  alertType: BannerAlertType;
  startDate: string;
  endDate: string;
  status: ContentStatus;
};

export type LocalizedText = {
  ar: string;
  en: string;
};

export type FaqApiStatus = "active" | "inactive" | string;

export type FaqApiItem = {
  id: number;
  question: LocalizedText;
  answer: LocalizedText;
  sortOrder: number;
  status: FaqApiStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqsListPage = {
  data: FaqApiItem[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
  links?: {
    next?: string | null;
  };
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

export type FaqsListResponse = {
  success: boolean;
  message: string;
  data: FaqsListPage;
};
