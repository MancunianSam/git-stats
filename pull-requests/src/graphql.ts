import { gql, ObservableQuery } from "apollo-boost";
import { IData, IEdge, IEmitObject } from "./interfaces";
import {
  ApolloClient,
  OperationVariables,
  WatchQueryOptions,
  FetchMoreQueryOptions
} from "apollo-client";
import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as socketio from "socket.io";

import {
  insertPullRequests,
  getRepository,
  setRepositoryComplete
} from "./database";
import { setStatus } from "./redis";

export class GraphQl {
  private io: socketio.Server;
  constructor(io: socketio.Server) {
    this.io = io;
  }

  private client = new ApolloClient({
    link: createHttpLink({
      uri: "https://api.github.com/graphql",
      headers: { Authorization: `bearer ${process.env["TOKEN"]}` },
      fetch
    }),
    cache: new InMemoryCache()
  });

  emitMessage: (obj: IEmitObject, io: socketio.Server, uuid: string) => void = (
    obj,
    io,
    uuid
  ) => {
    console.log(obj);
    io.to(uuid).emit("update", obj);
  };

  private getWatchQueryOptions: (
    owner: string,
    name: string
  ) => WatchQueryOptions = (owner, name) => {
    return {
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
    };
  };

  createPullRequestTables: (
    uuid: string,
    owner: string,
    name: string
  ) => void = async (uuid, owner, name) => {
    getRepository(name, owner).then(repository => {
      const repositoryId: number = repository ? (repository.id as number) : 0;
      const query: ObservableQuery<IData> = this.client.watchQuery(
        this.getWatchQueryOptions(owner, name)
      );

      query.subscribe(result => {
        const lastCursor: string =
          result.data.repository.pullRequests.pageInfo.endCursor;
        const totalCount: number =
          result.data.repository.pullRequests.totalCount;
        if (!lastCursor) {
          insertPullRequests(
            result.data.repository.pullRequests.edges,
            repositoryId
          );
          this.emitMessage(
            { state: "SUCCESS", complete: 100, repositoryId },
            this.io,
            uuid
          );
          setRepositoryComplete(repositoryId);
          setStatus(uuid, "COMPLETE");
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
            const complete: number = (totalProcessed / totalCount) * 100;

            this.emitMessage(
              { state: "RUNNING", complete, repositoryId },
              this.io,
              uuid
            );
            setStatus(uuid, "RUNNING");

            return {
              repository: {
                pullRequests: {
                  totalCount,
                  __typename: newResult.repository.pullRequests.__typename,
                  pageInfo: {
                    __typename:
                      newResult.repository.pullRequests.pageInfo.__typename,
                    endCursor:
                      newResult.repository.pullRequests.pageInfo.endCursor
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
    });
  };
}
