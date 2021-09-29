import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";

export function MiniInfoPanel() {
  const [noOfCollabReqGot, setNoOfCollabReqGot] = useState(0);
  const [noOfAccReq, setNoOfAccReq] = useState(0);
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();

  useEffect(() => {
    // const timeInterval = setInterval(async () => {
    //   const collabReqGotRes = await axiosIntercept.get("/notification/reqGot", {
    //     headers: {
    //       Authorization: `token ${authState.accessToken}`,
    //     },
    //   });

    //   const acceptedRes = await axiosIntercept.get(
    //     "/notification/reqAccepted",
    //     {
    //       headers: {
    //         Authorization: `token ${authState.accessToken}`,
    //       },
    //     }
    //   );

    //   console.log(collabReqGotRes.data);
    //   console.log(acceptedRes.data);
    //   setNoOfCollabReqGot(collabReqGotRes.data.no);
    //   setNoOfAccReq(acceptedRes.data.no);
    // }, 5000);

    (async () => {
      const collabReqGotRes = await axiosIntercept.get("/notification/reqGot", {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });

      const acceptedRes = await axiosIntercept.get(
        "/notification/reqAccepted",
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );

      console.log(collabReqGotRes.data);
      console.log(acceptedRes.data);
      setNoOfCollabReqGot(collabReqGotRes.data.no);
      setNoOfAccReq(acceptedRes.data.no);
    })();

    // return () => clearInterval(timeInterval);
  }, [authState.accessToken, axiosIntercept]);

  const onClickRequest = () => {
    // axiosIntercept.get("/notification/reqAccepted/read");
  };
  const onClickAccepted = () => {
    // axiosIntercept.get("/notification/reqGot/read");
  };

  return (
    <div>
      <div className="info-panel">mini window</div>
      <NavLink key={1} to="/app/projects/create">
        Create Project
      </NavLink>
      <div></div>
      <NavLink key={2} to="/app/feeds">
        feed{" "}
      </NavLink>
      <div></div>
      <NavLink key={3} to="/app/profile">
        Profile{" "}
      </NavLink>
      <div></div>
      <NavLink key={4} to="/app/projects">
        Projects{" "}
      </NavLink>
      <div></div>
      <NavLink
        key={5}
        to="/app/projects"
        onClick={onClickRequest}
      >{`${noOfCollabReqGot} requests`}</NavLink>
      <div></div>

      <NavLink
        key={6}
        to="/app/accepted"
        onClick={onClickAccepted}
      >{`${noOfAccReq} Accepted`}</NavLink>
      <div></div>
      <NavLink key={7} to="/app/chat">
        Chat{" "}
      </NavLink>
    </div>
  );
}
