import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

import { ComplexitySelection } from "./Components/ComplexitySelection";
import { ChartContainer, ChartType } from "./Components/ChartContainer";
import { ChartFilter } from "./Components/ChartFilter";
import { COMPLEXITY_BY_FILE, COMPLEXITY_BY_FUNCTION } from "./queries/queries";
import { ApolloConsumer } from "react-apollo";

const ComplexityGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 200px repeat(2, 2fr);
  font-family: Open Sans;
  justify-items: flex-start;
  align-items: center;
`;

interface IComplexityState {
  complete: boolean;
  repository?: number;
  filterValue?: string;
  selectedValue?: string;
}
export class Complexity extends React.Component<{}, IComplexityState> {
  constructor(props: {}) {
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
    return (
      <ComplexityGrid>
        <span>{this.state.filterValue}</span>
        <ComplexitySelection
          updateParentState={this.updateCompleteAndRepository}
        />
        <ApolloConsumer>
          {client => {
            return (
              <ChartFilter
                repositoryId={this.state.repository}
                client={client}
                onSelectedChange={this.onSelectedChange}
              />
            );
          }}
        </ApolloConsumer>

        {this.state.complete && (
          <ChartContainer
            query={COMPLEXITY_BY_FUNCTION}
            gridConfiguration={{ gridRowStart: 2, gridColumnStart: 2 }}
            title="Top 10 Complexity and nloc by function"
            chartType={ChartType.BAR}
            repository={this.state.repository}
            dataKey="complexityByFunction"
            filePath={this.state.selectedValue}
          />
        )}
        {this.state.complete && (
          <ChartContainer
            query={COMPLEXITY_BY_FILE}
            gridConfiguration={{ gridRowStart: 3, gridColumnStart: 2 }}
            title="Top 10 Complexity and nloc by file"
            chartType={ChartType.AREA}
            repository={this.state.repository}
            dataKey="complexityByFile"
            filePath={this.state.selectedValue}
          />
        )}
      </ComplexityGrid>
    );
  }
}
