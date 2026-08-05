const SIGN_PATH = "/signature";

/**
 * Builds the public signature URL for a manual order:
 * `NEXT_PUBLIC_FRONTEND_BASE_URL` + `/sign`, with `orderId` as a query param when available.
 *
 * Falls back to a root-relative path when the env var is unset, and assumes
 * https:// when the configured value omits a protocol.
 */
export function buildSignatureLink(orderId?: string | number | null): string {
  const configured = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL?.trim() ?? "";
  const base = configured.replace(/\/+$/, "");

  const origin =
    base === "" || base.startsWith("/")
      ? base
      : /^https?:\/\//i.test(base)
        ? base
        : `https://${base}`;

  const id = orderId == null ? "" : String(orderId).trim();
  const query = id === "" ? "" : `?${new URLSearchParams({ orderId: id })}`;

  return `${origin}${SIGN_PATH}${query}`;
}
