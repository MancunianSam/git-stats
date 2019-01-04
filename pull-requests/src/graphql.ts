import { gql, ObservableQuery } from "apollo-boost";
import { IData, IEdge } from "./interfaces";
import { ApolloLink } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as socketio from "socket.io";

import { insertPullRequests } from "./database";

const link: ApolloLink = createHttpLink({
  uri: "https://api.github.com/graphql",
  headers: { Authorization: `bearer ${process.env["TOKEN"]}` },
  fetch
});

const cache: InMemoryCache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

export const createPullRequestTables: (
  uuid: string,
  owner: string,
  name: string,
  io: socketio.Server
) => void = async (uuid, owner, name, io) => {
  const query: ObservableQuery<IData> = client.watchQuery({
    query: gql`
      query PullRequests($cursor: String, $owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          pullRequests(first: 50, after: $cursor) {
            totalCount
            pageInfo {
              endCursor
            }
            edges {
              node {
                createdAt
                closedAt
                title
                author {
                  login
                }
                merged
                additions
                deletions
                commits {
                  totalCount
                }
              }
              cursor
            }
          }
        }
      }
    `,
    variables: { cursor: null, owner, name }
  });

  query.subscribe(result => {
    const lastCursor: string =
      result.data.repository.pullRequests.pageInfo.endCursor;
    const totalCount: number = result.data.repository.pullRequests.totalCount;
    if (!lastCursor) {
      insertPullRequests(result.data.repository.pullRequests.edges);
      io.to(uuid).emit("update", "DONE");
      return;
    }
    query.fetchMore({
      variables: { cursor: lastCursor, owner, name },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newResult: IData = fetchMoreResult as IData;
        const newPullRequests: IEdge[] =
          newResult.repository.pullRequests.edges;
        const oldPullRequests: IEdge[] =
          previousResult.repository.pullRequests.edges;
        const totalProcessed: number = oldPullRequests
          ? oldPullRequests.length
          : newPullRequests.length;
        const totalProgress: number = (totalProcessed / totalCount) * 100;

        io.emit("update", { status: "RUNNING", totalProgress });

        return {
          repository: {
            pullRequests: {
              totalCount,
              __typename: newResult.repository.pullRequests.__typename,
              pageInfo: {
                __typename:
                  newResult.repository.pullRequests.pageInfo.__typename,
                endCursor: newResult.repository.pullRequests.pageInfo.endCursor
              },
              edges: [
                ...previousResult.repository.pullRequests.edges,
                ...newPullRequests
              ]
            },
            __typename: newResult.repository.__typename
          }
        };
      }
    });
  });
};
