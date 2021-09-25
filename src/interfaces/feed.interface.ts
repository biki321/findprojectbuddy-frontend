import { IProject } from "./project.interface";
import { IUser } from "./user.interface";

export interface IFeed {
  projectId: number;
  projectOwnerId: number;
  score: number;
  status: string;
  viewerId: number;
  id: number;
  project: IProject;
  projectOwner: IUser;
}
