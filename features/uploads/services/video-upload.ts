const VIDEO_CHUNK_SIZE = 5 * 1024 * 1024;

type UploadVideoParams = {
  file: File;
  videoChunkEndpoint: string;
  videoMergeEndpoint: string;
  onChunkUploaded?: (chunkIndex: number, chunksTotal: number) => void;
};

export async function uploadVideoFile({
  file,
  videoChunkEndpoint,
  videoMergeEndpoint,
  onChunkUploaded,
}: UploadVideoParams) {
  const uploadId = crypto.randomUUID();
  const chunksTotal = Math.ceil(file.size / VIDEO_CHUNK_SIZE);

  for (let chunkIndex = 0; chunkIndex < chunksTotal; chunkIndex += 1) {
    const start = chunkIndex * VIDEO_CHUNK_SIZE;
    const end = Math.min(start + VIDEO_CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", String(chunkIndex));
    formData.append("chunksTotal", String(chunksTotal));
    formData.append("filename", file.name);
    formData.append("chunk", chunk, `${file.name}.part-${chunkIndex}`);

    const response = await fetch(videoChunkEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Chunk ${chunkIndex + 1} failed`);
    }

    onChunkUploaded?.(chunkIndex, chunksTotal);
  }

  const mergeResponse = await fetch(videoMergeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uploadId,
      filename: file.name,
      chunksTotal,
    }),
  });

  if (!mergeResponse.ok) {
    throw new Error("Failed to merge uploaded chunks");
  }
}
