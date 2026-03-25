import type { Content } from "@/types/content";

export interface Display {
  id: string;
  name: string;
  rotation: number;
  aspectRatio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisplayWithContents extends Display {
  contents: Content[];
}
