import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ICollabReq } from "../interfaces/collabReq.interface";
import { IProject } from "../interfaces/project.interface";
import { IUser } from "../interfaces/user.interface";

interface IDetails extends ICollabReq {
  viewer: IUser;
  project: IProject;
}

export function ProjectCollabRequests() {
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();
  const [details, setDetails] = useState([] as IDetails[]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        //collab reqs that project owner(user) got or he accepted
        let { data } = await axiosIntercept.get(
          "/user/collabReqGotOrAccepted",
          {
            headers: {
              Authorization: `token ${authState.accessToken}`,
            },
          }
        );

        console.log(data);

        //collab reqs that user sent and got accepted
        const res = await axiosIntercept.get("/feed/accepted", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        data = [...data, ...res.data];

        data.forEach(async (element: ICollabReq) => {
          const projectRes = await axiosIntercept.get(
            `projects/${element.projectId}`,
            {
              headers: {
                Authorization: `token ${authState.accessToken}`,
              },
            }
          );

          const viewerRes = await axiosIntercept.get(
            `user/${element.viewerId}`,
            {
              headers: {
                Authorization: `token ${authState.accessToken}`,
              },
            }
          );

          console.log(viewerRes.data);
          console.log(projectRes.data);

          setDetails((prevState) => [
            ...prevState,
            { ...element, viewer: viewerRes.data, project: projectRes.data },
          ]);
          setError("");
        });
      } catch (error) {
        setError("could not fetch data");
      }
    })();
  }, []);

  const accept = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    viewerId: number,
    projectId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(
        `/user/collabReqGot/accept/${projectId}/${viewerId}`,
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      console.log(details.length);
      setDetails(
        details.map((element: IDetails) => {
          if (
            element.viewerId === viewerId &&
            element.projectId === projectId
          ) {
            return {
              ...element,
              status: "accepted",
            };
          } else return element;
        })
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  const reject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    viewerId: number,
    projectId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(
        `/user/collabReqGot/reject/${projectId}/${viewerId}`,
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      console.log(details.length);
      setDetails(
        details.map((element: IDetails) => {
          if (
            element.viewerId === viewerId &&
            element.projectId === projectId
          ) {
            return {
              ...element,
              status: "rejected",
            };
          } else return element;
        })
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  return (
    <div>
      <h3>ProjectCollabReq</h3>
      <div>{error}</div>
      <h2>You own these projects</h2>
      <h2>Liked</h2>

      <div className="requests-liked">
        {details.map((element: IDetails, index: number) =>
          element.status === "liked" ? (
            <div key={index}>
              <div>{element.status}</div>
              <div>{element.project.title}</div>
              {"          "}
              {element.viewer.name}
              {"           "}
              <button
                type="button"
                onClick={(e) => accept(e, element.viewerId, element.projectId)}
              >
                accept
              </button>
              <button
                type="button"
                onClick={(e) => reject(e, element.viewerId, element.projectId)}
              >
                reject
              </button>
              <br />
              <br />
            </div>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>

      <h2>Accepted</h2>
      <div className="requests-accepted">
        {details.map((element: IDetails, index: number) =>
          element.status === "accepted" ? (
            <div key={index}>
              <div>{element.status}</div>
              <div>{element.project.title}</div>
              {"          "}
              {element.viewer.name}
              {"           "}
              {/*           
              <button
                type="button"
                onClick={(e) => reject(e, element.viewerId, element.projectId)}
              >
                reject
              </button> */}
              <br />
              <br />
            </div>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>
    </div>
  );
}
