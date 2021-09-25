import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { ITag } from "../interfaces/tag.interface";
import AutoTextArea from "./AutoTextArea";
import { TagEditor } from "./TagEditor";

interface IDetails {
  projectData: {
    title: string;
    description: string;
    tags: string[];
  };
  tagMatches: string[];
  tagSearchText: string;
  error: string;
}

export function CreateProject() {
  const { authState } = useAuth();
  const [details, setDetails] = useState({
    projectData: { title: "", description: "", tags: [] },
    error: "",
    tagMatches: [],
    tagSearchText: "",
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
    if (details.projectData.title.length < 10) {
      setDetails({ ...details, error: "title should be more than 10" });
      return;
    }
    if (details.projectData.description.length < 10) {
      setDetails({ ...details, error: "description should be more than 10" });
      return;
    }
    if (details.projectData.tags.length < 1) {
      setDetails({ ...details, error: "at least 1 tag needed" });
      return;
    }

    console.log(isFormValid());
    if (!isFormValid()) return;

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
      });
    } catch (error) {
      setDetails({ ...details, error: "could not create" });
    }
  };

  const isFormValid = (): boolean => {
    return (
      details.projectData.title.length >= 10 &&
      details.projectData.title.length <= 250 &&
      details.projectData.description.length >= 10 &&
      details.projectData.description.length <= 500 &&
      details.projectData.tags.length >= 1
    );
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
        setDetails({ ...details, error: "" });
      } catch (error) {
        setDetails({ ...details, error: "could not fetch" });
      }
    })();
  }, []);

  return (
    <form onSubmit={submitHandler}>
      <div className="form-inner">
        <h2>Create Project</h2>
        <div style={{ color: "#FAC62B" }}>{details.error}</div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <AutoTextArea
            onChange={(e) =>
              setDetails({
                ...details,
                projectData: { ...details.projectData, title: e.target.value },
                error:
                  details.projectData.title.length > 250
                    ? "title should be below 250"
                    : "",
              })
            }
            minChars={10}
            maxChars={250}
            text={details.projectData.title}
            rows={1}
            required={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <AutoTextArea
            required={true}
            minChars={10}
            maxChars={500}
            text={details.projectData.description}
            onChange={(e) =>
              setDetails({
                ...details,
                projectData: {
                  ...details.projectData,
                  description: e.target.value,
                },
                error:
                  details.projectData.description.length > 500
                    ? "description should be below 250"
                    : "",
              })
            }
            rows={2}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">tags</label>
          <TagEditor
            tags={details.projectData.tags}
            tagSearchText={details.tagSearchText}
            tagSearchHandler={tagSearchHandler}
            tagSelectHandler={tagSelectHandler}
            tagDeleteHandler={tagDeleteHandler}
            tagMatches={details.tagMatches}
          />
        </div>

        <Button style={{ margin: "15px 0px" }} type="submit">
          Create
        </Button>
      </div>
    </form>
  );
}
