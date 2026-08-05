export const pricingKeys = {
  all: ["pricing"] as const,
  header: () => [...pricingKeys.all, "header"] as const,
  packages: () => [...pricingKeys.all, "packages"] as const,
  packagesList: (page: number, perPage: number) =>
    [...pricingKeys.packages(), { page, perPage }] as const,
};
