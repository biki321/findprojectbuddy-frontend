import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ICollabReq } from "../interfaces/collabReq.interface";
import { IUser } from "../interfaces/user.interface";
import { ProfileComp } from "./ProfileComp";
import Spinner from "react-bootstrap/esm/Spinner";

interface IDetail extends ICollabReq {
  viewer: IUser;
}

export function ProjectCollabs() {
  const [error, setError] = useState("");
  const [details, setDetails] = useState([] as IDetail[]);
  const [loading, setLoading] = useState(true);
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();
  const params: { id: string } = useParams();

  useEffect(() => {
    console.log("useeffect at project collab comp");
    try {
      (async () => {
        let reqsRes = await axiosIntercept.get(
          `/projects/${params.id}/collabReqGotOrAccepted`,
          {
            headers: {
              Authorization: `token ${authState.accessToken}`,
            },
          }
        );
        console.log(reqsRes);
        const viewerIds = reqsRes.data.map(
          (element: ICollabReq) => element.viewerId
        );

        const usersRes = await axiosIntercept.post(
          "user/getUsers",
          {
            ids: viewerIds,
          },
          {
            headers: {
              Authorization: `token ${authState.accessToken}`,
            },
          }
        );
        console.log("usersRes at projectcollab", usersRes);
        setDetails(
          usersRes.data.map((viewer: IUser) => ({
            viewer,
            ...reqsRes.data.find((r: ICollabReq) => r.viewerId === viewer.id),
          }))
        );
        setError("");
      })();
    } catch (error) {
      setError("could not fetch");
    }
    setLoading(false);
  }, []);

  const accept = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    viewerId: number,
    reqId: number
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosIntercept.get(
        `/user/collabReqGot/accept/${projectId}/${viewerId}`,
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      setDetails(
        details.map((element) =>
          element.id === reqId ? { ...element, status: "accepted" } : element
        )
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
    setLoading(false);
  };

  const reject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    viewerId: number,
    reqId: number
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosIntercept.get(
        `user/collabReqGot/reject/${projectId}/${viewerId}`,
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      setDetails(
        details.map((element) =>
          element.id === reqId ? { ...element, status: "rejected" } : element
        )
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
    setLoading(false);
  };

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
      <Tabs
        defaultActiveKey="liked"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="liked" title="Request">
          {details.map((element: IDetail) =>
            element.status === "liked" ? (
              <div key={element.id}>
                <ProfileComp user={element.viewer} />
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) =>
                    accept(e, element.projectId, element.viewerId, element.id)
                  }
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) =>
                    reject(e, element.projectId, element.viewerId, element.id)
                  }
                >
                  Nope
                </Button>
              </div>
            ) : (
              <div key={element.id}></div>
            )
          )}
        </Tab>
        <Tab eventKey="accepted" title="Accepted">
          {" "}
          {details.map((element: IDetail) =>
            element.status === "accepted" ? (
              <div key={element.id}>
                <ProfileComp user={element.viewer} />

                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) =>
                    reject(e, element.projectId, element.viewerId, element.id)
                  }
                >
                  Nope
                </Button>
              </div>
            ) : (
              <div key={element.id}> </div>
            )
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
