import * as React from "react";

import { GitStatsSelection } from "./Components/GitStatsSelection";

export const PullRequests: React.FunctionComponent<{}> = (props: any) => {
  const updateParentState: (complete: boolean, repository: number) => void = (
    complete,
    repository
  ) => {
    console.log(complete);
    console.log(repository);
  };
  return (
    <GitStatsSelection
      updateParentState={updateParentState}
      wsUrl="http://localhost:3000"
      workerHost="localhost:3000"
      buttonLabel="Pull Request Stats"
    />
  );
};
