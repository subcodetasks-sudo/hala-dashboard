export type LocalizedText = {
  ar: string;
  en: string;
};

export type PricingHeaderStatus = "active" | "inactive";

export type PricingHeaderApiItem = {
  id: number;
  content: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  status: PricingHeaderStatus | string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type PricingHeaderShowResponse = {
  success: boolean;
  message: string;
  data: PricingHeaderApiItem | null;
};

export type PricingHeaderMutationResponse = {
  success: boolean;
  message: string;
  data: PricingHeaderApiItem;
};

export type PricingHeaderFormValues = {
  contentAr: string;
  contentEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type PlanType = "plan_renewal" | "whatsapp";

export type PlanAdvantageInput = {
  textAr: string;
  textEn: string;
};

export type PlanAdvantageApiItem = {
  text_ar?: string;
  text_en?: string;
  textAr?: string;
  textEn?: string;
  text?: LocalizedText;
};

export type PackageApiItem = {
  id: number;
  titleAr?: string;
  titleEn?: string;
  title?: LocalizedText;
  descriptionAr?: string;
  descriptionEn?: string;
  description?: LocalizedText;
  price: number | string;
  type: PlanType | string;
  active?: boolean | number | string;
  sortOrder?: number;
  sort_order?: number;
  icon?: string | null;
  image?: string | null;
  advantages?: PlanAdvantageApiItem[] | string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

export type PackagesListPage = {
  data: PackageApiItem[];
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

export type PackagesListResponse = {
  success: boolean;
  message: string;
  data: PackagesListPage | PackageApiItem[];
};

export type PackageMutationResponse = {
  success: boolean;
  message: string;
  data?: PackageApiItem | null;
};

export type PackageFormValues = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: string;
  type: PlanType;
  sortOrder: string;
  advantages: PlanAdvantageInput[];
};

export type PackageRow = {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  type: PlanType | string;
  active: boolean;
  icon: string | null;
  sortOrder: number;
  advantages: PlanAdvantageInput[];
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type PackagesListResult = {
  items: PackageRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};
