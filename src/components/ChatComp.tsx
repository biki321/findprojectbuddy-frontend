import Avatar from "@mui/material/Avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { useSocketContext } from "../contexts/SocketContext";
import { IMessage } from "../interfaces/message.interface";
import { IUser } from "../interfaces/user.interface";
import { ConversationComp } from "./ConversationComp";
import { Card, Spinner } from "react-bootstrap";
import "../styles/chatComp.css";
import { Redirect } from "react-router";

//page null means messages for userId have not been fetched
//even a single time
interface IDetails {
  partnerId: number;
  messages: IMessage[];
  page: null | number;
}

export function ChatComp() {
  const { socket } = useSocketContext();
  const [friends, _setFriends] = useState([] as IUser[]);
  const [details, _setDetails] = useState([] as IDetails[]);
  const [currentConvUserId, setCurrentConvUserId] = useState<null | number>(
    null
  );
  const [loading, setLoading] = useState(true);
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();

  const detailsRef = useRef(details);
  const setDetails = (x: IDetails[]) => {
    detailsRef.current = x; // keep updated
    _setDetails(x);
  };

  const friendsRef = useRef(friends);
  const setFriends = (x: IUser[]) => {
    friendsRef.current = x; // keep updated
    _setFriends(x);
  };

  const onMsgReceiveHandler = useCallback(
    ({ text, senderId, receiverId, id, sent }: IMessage) => {
      console.log("text at onMsgReceiveHandler", text);
      console.log("details at onMsgReceiveHandler ", detailsRef);
      console.log("frnds at onMsgReceiveHandler ", friendsRef);

      setDetails(
        detailsRef.current.map((element) =>
          element.partnerId === senderId
            ? {
                ...element,
                messages: [
                  ...element.messages,
                  {
                    text: text,
                    senderId: senderId,
                    receiverId: receiverId,
                    id: id,
                    sent: sent,
                  },
                ],
              }
            : element
        )
      );
    },
    []
  );

  useEffect(() => {
    console.log("useeffec at chatcomp\n");
    console.log("socket at chatcomp usueeffect", socket);

    (async () => {
      try {
        const friendsRes = await axiosIntercept.get("/chat/friends", {
          headers: {
            Authorization: `token ${authState.accessToken}`,
          },
        });
        console.log("friends at chat comp", friendsRes);
        setFriends(friendsRes.data);
        setDetails(
          friendsRes.data.map((element: IUser) => ({
            partnerId: element.id,
            messages: [],
            page: null,
          }))
        );
      } catch (error) {}
      setLoading(false);
    })();

    socket?.onAny((event, ...args) => {
      console.log("from chat app comp all events", event, args);
    });

    socket?.on("connect_error", (err) => {
      console.log(err);
    });

    socket?.on("message", onMsgReceiveHandler);

    return () => {
      socket?.off("connect_error");
      socket?.off("message");
      socket?.offAny();
    };
  }, [authState.accessToken, axiosIntercept, onMsgReceiveHandler, socket]);

  const handleSendMsg = (
    text: string,
    receiverId: number,
    senderId: number
  ) => {
    socket?.emit("message", {
      text: text,
      receiverId: receiverId,
      senderId: senderId,
    });

    setDetails(
      details.map((element) =>
        element.partnerId === receiverId
          ? {
              ...element,
              messages: [
                ...element.messages,
                {
                  text: text,
                  senderId: senderId,
                  receiverId: receiverId,
                },
              ],
            }
          : element
      )
    );
    console.log("details at handleSendMSg", details);
  };

  const handleSetDetailsFromChild = (
    messages: IMessage[],
    partnerId: number,
    page: number
  ) => {
    setDetails(
      details.map((element) =>
        element.partnerId === partnerId
          ? {
              ...element,
              page: page,
              messages: [...messages, ...element.messages],
            }
          : element
      )
    );
  };
  const handleBackBtnFromConv = () => {
    setCurrentConvUserId(null);
  };

  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="chat-div">
      {loading ? (
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
      ) : currentConvUserId ? (
        <ConversationComp
          partner={friends.find((element) => element.id === currentConvUserId)!}
          data={
            details.find((element) => element.partnerId === currentConvUserId)!
          }
          handleSetMsgs={handleSetDetailsFromChild}
          handleSendMsg={handleSendMsg}
          handleBackBtnFromConv={handleBackBtnFromConv}
        />
      ) : (
        <div className="friends-div">
          {friends.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <div>You do not have anybody to message</div>
            </div>
          ) : (
            friends.map((friend: IUser) => (
              <div className="friends-inner-div" key={friend.id}>
                <Card onClick={(e) => setCurrentConvUserId(friend.id)}>
                  <Card.Body
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                    }}
                  >
                    <Avatar
                      src={friend.avatar ?? undefined}
                      sx={{ width: 50, height: 50 }}
                    />
                    <div style={{}}>
                      <div
                        style={{ margin: "auto 20px", fontWeight: "bolder" }}
                      >
                        {friend.name ?? friend.handle}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
