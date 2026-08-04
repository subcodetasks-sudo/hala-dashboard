export type CancelStatusActiveFilter = "all" | "active" | "inactive";

export type CancelStatusFilterValues = {
  search: string;
  active: CancelStatusActiveFilter;
};

export type CancelStatusIndicators = {
  total: number;
  active: number;
  inactive: number;
};

export type CancelStatusRow = {
  id: number;
  textAr: string;
  textEn: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type CancelStatusesListResult = {
  items: CancelStatusRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type CancelStatusApiItem = {
  id: number;
  textAr: string;
  textEn: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CancelStatusesListPage = {
  data: CancelStatusApiItem[];
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

export type CancelStatusesListResponse = {
  success: boolean;
  message: string;
  data: CancelStatusesListPage;
};

export type CancelStatusFormValues = {
  textAr: string;
  textEn: string;
  active: boolean;
};

export type CancelStatusMutationResponse = {
  success: boolean;
  message: string;
  data?: CancelStatusApiItem | null;
};

export type CancelStatusDetailResponse = {
  success: boolean;
  message: string;
  data: CancelStatusApiItem;
};
