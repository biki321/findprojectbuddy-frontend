import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { IProject } from "../interfaces/project.interface";
import { ITag } from "../interfaces/tag.interface";

interface IDetails {
  projectData: {
    title: string;
    description: string;
    tags: string[];
  };
  tagMatches: string[];
  tagSearchText: string;
  error: string;
  isFormValid: boolean;
}

export function CreateProject() {
  const { authState } = useAuth();
  const [details, setDetails] = useState({
    projectData: { title: "", description: "", tags: [] },
    error: "",
    tagMatches: [],
    tagSearchText: "",
    isFormValid: false,
  } as IDetails);
  const [availableTags, setAvailableTags] = useState([] as string[]);
  const [tagToIdMap, setTagToIdMap] = useState({} as { [key: string]: number });
  const axiosIntercept = useAxiosIntercept();

  const tagSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let matches: string[] = [];
    matches = availableTags.filter(
      (tag) =>
        tag.includes(e.target.value) && !details.projectData.tags.includes(tag)
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
      projectData: {
        ...details.projectData,
        tags: [...prevState.projectData.tags, htmlBtnElement.value],
      },
    }));
  };

  const tagDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const htmlBtnElement = e.target as HTMLButtonElement;
    console.log(
      details.projectData.tags.filter((tag) => tag === htmlBtnElement.value)
    );
    setDetails((prevState) => ({
      ...details,
      projectData: {
        ...details.projectData,
        tags: prevState.projectData.tags.filter(
          (tag) => tag !== htmlBtnElement.value
        ),
      },
    }));
  };

  //hanlding update tags only for now
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!details.isFormValid) return;
    try {
      const { data } = await axiosIntercept.post(
        "/projects/create",
        {
          title: details.projectData.title,
          description: details.projectData.description,
          tags: details.projectData.tags
            .map((tag) => tagToIdMap[tag])
            .filter((tag) => tag),
        },
        {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        }
      );
      console.log(data);
      setDetails({
        projectData: { title: "", description: "", tags: [] },
        error: "",
        tagMatches: [],
        tagSearchText: "",
        isFormValid: false,
      });
    } catch (error) {
      setDetails({ ...details, error: "could not update" });
    }
  };

  useEffect(() => {
    (async () => {
      console.log("useeffect at create project pagge");
      try {
        //get all the available tags to use for anybody
        const { data } = await axiosIntercept.get("/tags", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
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
    <form onSubmit={submitHandler}>
      {details.error}
      <div className="form-inner">
        <h2>Create Project</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={details.projectData.title}
            onChange={(e) =>
              setDetails({
                ...details,
                projectData: { ...details.projectData, title: e.target.value },
                error:
                  e.target.value.length < 10 || e.target.value.length > 250
                    ? "title should be between 10 to 250 characters"
                    : "",
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={details.projectData.description}
            onChange={(e) =>
              setDetails({
                ...details,
                projectData: {
                  ...details.projectData,
                  description: e.target.value,
                },
                error:
                  e.target.value.length < 10 || e.target.value.length > 500
                    ? "title should be between 10 to 500 characters"
                    : "",
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">tags</label>
          <div className="tag-editor-div">
            <span id="tags-container">
              {details.projectData.tags.map((element, index) => {
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
        <button type="submit">Create</button>
      </div>
    </form>
  );
}
