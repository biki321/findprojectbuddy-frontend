import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ITag } from "../interfaces/tag.interface";
import { NavLink } from "react-router-dom";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import AutoTextArea from "./AutoTextArea";
import { TagEditor } from "./TagEditor";
import Button from "react-bootstrap/esm/Button";
// import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";
import { useHistory } from "react-router";
import { Redirect } from "react-router";

interface IDetails {
  tagSearchText: string;
  bio: string | null;
  tags: string[];
  tagMatches: string[];
  error: string;
}

export default function ProfilePage() {
  const { authState, logout } = useAuth();
  const [availableTags, setAvailableTags] = useState([] as string[]);
  const [tagToIdMap, setTagToIdMap] = useState({} as { [key: string]: number });
  const [details, setDetails] = useState({
    tagSearchText: "",
    bio: authState.user?.bio,
    tags: [],
    tagMatches: [],
    error: "",
  } as IDetails);
  const [loading, setLoading] = useState(true);
  const axiosIntercept = useAxiosIntercept();
  // const params = useParams();
  const history = useHistory();

  const tagSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setDetails({ ...details, tagSearchText: e.target.value });
    let matches: string[] = [];
    matches = availableTags.filter(
      (tag) => tag.includes(e.target.value) && !details.tags.includes(tag)
    );
    if (e.target.value === "") {
      matches = [];
    }
    console.log(matches);
    setDetails({
      ...details,
      tagSearchText: e.target.value,
      tagMatches: matches,
    });
  };

  const tagSelectHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const htmlBtnElement = e.target as HTMLButtonElement;
    setDetails((prevState) => ({
      ...details,
      tagMatches: [],
      tagSearchText: "",
      tags: [...prevState.tags, htmlBtnElement.value],
    }));
  };

  const tagDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const htmlBtnElement = e.target as HTMLButtonElement;
    console.log(details.tags.filter((tag) => tag === htmlBtnElement.value));
    setDetails((prevState) => ({
      ...details,
      tags: prevState.tags.filter((tag) => tag !== htmlBtnElement.value),
    }));
  };

  //hanlding update tags only for now
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosIntercept.patch(
        "/user/update",
        {
          bio: details.bio,
          tags: details.tags.map((tag) => tagToIdMap[tag]).filter((tag) => tag),
        },
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      console.log(data);

      setDetails({
        ...details,
        bio: data.bio,
        tags: data.tags.map((element: ITag) => element.tag),
      });
    } catch (error) {
      setDetails({ ...details, error: "could not update" });
    }
    setLoading(false);
  };

  const logoutHandle = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    logout(() => {
      console.log("logout callback");
      history.push("/");
    });
  };

  useEffect(() => {
    (async () => {
      console.log("useeffect at profile page");
      try {
        //get users tags
        let { data } = await axiosIntercept.get("/user/tags", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        setDetails({
          ...details,
          tags: data.map((element: ITag) => element.tag),
        });

        //get all the available tags to use for anybody
        ({ data } = await axiosIntercept.get("/tags", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }));
        console.log(data);
        const tagToId = Object.create({});
        data.forEach((element: ITag) => {
          tagToId[element.tag] = element.id;
        });
        console.log(tagToId);
        setTagToIdMap(tagToId);
        setAvailableTags(data.map((element: ITag) => element.tag));
      } catch (error) {
        setDetails({ ...details, error: "could not fetch" });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.accessToken, axiosIntercept]);

  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }
  console.log("profile page chekcing whether after logout this gets called");

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
    <div className="profile">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar src={authState.user?.avatar} sx={{ width: 80, height: 80 }} />
        <Typography variant="h6" gutterBottom component="div">
          {authState.user?.handle}
        </Typography>{" "}
      </div>
      <Typography variant="subtitle1" gutterBottom component="div">
        {authState.user?.name ? `name : ${authState.user.name}` : ""}
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="div">
        {authState.user?.email ? `email : ${authState.user.email}` : ""}
      </Typography>

      <form onSubmit={submitHandler}>
        {details.error}
        <div className="form-inner">
          <div className="form-group">
            <label htmlFor="Bio">Bio</label>
            <AutoTextArea
              onChange={(e) => setDetails({ ...details, bio: e.target.value })}
              minChars={0}
              maxChars={250}
              text={details.bio ? details.bio : ""}
              rows={1}
              required={false}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">tags</label>
            <TagEditor
              tags={details.tags}
              tagSearchText={details.tagSearchText}
              tagSearchHandler={tagSearchHandler}
              tagSelectHandler={tagSelectHandler}
              tagDeleteHandler={tagDeleteHandler}
              tagMatches={details.tagMatches}
            />
          </div>
        </div>

        <Button style={{ margin: "15px 0px" }} type="submit">
          Save
        </Button>
        <div></div>
        <NavLink to="/app/projects" style={{ textDecoration: "none" }}>
          <div>Projects</div>
        </NavLink>
      </form>
      <Button
        type="button"
        onClick={(e) => logoutHandle(e)}
        style={{ marginBottom: "20px" }}
      >
        Logout
      </Button>
    </div>
  );
}
