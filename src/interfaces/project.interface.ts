import { ITag } from "./tag.interface";

export interface IProject {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  tags?: ITag[];
}
