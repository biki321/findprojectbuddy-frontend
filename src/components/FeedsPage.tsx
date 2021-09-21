import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { IFeed } from "../interfaces/feed.interface";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";

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
        setError("no feed available");
      }
    })();
  }, []);

  const reject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(`/feed/reject/${projectId}`, {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
      setError("");
    } catch (error) {
      setError("server error");
    }
  };

  const like = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number
  ) => {
    e.preventDefault();
    try {
      await axiosIntercept.get(`/feed/like/${projectId}`, {
        headers: {
          Authorization: `token ${authState.accessToken}`,
        },
      });
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
              <button type="button" onClick={(e) => reject(e, element.id)}>
                Reject
              </button>
              <button type="button" onClick={(e) => like(e, element.id)}>
                Like
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
