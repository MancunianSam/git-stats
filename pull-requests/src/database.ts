import * as knex from "knex";
import { IEdge, IPullRequestInsert } from "./interfaces";

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

export const insertPullRequests: (edges: IEdge[]) => void = edges => {
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
