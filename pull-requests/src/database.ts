import * as knex from "knex";
import { IEdge, IPullRequestInsert, IRepositoryInsert } from "./interfaces";

const toSnakeCase: (str: string) => string = str => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

const connection = knex({
  client: "mysql",
  wrapIdentifier: (value, origImpl, _) => origImpl(toSnakeCase(value)),
  connection: {
    host: "localhost",
    user: "root",
    database: "git_stats_pull_requests"
  }
});

export const insertRepository: (
  repository: IRepositoryInsert
) => Promise<void> = async ({ name, userName, taskId }) => {
  await connection("repository").insert({ name, userName, taskId });
};

export const setRepositoryComplete: (id: number, complete?: boolean) => void = (
  id,
  complete = true
) => {
  connection("repository")
    .where({ id })
    .update({ complete })
    .catch(err => console.log(err));
};

export const getRepository: (
  name: string,
  userName: string
) => Promise<IRepositoryInsert> = async (name, userName) => {
  return await connection
    .select()
    .from("repository")
    .where("name", name)
    .where("userName", userName)
    .then(data => {
      if (data[0]) {
        const { id, name, task_id, user_name } = data[0];
        return {
          id,
          name,
          taskId: task_id,
          userName: user_name
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
