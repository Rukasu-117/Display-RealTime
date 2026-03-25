export type ContentType = "image" | "video" | "pdf";

export interface Content {
  id: string;
  displayId: string;
  type: ContentType | string;
  filePath: string;
  order: number;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
}
