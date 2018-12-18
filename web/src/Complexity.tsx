import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

import { getBarData, getPie1Data, getPie2Data } from "./getData";
import { ComplexitySelection } from "./Components/ComplexitySelection";
import { ChartContainer, ChartType } from "./Components/ChartContainer";
import { COMPLEXITY_BY_FILE, COMPLEXITY_BY_FUNCTION } from "./queries/queries";

const ComplexityGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: repeat(2, 2fr);
  font-family: Open Sans;
  justify-items: flex-start;
`;

interface IComplexityState {
  complete: boolean;
  repository?: number;
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
    this.setState({ complete });
    repository && this.setState({ repository });
  };

  public render() {
    return (
      <ComplexityGrid>
        <ComplexitySelection
          updateParentState={this.updateCompleteAndRepository}
        />
        {this.state.complete && (
          <ChartContainer
            query={COMPLEXITY_BY_FUNCTION}
            gridConfiguration={{ gridRowStart: 1, gridRowEnd: 2 }}
            title="Top 10 Complexity and nloc by function"
            chartType={ChartType.BAR}
            repository={this.state.repository}
            dataKey="complexityByFunction"
          />
        )}
        {this.state.complete && (
          <ChartContainer
            query={COMPLEXITY_BY_FILE}
            gridConfiguration={{ gridRowStart: 2, gridRowEnd: 2 }}
            title="Top 10 Complexity and nloc by file"
            chartType={ChartType.AREA}
            repository={this.state.repository}
            dataKey="complexityByFile"
          />
        )}
      </ComplexityGrid>
    );
  }
}
