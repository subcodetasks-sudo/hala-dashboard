export type CitiesTab = "cities" | "issuePlaces";

export type CityStatus = "active" | "inactive";

export type IssuePlaceCountry = "sa" | "ph";

export type CityFilterValues = {
  search: string;
  status: "all" | CityStatus;
};

export type CityIndicators = {
  total: number;
  active: number;
  inactive: number;
};

export type CityRow = {
  id: number;
  nameAr: string;
  nameEn: string;
  status: CityStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type CitiesListResult = {
  items: CityRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type CityApiItem = {
  id: number;
  nameAr: string;
  nameEn: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type CitiesListPage = {
  data: CityApiItem[];
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

export type CitiesListResponse = {
  success: boolean;
  message: string;
  data: CitiesListPage;
};

export type CityFormValues = {
  nameAr: string;
  nameEn: string;
  status: CityStatus;
};

export type CityMutationPayload = {
  name_ar: string;
  name_en: string;
  status: CityStatus;
};

export type CityMutationResponse = {
  success: boolean;
  message: string;
  data?: CityApiItem | null;
};

export type CityDetailResponse = {
  success: boolean;
  message: string;
  data: CityApiItem;
};

export type IssuePlaceRow = {
  id: number;
  nameAr: string;
  nameEn: string;
  country: IssuePlaceCountry;
  countryLabel: string;
  status: CityStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
};

export type IssuePlacesListResult = {
  items: IssuePlaceRow[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type IssuePlaceApiItem = {
  id: number;
  nameAr: string;
  nameEn: string;
  country: string;
  countryLabel: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type IssuePlacesListPage = {
  data: IssuePlaceApiItem[];
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

export type IssuePlacesListResponse = {
  success: boolean;
  message: string;
  data: IssuePlacesListPage;
};

export type IssuePlaceFormValues = {
  nameAr: string;
  nameEn: string;
  status: CityStatus;
  country: IssuePlaceCountry;
};

export type IssuePlaceMutationResponse = {
  success: boolean;
  message: string;
  data?: IssuePlaceApiItem | null;
};

export type IssuePlaceDetailResponse = {
  success: boolean;
  message: string;
  data: IssuePlaceApiItem;
};
