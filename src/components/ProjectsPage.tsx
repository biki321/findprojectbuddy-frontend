import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IProject } from "../interfaces/project.interface";
import { ICollabReq } from "../interfaces/collabReq.interface";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ProjectComp } from "./ProjectComp";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

export function ProjectsPage() {
  const { authState } = useAuth();
  const [projectsAndReqs, setDetails] = useState<
    { project: IProject; reqs: ICollabReq[]; accepted: ICollabReq[] }[]
  >([]);
  const [error, setError] = useState("");
  const axiosIntercept = useAxiosIntercept();

  useEffect(() => {
    (async () => {
      try {
        //get users tags
        let projectsRes = await axiosIntercept.get("/user/projects", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        // setProjects(data);
        console.log("projects", projectsRes.data);
        //collab reqs that project owner(user) got or he accepted
        let reqsRes = await axiosIntercept.get("/user/collabReqGotOrAccepted", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        console.log(reqsRes.data);

        setDetails(
          projectsRes.data.map((project: IProject) => ({
            project: project,
            reqs: reqsRes.data.filter(
              (collabReq: ICollabReq) =>
                project.id === collabReq.projectId &&
                collabReq.status === "liked"
            ),
            accepted: reqsRes.data.filter(
              (collabReq: ICollabReq) =>
                project.id === collabReq.projectId &&
                collabReq.status === "accepted"
            ),
          }))
        );

        setError("");
      } catch (error) {
        setError("could not fetch projects");
      }
    })();
  }, []);

  const handleProjectDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number
  ) => {
    try {
      await axiosIntercept.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      setDetails(
        projectsAndReqs.filter((element) => projectId !== element.project.id)
      );
      setError("");
    } catch (error) {
      setError("can not delete");
    }
  };

  return (
    <div>
      <h1>projects</h1>
      {projectsAndReqs.map((pAndR) => (
        <div key={pAndR.project.id}>
          <ProjectComp project={pAndR.project} />
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            onClick={(e) => handleProjectDelete(e, pAndR.project.id)}
          >
            Delete
          </Button>
          <NavLink
            to={{
              pathname: `/app/projects/${pAndR.project.id}/requests`,
              state: {
                props: { collabReqs: pAndR.reqs.concat(pAndR.accepted) },
              },
            }}
          >
            {pAndR.reqs.length > 0 ? `${pAndR.reqs.length} requests` : "people"}
          </NavLink>
        </div>
      ))}
    </div>
  );
}
