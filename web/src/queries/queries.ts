import gql from "graphql-tag";
import { DocumentNode } from "graphql";

export const COMPLEXITY_BY_FILE: DocumentNode = gql`
  query ComplexityByFile($repositoryId: Int!) {
    complexityByFile(repositoryId: $repositoryId) {
      name
      nloc
      complexity
    }
  }
`;

export const COMPLEXITY_BY_FUNCTION: DocumentNode = gql`
  query ComplexityByFunction($repositoryId: Int!) {
    complexityByFunction(repositoryId: $repositoryId) {
      name
      nloc
      complexity
    }
  }
`;
