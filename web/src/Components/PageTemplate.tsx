import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

import { GitStatsSelection } from "./GitStatsSelection";
import {
  ChartContainer,
  ChartType,
  IPublicChartContainerProps
} from "./ChartContainer";
import { ChartFilter } from "./ChartFilter";
import { COMPLEXITY_BY_FILE, COMPLEXITY_BY_FUNCTION } from "../queries/queries";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_FILE_NAMES } from "../queries/queries";

const GitStatsGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 200px repeat(2, 2fr);
  font-family: Open Sans;
  justify-items: flex-start;
  align-items: center;
`;

interface IPageTemplateState {
  complete: boolean;
  repository?: number;
  filterValue?: string;
  selectedValue?: string;
}

interface IPageTemplateProps {
  charts: IPublicChartContainerProps[];
}

export class PageTemplate extends React.Component<
  IPageTemplateProps,
  IPageTemplateState
> {
  constructor(props: IPageTemplateProps) {
    super(props);
    this.state = {
      complete: false
    };
  }

  public updateCompleteAndRepository: (
    complete: boolean,
    repository: number
  ) => void = (complete, repository) => {
    this.setState({ complete, selectedValue: null });
    repository && this.setState({ repository });
  };

  public onSelectedChange: (selectedValue: string) => void = selectedValue => {
    this.setState({ selectedValue });
  };

  public render() {
    let gridRowStart: number = 2;
    return (
      <GitStatsGrid>
        <span>{this.state.filterValue}</span>
        <GitStatsSelection
          updateParentState={this.updateCompleteAndRepository}
          wsUrl="ws://localhost:5000"
          workerHost="localhost:5000"
          buttonLabel="Complexity Stats"
        />
        <ApolloConsumer>
          {client => {
            return (
              <ChartFilter
                repositoryId={this.state.repository}
                client={client}
                onSelectedChange={this.onSelectedChange}
                query={SEARCH_FILE_NAMES}
              />
            );
          }}
        </ApolloConsumer>

        {this.state.complete &&
          this.props.charts.map(chart => (
            <ChartContainer
              query={chart.query}
              gridConfiguration={{
                gridRowStart: gridRowStart++,
                gridColumnStart: 2
              }}
              title={chart.title}
              chartType={chart.chartType}
              variables={{
                repositoryId: this.state.repository,
                filePath: this.state.selectedValue
              }}
              dataKey={chart.dataKey}
            />
          ))}
      </GitStatsGrid>
    );
  }
}
