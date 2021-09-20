import { useAuth } from "../contexts/AuthContext";
import axios, { AxiosRequestConfig } from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { feed } from "../interfaces/feed.interface";
import { IJwtPayload } from "../interfaces/iJwtPayload.interface";

const axiosInter = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function FeedsPage() {
  const { authState, refreshToken } = useAuth();
  const [feeds, setFeeds] = useState<feed[]>([]);
  const [errorMsg, setError] = useState("");

  axiosInter.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const currentDate = new Date();

    if (!authState.accessToken) return Promise.reject("accessToken is null");
    const { exp } = jwt_decode<IJwtPayload>(authState.accessToken);
    if (exp * 1000 < currentDate.getTime()) {
      const token = await refreshToken();
      console.log("new tok at intercep", token);
      if (!token) return Promise.reject("could not get new token");
      config.headers["Authorization"] = `token ${token}`;
    }
    return config;
  });

  useEffect(() => {
    (async () => {
      console.log("useeffect at home ");
      try {
        const res = await axiosInter.get("/feed", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        console.log(res.data);
        setFeeds(res.data);
        setError("");
      } catch (error) {
        setError("no feed available");
      }
    })();
  }, []);

  if (authState.isLoading) {
    return <div>Loading</div>;
  }

  console.log("is auth at feed page", authState.isAuthenticated);

  return (
    <div className="feeds-page">
      <div className=""></div>
      <div className="feeds">
        <h1>Feeds</h1>
        <div>{errorMsg}</div>
        {feeds.map((element) => (
          <div className="feed" key={element.id}>
            <div>title: {element.title}</div>
            <div>description: {element.description}</div>
            <ul>
              {element.tags.map((tag) => (
                <li key={tag.id}>{tag.tag}</li>
              ))}
            </ul>
            <div>
              <button type="button">Nope</button>
              <button type="button">Like</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
