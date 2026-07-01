export type UploadItem = {
  id: string;
  name: string;
  kind: "image" | "video";
  progress: number;
  status: "pending" | "processing" | "uploading" | "done" | "error";
  message?: string;
};

export type UploadDialogProps = {
  imageUploadEndpoint?: string;
  videoChunkEndpoint?: string;
  videoMergeEndpoint?: string;
};
