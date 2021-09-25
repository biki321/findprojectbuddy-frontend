import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosIntercept } from "../contexts/AxiosInterceptContext";
import { IMessage } from "../interfaces/message.interface";
import { IUser } from "../interfaces/user.interface";

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
}

export function ConversationComp({
  partner,
  data,
  handleSetMsgs,
  handleSendMsg,
}: IProps) {
  const axiosIntercept = useAxiosIntercept();
  const { authState } = useAuth();
  const [textmsg, setTextmsg] = useState("");

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
  }, []);

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

  return (
    <div className="conv-div">
      <div>
        <h6>{partner.handle}</h6>
      </div>
      {data.messages.map((msg) => (
        <div key={msg.id}>
          <div>{`receiverId:${msg.receiverId}`}</div>
          <div>{`senderId: ${msg.senderId}`}</div>
          <div>{`text:${msg.text}`}</div>
          <div>{`sent: ${msg.sent}`}</div>
          <br />
          <br />
        </div>
      ))}
      <form
        onSubmit={(e) =>
          handleSubmit(e, textmsg, partner.id, authState.user!.id)
        }
      >
        <input
          type="text"
          value={textmsg}
          onChange={(e) => setTextmsg(e.target.value)}
        />
        <button type="submit">send</button>
      </form>
    </div>
  );
}
