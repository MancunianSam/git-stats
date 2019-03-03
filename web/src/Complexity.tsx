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
    dataKey: "complexityByFunction",
    dataProps: {
      name: "name",
      key1: "nloc",
      key2: "complexity"
    }
  },
  {
    query: COMPLEXITY_BY_FILE,
    title: "Top 10 Complexity and nloc by file",
    chartType: ChartType.AREA,
    dataKey: "complexityByFile",
    dataProps: {
      name: "name",
      key1: "nloc",
      key2: "complexity"
    }
  }
];

const selectionDetails: IPublicGitStatsSelectionProps = {
  wsUrl: "ws://localhost:5000",
  workerHost: "localhost:5000",
  buttonLabel: "Complexity Stats"
};

export const Complexity: React.SFC<{}> = () => {
  return (
    <PageTemplate
      charts={charts}
      selectionDetails={selectionDetails}
      showFileFilter={true}
    />
  );
};
