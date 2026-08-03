export type AppLocale = "ar" | "en";

export type FormattedDateTime = {
  dateLabel: string;
  timeLabel: string;
  isoDate: string;
};

function localeTag(locale: AppLocale): string {
  return locale === "ar" ? "ar" : "en-GB";
}

function timeLocaleTag(locale: AppLocale): string {
  return locale === "ar" ? "ar" : "en-US";
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  calendar: "gregory",
};

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  calendar: "gregory",
};

function parseApiDateParts(value: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  datePart: string;
  timePart: string;
} | null {
  const normalized = value.includes("T")
    ? value.replace("T", " ").replace(/Z$/, "")
    : value;
  const [datePart = "", timePart = ""] = normalized.trim().split(/\s+/);
  const [year, month, day] = datePart.split("-").map(Number);
  const timeSubparts = timePart.split(":");
  const hour = Number(timeSubparts[0] ?? 0);
  const minute = Number(timeSubparts[1] ?? 0);
  const second = Number(String(timeSubparts[2] ?? "0").replace(/\.\d+$/, ""));

  if (!year || !month || !day) return null;

  return { year, month, day, hour, minute, second, datePart, timePart };
}

/** Formats API datetime (`YYYY-MM-DD HH:mm:ss` or ISO) for the active locale. */
export function formatApiDateTime(
  value: string | null | undefined,
  locale: AppLocale = "en",
): FormattedDateTime {
  if (!value) {
    return { dateLabel: "—", timeLabel: "—", isoDate: "" };
  }

  const parts = parseApiDateParts(value);
  if (!parts) {
    const [datePart = "", timePart = ""] = value.split(" ");
    return {
      dateLabel: value,
      timeLabel: timePart || "—",
      isoDate: datePart,
    };
  }

  const date = new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  const dateLabel = date.toLocaleDateString(localeTag(locale), DATE_FORMAT_OPTIONS);

  const hasTime = Boolean(parts.timePart);
  const timeLabel = hasTime
    ? date.toLocaleTimeString(timeLocaleTag(locale), TIME_FORMAT_OPTIONS)
    : "—";

  return { dateLabel, timeLabel, isoDate: parts.datePart };
}

/** Formats a date-only value (`YYYY-MM-DD`) for the active locale. */
export function formatDateOnly(
  value: string | null | undefined,
  locale: AppLocale = "en",
): string {
  if (!value) return "—";

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString(
    localeTag(locale),
    DATE_FORMAT_OPTIONS,
  );
}

/**
 * Formats mock-row ISO date + English clock time (e.g. `"10:30 AM"`)
 * into locale-aware labels.
 */
export function formatIsoDateWithClockTime(
  isoDate: string,
  clockTime: string,
  locale: AppLocale,
): FormattedDateTime {
  const match = clockTime
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    const dateOnly = formatDateOnly(isoDate, locale);
    return {
      dateLabel: dateOnly,
      timeLabel: clockTime || "—",
      isoDate,
    };
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");

  return formatApiDateTime(`${isoDate} ${hh}:${mm}:00`, locale);
}

/**
 * Short relative duration for sidebar copy that already wraps with
 * `relativeAgo` (`{time} ago` / `منذ {time}`).
 */
export function formatRelativeTimeShort(
  value: string | null | undefined,
  locale: AppLocale,
): string {
  if (!value) return "";

  const parts = parseApiDateParts(value);
  if (!parts) return "";

  const date = new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const isAr = locale === "ar";

  if (diffMins < 1) return isAr ? "الآن" : "just now";
  if (diffMins < 60) return isAr ? `${diffMins}د` : `${diffMins}m`;
  if (diffHours < 24) return isAr ? `${diffHours}س` : `${diffHours}h`;
  return isAr ? `${diffDays}ي` : `${diffDays}d`;
}

/**
 * Full relative phrase for inline labels (hold card, history).
 * Prefer `formatRelativeTimeShort` when a `relativeAgo` i18n wrapper is used.
 */
export function formatRelativeTimeLabel(
  value: string | null | undefined,
  locale: AppLocale,
): string {
  const short = formatRelativeTimeShort(value, locale);
  if (!short) return "";
  if (short === "just now" || short === "الآن") return short;
  return locale === "ar" ? `منذ ${short}` : `${short} ago`;
}
