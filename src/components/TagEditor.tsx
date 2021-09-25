import Card from "react-bootstrap/Card";
import "../styles/tag-editor.css";

interface IProps {
  tags: string[];
  tagSearchText: string;
  tagSearchHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tagSelectHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  tagDeleteHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  tagMatches: string[];
}

export function TagEditor(props: IProps) {
  return (
    <>
      <div className="tag-editor-div">
        <span id="tags-container">
          {props.tags.map((element, index) => {
            return (
              <span className="tag-span" key={index}>
                <span className="tag-name">{element}</span>
                <button
                  className="tag-cancel-btn"
                  value={element}
                  type="button"
                  onClick={props.tagDeleteHandler}
                >
                  X
                </button>
              </span>
            );
          })}
        </span>

        <input
          type="text"
          value={props.tagSearchText}
          id="tag-input"
          onChange={props.tagSearchHandler}
          onKeyPress={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        />
      </div>
      {props.tagMatches.length !== 0 ? (
        <Card className="tag-matches-div-container" style={{ width: "18rem" }}>
          <Card.Body>
            {props.tagMatches.map((element, index) => (
              <button
                key={index}
                value={element}
                onClick={props.tagSelectHandler}
              >
                {element}
              </button>
            ))}
          </Card.Body>
        </Card>
      ) : (
        <div></div>
      )}
    </>
  );
}

// bootstrap toast can be used
