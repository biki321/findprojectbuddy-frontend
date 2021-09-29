import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { useParams } from "react-router-dom";
import { IUser } from "../interfaces/user.interface";
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
  }, [authState.accessToken, axiosIntercept, details, params.id]);

  return <ProfileComp user={details.user} />;
}
