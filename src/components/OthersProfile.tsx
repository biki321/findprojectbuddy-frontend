import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { useParams } from "react-router-dom";
import { IUser } from "../interfaces/user.interface";
import { ITag } from "../interfaces/tag.interface";
import Badge from "react-bootstrap/Badge";
import { ProfileComp } from "./ProfileComp";

interface IDetails {
  user: IUser;
  error: string;
}

export default function OthersProfile() {
  const { authState } = useAuth();
  const [details, setDetails] = useState({
    user: {},
    error: "",
  } as IDetails);
  const axiosIntercept = useAxiosIntercept();
  const params: { id: string } = useParams();

  useEffect(() => {
    (async () => {
      console.log("useeffect at other profile page");
      try {
        //get users tags
        const id = parseInt(params.id);
        let { data } = await axiosIntercept.get(`/user/${id}`, {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        setDetails({ user: data, error: "" });
        console.log(data);
      } catch (error) {
        setDetails({ ...details, error: "could not fetch" });
      }
    })();
  }, []);

  return <ProfileComp user={details.user} />;
}
