import { videoChunkStore } from "@/app/api/uploads/video/store";

export const runtime = "nodejs";

type MergePayload = {
  uploadId?: string;
  filename?: string;
  chunksTotal?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as MergePayload;
  const { uploadId, filename, chunksTotal } = body;

  if (!uploadId || !filename || !chunksTotal) {
    return Response.json({ error: "uploadId, filename and chunksTotal are required" }, { status: 400 });
  }

  const entry = videoChunkStore.get(uploadId);

  if (!entry) {
    return Response.json({ error: "Upload session not found" }, { status: 404 });
  }

  if (entry.chunks.size !== chunksTotal) {
    return Response.json(
      {
        error: "Missing chunks before merge",
        expected: chunksTotal,
        received: entry.chunks.size,
      },
      { status: 400 }
    );
  }

  const orderedChunks: Uint8Array[] = [];
  for (let i = 0; i < chunksTotal; i += 1) {
    const part = entry.chunks.get(i);
    if (!part) {
      return Response.json({ error: `Chunk ${i} is missing` }, { status: 400 });
    }
    orderedChunks.push(part);
  }

  const totalSize = orderedChunks.reduce((sum, part) => sum + part.byteLength, 0);
  const merged = new Uint8Array(totalSize);
  let offset = 0;
  for (const part of orderedChunks) {
    merged.set(part, offset);
    offset += part.byteLength;
  }

  videoChunkStore.delete(uploadId);

  return Response.json({
    success: true,
    uploadId,
    filename,
    size: merged.byteLength,
    mergedAt: new Date().toISOString(),
  });
}
