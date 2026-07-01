import type { UploadItem } from "@/features/uploads/types/upload";

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".heic",
  ".heif",
  ".avif",
];

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".m4v",
  ".3gp",
  ".wmv",
];

function hasKnownExtension(fileName: string, extensions: string[]) {
  const normalizedName = fileName.toLowerCase();
  return extensions.some((ext) => normalizedName.endsWith(ext));
}

export function isSupportedMediaFile(file: File) {
  if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
    return true;
  }

  // Some devices/browsers provide empty or unreliable mime types.
  return (
    hasKnownExtension(file.name, IMAGE_EXTENSIONS) ||
    hasKnownExtension(file.name, VIDEO_EXTENSIONS)
  );
}

export function createQueue(files: File[]): UploadItem[] {
  return files
    .filter(isSupportedMediaFile)
    .map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      kind:
        file.type.startsWith("image/") || hasKnownExtension(file.name, IMAGE_EXTENSIONS)
          ? "image"
          : "video",
      progress: 0,
      status: "pending" as const,
    }));
}
