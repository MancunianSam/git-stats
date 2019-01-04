interface IPageInfo {
  __typename?: string;
  endCursor: string;
}

interface ICommits {
  __typename?: string;
  totalCount: number;
}

interface IAuthor {
  __typename?: string;
  login: string;
}

interface INode {
  __typename?: string;
  createdAt: string;
  closedAt: string;
  title: string;
  author: IAuthor;
  merged: boolean;
  additions: number;
  deletions: number;
  commits: ICommits;
}

export interface IEdge {
  __typename?: string;
  node: INode;
}

interface IPullRequests {
  __typename?: string;
  totalCount: number;
  pageInfo: IPageInfo;
  edges: IEdge[];
}

export interface IPullRequestInsert {
  createdAt: string;
  closedAt: string;
  title: string;
  author: string;
  merged: boolean;
  additions: number;
  deletions: number;
  commits: number;
}

interface IRepository {
  __typename?: string;
  pullRequests: IPullRequests;
}
export interface IData {
  repository: IRepository;
}
