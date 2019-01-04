import * as express from "express";
import * as http from "http";
import { v4 } from "uuid";
import * as socketio from "socket.io";
import { createPullRequestTables } from "./graphql";

const app: express.Application = express();
const httpApp: http.Server = new http.Server(app);
const port: number = 3000;

const server: any = httpApp.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

const io: socketio.Server = socketio.listen(server);

app.get("/", (_, res) => {
  // const uuid: string = v4();
  const uuid: string = "e0f4e605-e0a0-42d3-be46-cd064ebe75bf";
  createPullRequestTables(uuid, "withspectrum", "spectrum", io);
  res.send(uuid);
});

io.on("connect", socket => {
  console.log("A user connected");
  socket.on("join room", data => {
    console.log(`Room ${data["room"]} has been joined`);
    socket.join(data["room"]);
  });
});
