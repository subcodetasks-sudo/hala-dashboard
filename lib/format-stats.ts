export function formatStatsCount(
  value: number | undefined,
  isLoading: boolean,
): string {
  if (isLoading) {
    return "...";
  }
  if (value === undefined) {
    return "-";
  }
  return String(value).padStart(2, "0");
}

export function formatChangePercent(
  value: number | undefined,
  isLoading: boolean,
): string {
  if (isLoading) {
    return "...";
  }
  if (value === undefined) {
    return "-";
  }
  return value > 0 ? `+${value}%` : `${value}%`;
}
