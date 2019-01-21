import * as React from "react";
import { DocumentNode } from "graphql";
import { Query } from "react-apollo";

import { StatsBarChart } from "../Charts/StatsBarChart";
import { StatsAreaChart } from "../Charts/StatsAreaChart";

interface IGridConfiguration {
  gridRowStart: number;
  gridColumnStart: number;
}

export interface IPublicChartContainerProps {
  title: string;
  query: DocumentNode;
  chartType: ChartType;
  dataKey: string;
}

interface IChartContainerProps extends IPublicChartContainerProps {
  variables: { [index: string]: string | number };
  gridConfiguration: IGridConfiguration;
}

interface ICommonProps {
  data: any;
  name: string;
  key1: string;
  key2: string;
}

export enum ChartType {
  BAR,
  AREA
}

const getChart: (chartType: ChartType, query: DocumentNode) => JSX.Element = (
  chartType,
  data
) => {
  const commonProps: ICommonProps = {
    data: data,
    name: "name",
    key1: "nloc",
    key2: "complexity"
  };

  switch (chartType) {
    case ChartType.BAR:
      return <StatsBarChart {...commonProps} />;
    case ChartType.AREA:
      return <StatsAreaChart {...commonProps} />;
  }
};

export const ChartContainer: React.SFC<IChartContainerProps> = props => {
  return (
    <Query query={props.query} variables={props.variables}>
      {({ loading, error, data }) => {
        if (loading) return "Loading";
        if (error) return `Error ${error.message}`;
        return (
          <div
            style={{
              gridRowStart: props.gridConfiguration.gridRowStart,
              gridColumnStart: props.gridConfiguration.gridColumnStart
            }}
          >
            <span style={{ fontFamily: "Open Sans" }}>{props.title}</span>
            {getChart(props.chartType, data[props.dataKey])}
          </div>
        );
      }}
    </Query>
  );
};
