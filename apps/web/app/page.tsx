"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();

  console.log(messages);
  const [message, setMessage] = useState("");
  return (
    <div >
      <div>
        {messages.map((e) => (
          <li>{e.text}</li>
        ))}
      </div>
      <div className={classes['container']}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className={classes["chat-input"]}
          placeholder="Message...."
          type="text"
        />
        <button
          onClick={(e) => sendMessage(message)}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
      
    </div>
  );
}
