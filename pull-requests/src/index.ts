import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { v4 } from "uuid";
import * as cors from "cors";

import { GraphQl } from "./graphql";
import {
  getRepository,
  insertRepository,
  setRepositoryComplete,
  deletePullRequests
} from "./database";
import { IRepositoryInsert } from "./interfaces";
import { getStatus } from "./redis";

const app: express.Application = express();
app.use(express.json({ strict: false }));
app.use(cors());

const httpApp: http.Server = new http.Server(app);
const port: number = 3000;

const server: http.Server = httpApp.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

const io: socketio.Server = socketio.listen(server);

const graphql: GraphQl = new GraphQl(io);

app.post("/repository", (req, res) => {
  console.log("Post to /repository");
  const taskId: string = v4();
  const name: string = req.body.repository_name;
  const userName: string = req.body.user_name;
  getRepository(name, userName).then(repository => {
    if (repository.id && repository.taskId) {
      setRepositoryComplete(repository.id, taskId, false);
      deletePullRequests(repository.id);
      graphql.createPullRequestTables(taskId, userName, name);
    } else {
      insertRepository({ name, userName, taskId }).then(() => {
        graphql.createPullRequestTables(taskId, userName, name);
      });
    }
  });

  res.send(taskId);
});

app.get("/repository/:name/:userName", async (req, res) => {
  const repository: IRepositoryInsert = await getRepository(
    req.params.name,
    req.params.userName
  );
  console.log(repository.complete);
  if (repository.complete) {
    res.send({
      repository_id: repository.id,
      task_id: repository.taskId,
      status: "SUCCESS"
    });
  } else if (repository && repository.taskId && repository.id) {
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
  socket.on("join", data => {
    console.log(`Room ${data["room"]} has been joined`);
    socket.join(data["room"]);
  });
});
