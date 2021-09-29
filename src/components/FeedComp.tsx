import { Card, Button, Badge } from "react-bootstrap";
import { IFeed } from "../interfaces/feed.interface";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";

interface IProps {
  feed: IFeed;
  like: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    feedId: number
  ) => Promise<void>;
  reject: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectId: number,
    feedId: number
  ) => Promise<void>;
}

export function FeedComp({ feed, like, reject }: IProps) {
  return (
    <div className="feed" key={feed.id} style={{ marginTop: "20px" }}>
      <Card style={{}}>
        <Card.Body>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={feed.projectOwner.avatar ?? undefined}
              sx={{ width: 40, height: 40 }}
            />
            <NavLink
              to={`/app/profile/${feed.projectOwner.id}`}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "11px",
                fontWeight: "bolder",
                margin: "0px 5px",
              }}
            >
              {feed.projectOwner.handle}
            </NavLink>
          </div>
          <Card.Title>{feed.project.title}</Card.Title>
          <Card.Text>{feed.project.description}</Card.Text>
          <div>
            {feed.project?.tags?.map((tag) => (
              <Badge style={{ margin: "5px" }} key={tag.id} bg="secondary">
                {tag.tag}
              </Badge>
            ))}
          </div>{" "}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              active={feed.status === "liked" ? true : false}
              type="button"
              variant="outline-primary"
              size="sm"
              onClick={(e) => like(e, feed.project.id, feed.id)}
            >
              Like
            </Button>
            <Button
              active={feed.status === "rejected" ? true : false}
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={(e) => reject(e, feed.project.id, feed.id)}
            >
              Nope
            </Button>{" "}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
