import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ICollabReq } from "../interfaces/collabReq.interface";
import { IProject } from "../interfaces/project.interface";
import { IUser } from "../interfaces/user.interface";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Avatar from "@mui/material/Avatar";
import { Redirect } from "react-router";

interface IDetail extends ICollabReq {
  owner: IUser;
  project: IProject;
}

export function AcceptedPage() {
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();
  const [details, setDetails] = useState([] as IDetail[]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("use effect at accepted page");
    try {
      (async () => {
        const acceptedRes = await axiosIntercept.get("/feed/accepted", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        console.log(acceptedRes.data);

        const projectIds = acceptedRes.data.map(
          (accReq: ICollabReq) => accReq.projectId
        );

        console.log(projectIds);
        let ownerIds: number[] = acceptedRes.data.map(
          (accReq: ICollabReq) => accReq.projectOwnerId
        );

        ownerIds = ownerIds.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });

        const projectsRes = await axiosIntercept.post(
          "projects/getProjects",
          {
            ids: projectIds,
          },
          {
            headers: {
              Authorization: `token ${authState.accessToken}`,
            },
          }
        );

        const ownersRes = await axiosIntercept.post(
          "user/getUsers",
          {
            ids: ownerIds,
          },
          {
            headers: {
              Authorization: `token ${authState.accessToken}`,
            },
          }
        );

        console.log(projectsRes.data);
        console.log(ownersRes.data);

        setDetails(
          acceptedRes.data.map((accReq: ICollabReq) => ({
            ...accReq,
            owner: ownersRes.data.find(
              (user: IUser) => user.id === accReq.projectOwnerId
            ),
            project: projectsRes.data.find(
              (project: IProject) => project.id === accReq.projectId
            ),
          }))
        );
        setError("");
      })();
    } catch (error) {
      setError("could not fetch");
    }
  }, []);

  const reject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    feedId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(`/feed/reject/${projectId}`, {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      setDetails(
        details.map((element: IDetail) =>
          element.id === feedId ? { ...element, status: "rejected" } : element
        )
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {details.map((element: IDetail) =>
        element.status === "accepted" ? (
          <div key={element.id} style={{ marginTop: "20px" }}>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <div style={{ display: "flex", alignContent: "center" }}>
                  <Avatar
                    src={element.owner.avatar ?? undefined}
                    sx={{ width: 40, height: 40 }}
                  />
                  <NavLink to={`/app/profile/${element.owner.id}`}>
                    {element.owner.handle}
                  </NavLink>
                </div>
                <Card.Title>{element.project.title}</Card.Title>
                <Card.Text>{element.project.description}</Card.Text>
                <div>
                  {element.project?.tags?.map((tag) => (
                    <Badge
                      style={{ margin: "5px" }}
                      key={tag.id}
                      bg="secondary"
                    >
                      {tag.tag}
                    </Badge>
                  ))}
                </div>{" "}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                ></div>
              </Card.Body>
            </Card>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={(e) => reject(e, element.project.id, element.id)}
            >
              Cancel
            </Button>
          </div>
        ) : null
      )}
    </div>
  );
}
