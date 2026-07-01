import { videoChunkStore } from "@/app/api/uploads/video/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();

  const uploadId = formData.get("uploadId");
  const chunkIndex = formData.get("chunkIndex");
  const chunksTotal = formData.get("chunksTotal");
  const filename = formData.get("filename");
  const chunk = formData.get("chunk");

  if (
    typeof uploadId !== "string" ||
    typeof chunkIndex !== "string" ||
    typeof chunksTotal !== "string" ||
    typeof filename !== "string" ||
    !(chunk instanceof File)
  ) {
    return Response.json({ error: "Invalid chunk payload" }, { status: 400 });
  }

  const parsedChunkIndex = Number.parseInt(chunkIndex, 10);
  const parsedChunksTotal = Number.parseInt(chunksTotal, 10);

  if (!Number.isInteger(parsedChunkIndex) || !Number.isInteger(parsedChunksTotal)) {
    return Response.json({ error: "chunkIndex and chunksTotal must be integers" }, { status: 400 });
  }

  const chunkBytes = new Uint8Array(await chunk.arrayBuffer());

  const entry = videoChunkStore.get(uploadId) ?? {
    filename,
    chunksTotal: parsedChunksTotal,
    chunks: new Map<number, Uint8Array>(),
  };

  entry.filename = filename;
  entry.chunksTotal = parsedChunksTotal;
  entry.chunks.set(parsedChunkIndex, chunkBytes);
  videoChunkStore.set(uploadId, entry);

  return Response.json({
    success: true,
    uploadId,
    chunkIndex: parsedChunkIndex,
    receivedChunks: entry.chunks.size,
    chunksTotal: parsedChunksTotal,
  });
}
