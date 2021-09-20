import { tag } from "./tag.interface";

export interface feed {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  tags: tag[];
}
