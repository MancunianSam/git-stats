import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

import { GraphQl } from "./graphql";
import {
  getRepository,
  insertRepository,
  setRepositoryComplete
} from "./database";
import { IRepositoryInsert } from "./interfaces";
import { getStatus, setStatus } from "./redis";

const app: express.Application = express();
app.use(express.json({ strict: false }));

const httpApp: http.Server = new http.Server(app);
const port: number = 3000;

const server: http.Server = httpApp.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

const io: socketio.Server = socketio.listen(server);

const graphql: GraphQl = new GraphQl(io);

app.post("/repository", (req, res) => {
  // const uuid: string = v4();
  const taskId: string = "e0f4e605-e0a0-42d3-be46-cd064ebe75bf";
  const name: string = req.body.repository_name;
  const userName: string = req.body.user_name;
  insertRepository({ name, userName, taskId }).then(() => {
    graphql.createPullRequestTables(taskId, userName, name);
  });
  res.send(taskId);
});

app.get("/:name/:userName", async (req, res) => {
  const repository: IRepositoryInsert = await getRepository(
    req.params.name,
    req.params.userName
  );
  if (repository && repository.taskId && repository.id) {
    const result: any = {
      repository_id: repository.id,
      task_id: repository.taskId,
      status: await getStatus(repository.taskId)
    };
    res.send(result);
  } else {
    res.send("ERROR");
  }
});

io.on("connect", socket => {
  console.log("A user connected");
  socket.on("join room", data => {
    console.log(`Room ${data["room"]} has been joined`);
    socket.join(data["room"]);
  });
});
