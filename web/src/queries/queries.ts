import gql from "graphql-tag";
import { DocumentNode } from "graphql";

export const COMPLEXITY_BY_FILE: DocumentNode = gql`
  query ComplexityByFile($repositoryId: Int!, $filePath: String) {
    complexityByFile(repositoryId: $repositoryId, filePath: $filePath) {
      name
      nloc
      complexity
    }
  }
`;

export const COMPLEXITY_BY_FUNCTION: DocumentNode = gql`
  query ComplexityByFunction($repositoryId: Int!, $filePath: String) {
    complexityByFunction(repositoryId: $repositoryId, filePath: $filePath) {
      name
      nloc
      complexity
    }
  }
`;

export const SEARCH_FILE_NAMES: DocumentNode = gql`
  query SearchFileNames($repositoryId: Int!, $name: String!) {
    searchFileName(repositoryId: $repositoryId, name: $name)
  }
`;

export const TIME_TO_CLOSE: DocumentNode = gql`
  query timeToClose($repositoryId: Int!) {
    timeToClose(repositoryId: $repositoryId) {
      daysToClose
      numberOfPullRequests
    }
  }
`;

export const TOP_ADDITIONS: DocumentNode = gql`
  query topAdditions($repositoryId: Int!) {
    topAdditions(repositoryId: $repositoryId) {
      title
      lineChanges
    }
  }
`;

export const TOP_DELETIONS: DocumentNode = gql`
  query topDeletions($repositoryId: Int!) {
    topDeletions(repositoryId: $repositoryId) {
      title
      lineChanges
    }
  }
`;

export const COMMIT_COUNT: DocumentNode = gql`
  query commitCount($repositoryId: Int!) {
    commitCount(repositoryId: $repositoryId) {
      commitCount
      numberOfPullRequests
    }
  }
`;
