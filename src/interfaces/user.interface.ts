import { IProject } from "./project.interface";
import { ITag } from "./tag.interface";

export interface IUser {
  id: number;
  handle: string;
  name: string | null;
  bio: string | null;
  githubId: number;
  githubUrl?: string | null;
  email: string | null;
  avatar: string | null;
  tags?: ITag[];
  tokenVersion: number;
  projects?: IProject[];
}
