import type { BlogFormValues } from "@/features/content-management/types";
import { toApiPublishedAt } from "@/features/content-management/utils/slugify";

/** Builds multipart body for `/admin/blogs` create/update. */
export function buildBlogFormData(
  values: BlogFormValues,
  image?: File,
): FormData {
  const formData = new FormData();
  formData.append("title[ar]", values.titleAr.trim());
  formData.append("title[en]", values.titleEn.trim());
  formData.append("content[ar]", values.contentAr.trim());
  formData.append("content[en]", values.contentEn.trim());
  formData.append("slug", values.slug.trim());
  formData.append("status", values.status);
  formData.append("published_at", toApiPublishedAt(values.publishedAt));

  if (image && image.size > 0) {
    formData.append("image", image, image.name);
  }

  return formData;
}
