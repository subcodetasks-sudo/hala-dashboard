const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_HEIGHT = 1080;

function getConstrainedDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to decode image"));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

export async function toWebpWithResize(file: File): Promise<File> {
  if (typeof window === "undefined") {
    throw new Error("Image optimization must run in the browser");
  }

  const image = await loadImage(file);
  const { width, height } = getConstrainedDimensions(
    image.width,
    image.height,
    IMAGE_MAX_WIDTH,
    IMAGE_MAX_HEIGHT
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is not available");
  }

  ctx.drawImage(image, 0, 0, width, height);

  const webpBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert image to WebP"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.85
    );
  });

  const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
  return new File([webpBlob], fileName, { type: "image/webp" });
}

export async function uploadImageFile(file: File, imageUploadEndpoint: string) {
  // Always optimize on the client before upload (resize + WebP).
  const transformed = await toWebpWithResize(file);
  const formData = new FormData();
  formData.append("file", transformed);
  formData.append("originalName", file.name);

  const response = await fetch(imageUploadEndpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }
}
