import { Server } from "socket.io";
import Redis from "ioredis";

//publish
const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: 21458,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
//subscribe
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: 21458,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

//class socket service
class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListners() {
    const io = this.io;
    console.log("Init Socket Listners....");
    io.on("connect", (socket) => {
      console.log("new Socket Connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message rec", message);
        //publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new msg from redis", message);
        io.emit("message", message);

        //DB store
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
