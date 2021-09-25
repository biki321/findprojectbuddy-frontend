import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";

export function MiniInfoPanel() {
  const [noOfCollabReq, setNoOfCollabReq] = useState(0);
  const [noOfAccReq, setNoOfAccReq] = useState(0);
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();

  useEffect(() => {
    (async () => {
      const collabReqGotRes = await axiosIntercept.get("/user/collabReqGot", {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      console.log(collabReqGotRes.data);
      setNoOfCollabReq(collabReqGotRes.data.length);

      const acceptedRes = await axiosIntercept.get("/feed/accepted", {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      console.log(acceptedRes.data);
      setNoOfAccReq(acceptedRes.data.length);
    })();
  }, []);

  return (
    <div>
      <div className="info-panel">mini window</div>
      <NavLink to="/app/projects/create">Create Project</NavLink>
      <div></div>
      <NavLink to="/app/feeds">feed </NavLink>
      <div></div>
      <NavLink to="/app/profile">Profile </NavLink>
      <div></div>
      <NavLink to="/app/projects">Projects </NavLink>
      <div></div>
      {noOfCollabReq !== 0 ? (
        <NavLink to="/app/projects">{`${noOfCollabReq} requests`}</NavLink>
      ) : (
        <div></div>
      )}
      <div></div>
      {noOfAccReq !== 0 ? (
        <NavLink to="/app/accepted">{`${noOfAccReq} Accepted`}</NavLink>
      ) : (
        <div></div>
      )}
      <div></div>
      <NavLink to="/app/chat">Chat </NavLink>
    </div>
  );
}
