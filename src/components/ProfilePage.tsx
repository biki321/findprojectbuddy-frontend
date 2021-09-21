import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ITag } from "../interfaces/tag.interface";
import { NavLink } from "react-router-dom";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";

interface IDetails {
  tagSearchText: string;
  bio: string | null;
  tags: string[];
  tagMatches: string[];
  error: string;
}

export default function ProfilePage() {
  const { authState } = useAuth();
  const [availableTags, setAvailableTags] = useState([] as string[]);
  const [tagToIdMap, setTagToIdMap] = useState({} as { [key: string]: number });
  const [details, setDetails] = useState({
    tagSearchText: "",
    bio: authState.user?.bio,
    tags: [],
    tagMatches: [],
    error: "",
  } as IDetails);
  const axiosIntercept = useAxiosIntercept();

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
    })();
  }, []);

  return (
    <div className="profile">
      <Avatar src={authState.user?.avatar} sx={{ width: 80, height: 80 }} />
      <Typography variant="h6" gutterBottom component="div">
        {authState.user?.handle}
      </Typography>
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
            <textarea
              name="bio"
              id="bio-textarea"
              cols={30}
              rows={1}
              onChange={(e) => setDetails({ ...details, bio: e.target.value })}
              value={details.bio ? details.bio : ""}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="tags">tags</label>
            <div className="tag-editor-div">
              <span id="tags-container">
                {details.tags.map((element, index) => {
                  return (
                    <span key={index}>
                      <span>{element}</span>
                      <button
                        value={element}
                        type="button"
                        onClick={tagDeleteHandler}
                      >
                        X
                      </button>
                    </span>
                  );
                })}
              </span>

              <input
                type="text"
                value={details.tagSearchText}
                id="tag-input"
                onChange={tagSearchHandler}
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
              />
            </div>
          </div>

          {details.tagMatches.length !== 0 ? (
            <div className="tag-matches-div-container">
              {details.tagMatches.map((element, index) => (
                <button key={index} value={element} onClick={tagSelectHandler}>
                  {element}
                </button>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <button type="submit">Save</button>

        <NavLink to="/app/projects">Projects</NavLink>
      </form>
    </div>
  );
}
