import { IProject } from "./project.interface";
import { ITag } from "./tag.interface";

export interface IUser {
  id: number;
  handle: string;
  name: string;
  bio: string | null;
  githubId: number;
  githubUrl?: string | null;
  email: string | null;
  avatar: string;
  tags?: ITag[];
  tokenVersion: number;
  projects?: IProject[];
}
