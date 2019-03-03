import * as React from "react";
import { DocumentNode } from "graphql";
import { Query } from "react-apollo";

import { StatsBarChart } from "../Charts/StatsBarChart";
import { StatsAreaChart } from "../Charts/StatsAreaChart";
import { StatsPieChart } from "../Charts/StatsPieChart";

interface IGridConfiguration {
  gridRowStart: number;
  gridColumnStart: number;
}

export interface IPublicChartContainerProps {
  title: string;
  query: DocumentNode;
  chartType: ChartType;
  dataKey: string;
  dataProps: IDataProps;
}

interface IChartContainerProps extends IPublicChartContainerProps {
  variables: { [index: string]: string | number };
  gridConfiguration: IGridConfiguration;
}

interface IDataProps {
  name: string;
  key1: string;
  key2?: string;
}

export enum ChartType {
  BAR,
  AREA,
  PIE
}

const getChart: (
  chartType: ChartType,
  data: DocumentNode,
  dataProps: IDataProps
) => JSX.Element = (chartType, data, dataProps) => {
  const commonProps: IDataProps = {
    name: dataProps.name,
    key1: dataProps.key1,
    key2: dataProps.key2
  };
  switch (chartType) {
    case ChartType.BAR:
      return <StatsBarChart data={data} {...commonProps} />;
    case ChartType.AREA:
      return <StatsAreaChart data={data} {...commonProps} />;
    case ChartType.PIE:
      return <StatsPieChart data={data} {...commonProps} />;
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
            {getChart(props.chartType, data[props.dataKey], props.dataProps)}
          </div>
        );
      }}
    </Query>
  );
};
