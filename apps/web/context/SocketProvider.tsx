"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => void;
  messages: Messages[];
}

interface Messages {
  text: string;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) throw new Error("State undefined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Messages[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("send msg : ", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log("From server msg rec", msg);

    const message = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, { text: message.message }]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");

    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(null);
    };
  }, [onMessageRec]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
