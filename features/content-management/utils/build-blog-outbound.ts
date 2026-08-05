function readFormText(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function hasRichTextContent(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

export type BlogOutboundError = "required" | "status" | "publishedAt";

export function buildBlogOutbound(
  formData: FormData,
): FormData | { error: BlogOutboundError } {
  const titleAr = readFormText(formData, "title[ar]", "title_ar");
  const titleEn = readFormText(formData, "title[en]", "title_en");
  const contentAr = readFormText(formData, "content[ar]", "content_ar");
  const contentEn = readFormText(formData, "content[en]", "content_en");
  const slug = readFormText(formData, "slug");
  const status = readFormText(formData, "status") || "active";
  const publishedAt = readFormText(formData, "published_at", "publishedAt");
  const image = formData.get("image");

  if (
    !titleAr ||
    !titleEn ||
    !hasRichTextContent(contentAr) ||
    !hasRichTextContent(contentEn) ||
    !slug ||
    !publishedAt
  ) {
    return { error: "required" };
  }

  if (status !== "active" && status !== "inactive") {
    return { error: "status" };
  }

  const outbound = new FormData();
  outbound.append("title[ar]", titleAr);
  outbound.append("title[en]", titleEn);
  outbound.append("content[ar]", contentAr);
  outbound.append("content[en]", contentEn);
  outbound.append("slug", slug);
  outbound.append("status", status);
  outbound.append("published_at", publishedAt);

  if (image instanceof File && image.size > 0) {
    outbound.append("image", image, image.name);
  }

  return outbound;
}

export function mapBlogOutboundError(
  error: BlogOutboundError,
  messages: {
    blogRequired: string;
    blogStatusInvalid: string;
    blogPublishedAtInvalid: string;
  },
): string {
  if (error === "status") return messages.blogStatusInvalid;
  if (error === "publishedAt") return messages.blogPublishedAtInvalid;
  return messages.blogRequired;
}
