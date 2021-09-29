import Avatar from "@mui/material/Avatar";
import { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { IMessage } from "../interfaces/message.interface";
import { IUser } from "../interfaces/user.interface";
import "../styles/conversationComp.css";
import AutoTextArea from "./AutoTextArea";
import { RiSendPlane2Fill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import { Redirect } from "react-router";

interface IProps {
  partner: IUser;
  data: {
    partnerId: number;
    messages: IMessage[];
    page: null | number;
  };
  handleSetMsgs: (
    messages: IMessage[],
    partnerId: number,
    page: number
  ) => void;
  handleSendMsg: (text: string, receiverId: number, senderId: number) => void;
  handleBackBtnFromConv: () => void;
}

export function ConversationComp({
  partner,
  data,
  handleSetMsgs,
  handleSendMsg,
  handleBackBtnFromConv,
}: IProps) {
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();
  const [textmsg, setTextmsg] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useeffect at convcomp");
    if (!data.page) {
      console.log("useeffect at convcomp: data page", data.page);
      (async () => {
        try {
          const messagesRes = await fetchMsgs(partner.id);
          console.log(messagesRes.data);
          handleSetMsgs(messagesRes.data, partner.id, 1);
        } catch (error) {}
      })();
    }
    scrollToBottom();
    setLoading(false);
  }, [data]);

  const scrollToBottom = () => {
    messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  function fetchMsgs(partnerId: number) {
    return axiosIntercept.get(`/chat/messages/${partnerId}`, {
      headers: {
        Authorization: `token ${authState.accessToken}`,
      },
    });
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    receiverId: number,
    senderId: number
  ) {
    e.preventDefault();
    console.log("submit msg");
    setTextmsg("");
    handleSendMsg(text, receiverId, senderId);
  }
  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="conv-div" style={{}}>
      <div className="messageToPerson">
        <div className="backbtn" onClick={handleBackBtnFromConv}>
          <BiArrowBack style={{ color: "white" }} />
        </div>
        <Avatar
          src={partner.avatar ?? undefined}
          sx={{ width: 45, height: 45 }}
        />
        <div style={{ margin: "auto 20px", fontWeight: "bolder" }}>
          {partner.name ?? partner.handle}
        </div>
      </div>

      <div className="messageBox">
        {data.messages.map((msg, index) => (
          <p
            key={index}
            className={`messageText ${
              msg.senderId === authState.user!.id
                ? "ownMessage"
                : "otherMessage"
            }`}
          >
            {msg.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="messageSendForm"
        onSubmit={(e) =>
          handleSubmit(e, textmsg, partner.id, authState.user!.id)
        }
      >
        <div className="messageSendDiv">
          <AutoTextArea
            onChange={(e) => setTextmsg(e.target.value)}
            minChars={0}
            maxChars={1000}
            text={textmsg}
            rows={1}
            required={false}
            placeholder="Type a message"
            style={{ borderRadius: "30px" }}
          />
          <div className="msgSendBtnDiv">
            <button type="submit">
              <RiSendPlane2Fill style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
