import type {
  CitiesTab,
  CityFilterValues,
  IssuePlaceCountry,
} from "@/features/cities/types";

export const citiesKeys = {
  all: ["cities"] as const,
  indicators: (tab: CitiesTab) =>
    [...citiesKeys.all, "indicators", tab] as const,
  lists: () => [...citiesKeys.all, "list"] as const,
  list: (
    tab: CitiesTab,
    filters: CityFilterValues,
    page: number,
    perPage: number,
  ) =>
    [
      ...citiesKeys.lists(),
      tab,
      { filters, page, perPage },
    ] as const,
  details: () => [...citiesKeys.all, "detail"] as const,
  detail: (cityId: number) =>
    [...citiesKeys.details(), cityId] as const,
};

export const issuePlaceKeys = {
  all: ["passport-issue-places"] as const,
  indicators: (country: IssuePlaceCountry) =>
    [...issuePlaceKeys.all, "indicators", country] as const,
  lists: () => [...issuePlaceKeys.all, "list"] as const,
  list: (
    country: IssuePlaceCountry,
    filters: CityFilterValues,
    page: number,
    perPage: number,
  ) =>
    [
      ...issuePlaceKeys.lists(),
      country,
      { filters, page, perPage },
    ] as const,
  details: () => [...issuePlaceKeys.all, "detail"] as const,
  detail: (placeId: number) =>
    [...issuePlaceKeys.details(), placeId] as const,
};
