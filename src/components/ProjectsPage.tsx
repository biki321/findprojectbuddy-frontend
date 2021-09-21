import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IProject } from "../interfaces/project.interface";
import { ITag } from "../interfaces/tag.interface";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";

export function ProjectsPage() {
  const { authState } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [error, setError] = useState("");
  const axiosIntercept = useAxiosIntercept();

  useEffect(() => {
    (async () => {
      try {
        //get users tags
        let { data } = await axiosIntercept.get("/user/projects", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        setProjects(data);
        console.log("projects", data);
      } catch (error) {
        setError("could not fetch projects");
      }
    })();
  }, []);

  return (
    <div>
      <h1>projects</h1>

      {projects.map((project: IProject) => (
        <div className="project-card" key={project.id}>
          <h6>title</h6>
          <p>{project.title}</p>
          <h6>description</h6>
          <p>{project.description}</p>
          <h6>tags</h6>
          {project.tags?.map((tag: ITag) => (
            <span key={tag.id}>{tag.tag} </span>
          ))}
          <br />
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
