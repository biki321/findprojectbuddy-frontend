import { ITag } from "./tag.interface";

export interface IFeed {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  tags: ITag[];
}
