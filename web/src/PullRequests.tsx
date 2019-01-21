import * as React from "react";
import { PageTemplate } from "./Components/PageTemplate";
import {
  IPublicChartContainerProps,
  ChartType
} from "./Components/ChartContainer";
import { COMPLEXITY_BY_FUNCTION, COMPLEXITY_BY_FILE } from "./queries/queries";
import { IPublicGitStatsSelectionProps } from "./Components/GitStatsSelection";

const charts: IPublicChartContainerProps[] = [
  {
    query: COMPLEXITY_BY_FUNCTION,
    title: "Top 10 Complexity and nloc by function",
    chartType: ChartType.BAR,
    dataKey: "complexityByFunction"
  }
];

const selectionDetails: IPublicGitStatsSelectionProps = {
  wsUrl: "ws://localhost:3000",
  workerHost: "localhost:3000",
  buttonLabel: "Pull Request Stats"
};

export const PullRequests: React.SFC<{}> = () => {
  return <PageTemplate charts={charts} selectionDetails={selectionDetails} />;
};
