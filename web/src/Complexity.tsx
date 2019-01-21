import * as React from "react";
import { PageTemplate } from "./Components/PageTemplate";
import {
  IPublicChartContainerProps,
  ChartType
} from "./Components/ChartContainer";
import { COMPLEXITY_BY_FUNCTION, COMPLEXITY_BY_FILE } from "./queries/queries";

const charts: IPublicChartContainerProps[] = [
  {
    query: COMPLEXITY_BY_FUNCTION,
    title: "Top 10 Complexity and nloc by function",
    chartType: ChartType.BAR,
    dataKey: "complexityByFunction"
  },
  {
    query: COMPLEXITY_BY_FILE,
    title: "Top 10 Complexity and nloc by file",
    chartType: ChartType.AREA,
    dataKey: "complexityByFile"
  }
];

export const Complexity: React.SFC<{}> = () => {
  return <PageTemplate charts={charts} />;
};
