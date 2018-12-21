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
