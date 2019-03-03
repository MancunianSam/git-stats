import * as knex from "knex";
import { IEdge, IPullRequestInsert, IRepositoryInsert } from "./interfaces";
import { setStatus } from "./redis";

const toSnakeCase: (str: string) => string = str => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

const connection = knex({
  client: "mysql",
  wrapIdentifier: (value, origImpl, _) => origImpl(toSnakeCase(value)),
  connection: {
    host: "localhost",
    user: "root",
    database: "git_stats"
  }
});

export const insertRepository: (
  repository: IRepositoryInsert
) => Promise<void> = async ({ name, userName, taskId }) => {
  await connection("pull_requests_repository").insert({
    name,
    userName,
    taskId
  });
};

export const setRepositoryComplete: (
  id: number,
  taskId: string,
  complete?: boolean
) => void = (id, taskId, complete = true) => {
  connection("pull_requests_repository")
    .where({ id })
    .update({ complete, taskId })
    .catch(err => console.log(err));
  setStatus(taskId, complete ? "SUCCESS" : "RUNNING");
};

export const getRepository: (
  name: string,
  userName: string
) => Promise<IRepositoryInsert> = async (name, userName) => {
  return await connection
    .select()
    .from("pull_requests_repository")
    .where("name", name)
    .where("userName", userName)
    .then(data => {
      if (data[0]) {
        const { id, name, task_id, user_name, complete } = data[0];
        return {
          id,
          name,
          taskId: task_id,
          userName: user_name,
          complete
        };
      }
      return {};
    });
};

export const deletePullRequests: (
  repositoryId: number
) => void = repositoryId => {
  connection("pull_requests")
    .where("repository_id", repositoryId)
    .del()
    .catch(d => console.log(d));
};

export const insertPullRequests: (
  edges: IEdge[],
  repositoryId: number
) => void = (edges, repositoryId) => {
  const pullRequests: IPullRequestInsert[] = edges.map(edge => {
    const {
      createdAt,
      closedAt,
      title,
      merged,
      additions,
      deletions
    } = edge.node;
    return {
      repositoryId,
      createdAt,
      closedAt,
      title,
      merged,
      additions,
      deletions,
      commits: edge.node.commits.totalCount,
      author: edge.node.author.login
    };
  });
  connection("pull_requests")
    .insert(pullRequests)
    .catch(err => console.log(err));
};
