import { Button, Card, Badge } from "react-bootstrap";
import { IProject } from "../interfaces/project.interface";

interface IProps {
  project: IProject;
}

export function ProjectComp(props: IProps) {
  return (
    <div
      className="project"
      key={props.project.id}
      style={{ marginTop: "20px" }}
    >
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{props.project.title}</Card.Title>
          <Card.Text>{props.project.description}</Card.Text>
          <div>
            {props.project.tags?.map((tag) => (
              <Badge style={{ margin: "5px" }} key={tag.id} bg="secondary">
                {tag.tag}
              </Badge>
            ))}
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          ></div>
        </Card.Body>
      </Card>
    </div>
  );
}
