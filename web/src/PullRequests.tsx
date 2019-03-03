import * as React from "react";
import { PageTemplate } from "./Components/PageTemplate";
import {
  IPublicChartContainerProps,
  ChartType
} from "./Components/ChartContainer";
import {
  COMPLEXITY_BY_FUNCTION,
  COMPLEXITY_BY_FILE,
  TIME_TO_CLOSE,
  COMMIT_COUNT,
  TOP_ADDITIONS,
  TOP_DELETIONS
} from "./queries/queries";
import { IPublicGitStatsSelectionProps } from "./Components/GitStatsSelection";

const charts: IPublicChartContainerProps[] = [
  {
    query: TIME_TO_CLOSE,
    title: "Count of PRs by number of days to close",
    chartType: ChartType.AREA,
    dataKey: "timeToClose",
    dataProps: {
      name: "daysToClose",
      key1: "numberOfPullRequests"
    }
  },
  {
    query: COMMIT_COUNT,
    title: "Count of PRs by number of commits",
    chartType: ChartType.AREA,
    dataKey: "commitCount",
    dataProps: {
      name: "commitCount",
      key1: "numberOfPullRequests"
    }
  },
  {
    query: TOP_ADDITIONS,
    title: "Top 10 PRs by additions",
    chartType: ChartType.PIE,
    dataKey: "topAdditions",
    dataProps: {
      name: "title",
      key1: "lineChanges"
    }
  },
  {
    query: TOP_DELETIONS,
    title: "Top 10 PRs by deletions",
    chartType: ChartType.PIE,
    dataKey: "topDeletions",
    dataProps: {
      name: "title",
      key1: "lineChanges"
    }
  }
];

const selectionDetails: IPublicGitStatsSelectionProps = {
  wsUrl: "ws://localhost:3000",
  workerHost: "localhost:3000",
  buttonLabel: "Pull Request Stats"
};

export const PullRequests: React.SFC<{}> = () => {
  return (
    <PageTemplate
      showDateFilter={true}
      charts={charts}
      selectionDetails={selectionDetails}
    />
  );
};
