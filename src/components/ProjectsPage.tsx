import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IProject } from "../interfaces/project.interface";
import { ICollabReq } from "../interfaces/collabReq.interface";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ProjectComp } from "./ProjectComp";
import { Link, NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { Redirect } from "react-router";

export function ProjectsPage() {
  const { authState } = useAuth();
  const [projectsAndReqs, setDetails] = useState<
    { project: IProject; reqs: ICollabReq[]; accepted: ICollabReq[] }[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    })();
  }, [authState.accessToken, axiosIntercept]);

  const handleProjectDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number
  ) => {
    setLoading(true);
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
    setLoading(false);
  };

  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return loading ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    <div>
      {error}
      {projectsAndReqs.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div>You do not have any Projects</div>
          <div>
            <Link
              to="/app/projects/create"
              style={{ textDecoration: "none", marginTop: "20px" }}
            >
              Create Project
            </Link>
          </div>
        </div>
      ) : (
        projectsAndReqs.map((pAndR) => (
          <div key={pAndR.project.id}>
            <ProjectComp project={pAndR.project} />
            <div style={{ marginTop: "10px" }}>
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
                style={{
                  textDecoration: "none",
                  // color: "black",
                  // fontSize: "11px",
                  fontWeight: "bolder",
                  margin: "0px 10px",
                }}
              >
                {pAndR.reqs.length > 0
                  ? `${pAndR.reqs.length} requests`
                  : `${pAndR.accepted.length} people`}
              </NavLink>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
