import { IUser } from "../interfaces/user.interface";
import { ITag } from "../interfaces/tag.interface";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Badge from "react-bootstrap/Badge";

interface IProps {
  user: IUser;
}
export function ProfileComp({ user }: IProps) {
  return (
    <div className="profile">
      <Avatar src={user.avatar ?? undefined} sx={{ width: 80, height: 80 }} />
      <Typography variant="h6" gutterBottom component="div">
        {user.handle}
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="div">
        {user.name ? `name : ${user.name}` : ""}
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="div">
        {user?.email ? `email : ${user.email}` : ""}
      </Typography>
      <div>
        {user.tags?.map((tag: ITag) => (
          <Badge style={{ margin: "5px" }} key={tag.id} bg="secondary">
            {tag.tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
