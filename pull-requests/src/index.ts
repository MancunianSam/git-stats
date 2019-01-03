import * as express from "express";
import * as http from "http";
import { promisify } from "util";
import { v4 } from "uuid";
import * as socketio from "socket.io";

const app: express.Application = express();
const httpApp: http.Server = new http.Server(app);
const port: number = 3000;

const server: any = httpApp.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

const io: socketio.Server = socketio.listen(server);

app.get("/", (_, res) => {
  const uuid: string = v4();
  createPullRequestTables(uuid);
  res.send(uuid);
});

const createPullRequestTables: (uuid: string) => void = async uuid => {
  io.to(uuid).emit("update", "RUNNING");
  //Some things to create aggregate pull request data
};

io.on("connection", socket => {
  console.log("A user connected");
  socket.on("join room", data => {
    socket.join(data);
  });
});
