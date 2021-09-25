import axios, { AxiosRequestConfig } from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import jwt_decode from "jwt-decode";
import { IJwtPayload } from "../interfaces/iJwtPayload.interface";
import { useAuth } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface IProps {
  children: JSX.Element;
}

interface IContext {
  socket: Socket;
}

const SocketContext = React.createContext<Partial<IContext>>({});

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({ children }: IProps) {
  const { authState } = useAuth();
  const [socketObj, setSocket] = useState<Partial<IContext>>({});

  // On the client side you add the authorization header like this:
  let socketOptions = useMemo(
    () => ({
      withCredentials: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `token ${authState.accessToken}`, //'Bearer h93t4293t49jt34j9rferek...'
          },
        },
      },
    }),
    [authState.accessToken]
  );

  useEffect(() => {
    console.log("sueeffect at sockt context");
    // if (authState.accessToken) {
    const newSocket = io("http://localhost:8080", socketOptions);
    setSocket({ socket: newSocket });

    // socket.emit("message", "hello server");
    console.log("socket at context", newSocket);

    return () => {
      socketObj.socket?.disconnect();
    };
    // }
  }, [socketOptions]);

  return (
    <SocketContext.Provider value={{ socket: socketObj.socket }}>
      {children}
    </SocketContext.Provider>
  );
}

// socket.handshake.headers.authorization,
