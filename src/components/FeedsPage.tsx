import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { IFeed } from "../interfaces/feed.interface";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { FeedComp } from "./FeedComp";

export default function FeedsPage() {
  const { authState } = useAuth();
  const [feeds, setFeeds] = useState<IFeed[]>([]);
  const [errorMsg, setError] = useState("");
  const axiosIntercept = useAxiosIntercept();

  useEffect(() => {
    (async () => {
      console.log("useeffect at home ");
      try {
        const res = await axiosIntercept.get("/feed", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        console.log(res.data);
        setFeeds(res.data);
        setError("");
      } catch (error) {
        setError("server error");
      }
    })();
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
      setFeeds(
        feeds.map((element) =>
          element.id === feedId ? { ...element, status: "rejected" } : element
        )
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  const like = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    feedId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(`/feed/like/${projectId}`, {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      setFeeds(
        feeds.map((element) =>
          element.id === feedId ? { ...element, status: "liked" } : element
        )
      );
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  if (authState.isLoading) {
    return <div>Loading</div>;
  }

  console.log("is auth at feed page", authState.isAuthenticated);

  return (
    <div className="feeds-page">
      <div className=""></div>
      <div className="feeds">
        <div>{errorMsg}</div>
        {feeds.length === 0 ? "no feed available" : ""}
        {feeds.map((element) => (
          <FeedComp
            key={element.id}
            feed={element}
            like={like}
            reject={reject}
          />
        ))}
      </div>
    </div>
  );
}
