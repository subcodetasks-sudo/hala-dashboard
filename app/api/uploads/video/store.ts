type UploadEntry = {
  filename: string;
  chunksTotal: number;
  chunks: Map<number, Uint8Array>;
};

declare global {
  // eslint-disable-next-line no-var
  var __videoChunkStore: Map<string, UploadEntry> | undefined;
}

export const videoChunkStore = globalThis.__videoChunkStore ?? new Map<string, UploadEntry>();

if (!globalThis.__videoChunkStore) {
  globalThis.__videoChunkStore = videoChunkStore;
}
