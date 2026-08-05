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

export type ContentSectionId =
  | "hero"
  | "statistics"
  | "services"
  | "workSteps"
  | "faqs"
  | "blog"
  | "legal";

export type HeroStatus = "active" | "inactive";

export type HeroApiItem = {
  id: number;
  badge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string | null;
  status: HeroStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type HeroShowResponse = {
  success: boolean;
  message: string;
  data: HeroApiItem | null;
};

export type HeroMutationResponse = {
  success: boolean;
  message: string;
  data: HeroApiItem;
};

export type HeroFormValues = {
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type StatisticsHeaderStatus = "active" | "inactive";

export type StatisticsHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: StatisticsHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type StatisticsHeaderShowResponse = {
  success: boolean;
  message: string;
  data: StatisticsHeaderApiItem | null;
};

export type StatisticsHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: StatisticsHeaderApiItem;
};

export type StatisticsHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type StatisticItemStatus = "active" | "inactive";

export type StatisticApiItem = {
  id: number;
  description: LocalizedText;
  number: string;
  image: string | null;
  sortOrder: number;
  status: StatisticItemStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type StatisticsListPage = {
  data: StatisticApiItem[];
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

export type StatisticsListResponse = {
  success: boolean;
  message: string;
  data: StatisticsListPage;
};

export type StatisticMutationResponse = {
  success: boolean;
  message: string;
  data?: StatisticApiItem | null;
};

export type StatisticItemFormValues = {
  descriptionAr: string;
  descriptionEn: string;
  number: string;
  sortOrder: string;
};

export type StatisticItemRow = {
  id: number;
  descriptionAr: string;
  descriptionEn: string;
  number: string;
  image: string | null;
  sortOrder: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type StatisticsItemsListResult = {
  items: StatisticItemRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type ServicesHeaderStatus = "active" | "inactive";

export type ServicesHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: ServicesHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type ServicesHeaderShowResponse = {
  success: boolean;
  message: string;
  data: ServicesHeaderApiItem | null;
};

export type ServicesHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: ServicesHeaderApiItem;
};

export type ServicesHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type ServiceItemStatus = "active" | "inactive";

export type ServiceApiItem = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  buttonText: LocalizedText;
  buttonLink: string;
  image: string | null;
  sortOrder: number;
  status: ServiceItemStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type ServicesListPage = {
  data: ServiceApiItem[];
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

export type ServicesListResponse = {
  success: boolean;
  message: string;
  data: ServicesListPage;
};

export type ServiceMutationResponse = {
  success: boolean;
  message: string;
  data?: ServiceApiItem | null;
};

export type ServiceItemFormValues = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  sortOrder: string;
};

export type ServiceItemRow = {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  image: string | null;
  sortOrder: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type ServicesItemsListResult = {
  items: ServiceItemRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type WorkStepsHeaderStatus = "active" | "inactive";

export type WorkStepsHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: WorkStepsHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkStepsHeaderShowResponse = {
  success: boolean;
  message: string;
  data: WorkStepsHeaderApiItem | null;
};

export type WorkStepsHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: WorkStepsHeaderApiItem;
};

export type WorkStepsHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type FaqsHeaderStatus = "active" | "inactive";

export type FaqsHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: FaqsHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqsHeaderShowResponse = {
  success: boolean;
  message: string;
  data: FaqsHeaderApiItem | null;
};

export type FaqsHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: FaqsHeaderApiItem;
};

export type FaqsHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type FaqMutationResponse = {
  success: boolean;
  message: string;
  data?: FaqApiItem | null;
};

export type FaqItemFormValues = {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: string;
};

export type FaqItemRow = {
  id: number;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type FaqsItemsListResult = {
  items: FaqItemRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type StepItemStatus = "active" | "inactive";

export type StepApiItem = {
  id: number;
  stepNumber: number;
  stepName: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string | null;
  status: StepItemStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type StepsListResponse = {
  success: boolean;
  message: string;
  data: StepApiItem[] | {
    data: StepApiItem[];
    meta?: {
      total?: number;
      per_page?: number;
      current_page?: number;
      last_page?: number;
    };
  };
};

export type StepMutationResponse = {
  success: boolean;
  message: string;
  data?: StepApiItem | null;
};

export type StepItemFormValues = {
  stepNumber: string;
  stepNameAr: string;
  stepNameEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type StepItemRow = {
  id: number;
  stepNumber: number;
  stepNameAr: string;
  stepNameEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string | null;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type StepsItemsListResult = {
  items: StepItemRow[];
};

export type LegalPageKind = "terms" | "privacy";

export type LegalHeaderStatus = "active" | "inactive";

export type LegalHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: LegalHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type LegalHeaderShowResponse = {
  success: boolean;
  message: string;
  data: LegalHeaderApiItem | null;
};

export type LegalHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: LegalHeaderApiItem;
};

export type LegalHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type LegalSectionApiItem = {
  id: number;
  title: LocalizedText;
  content: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type LegalSectionsListPage = {
  data: LegalSectionApiItem[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
  links?: {
    next?: string | null;
  };
};

export type LegalSectionsListResponse = {
  success: boolean;
  message: string;
  data: LegalSectionsListPage;
};

export type LegalSectionMutationResponse = {
  success: boolean;
  message: string;
  data?: LegalSectionApiItem | null;
};

export type LegalSectionFormValues = {
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sortOrder: string;
};

export type LegalSectionRow = {
  id: number;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sortOrder: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type LegalSectionsListResult = {
  items: LegalSectionRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};
