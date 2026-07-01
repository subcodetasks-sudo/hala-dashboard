export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const originalName = formData.get("originalName");

  if (!(file instanceof File)) {
    return Response.json({ error: "No image file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are allowed on this endpoint" }, { status: 400 });
  }

  return Response.json({
    success: true,
    filename: file.name,
    originalName: typeof originalName === "string" ? originalName : file.name,
    contentType: file.type,
    size: file.size,
  });
}
