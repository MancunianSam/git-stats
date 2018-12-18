import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

import { StatsBarChart } from "./Charts/StatsBarChart";
import { StatsAreaChart } from "./Charts/StatsAreaChart";
import { getBarData, getPie1Data, getPie2Data } from "./getData";
import { ComplexitySelection } from "./Components/ComplexitySelection";

const ComplexityGrid: StyledComponent<{}, {}, {}> = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: repeat(2, 2fr);
  font-family: Open Sans;
  justify-items: flex-start;
`;

interface IComplexityState {
  complete: boolean;
  repository: string;
}
export class Complexity extends React.Component<{}, IComplexityState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      complete: true,
      repository: ""
    };
  }

  public updateCompleteAndRepository: (
    complete: boolean,
    repository: string
  ) => void = (complete, repository) => {
    this.setState({ complete, repository });
  };

  public render() {
    return (
      <ComplexityGrid>
        <ComplexitySelection
          updateParentState={this.updateCompleteAndRepository}
        />
        {this.state.complete && (
          <div style={{ gridRowStart: 1, gridColumnStart: 2 }}>
            <span style={{ fontFamily: "Open Sans" }}>
              Top 10 Complexity and nloc by funtion
            </span>
            <StatsBarChart
              data={getBarData(this.state.repository)}
              name={"name"}
              key1={"nloc"}
              key2={"complexity"}
            />
          </div>
        )}
        {this.state.complete && (
          <div style={{ gridRowStart: 2, gridColumnStart: 2 }}>
            <span style={{ fontFamily: "Open Sans" }}>
              Top 10 Complexity and nloc by file
            </span>
            <StatsAreaChart
              data={getBarData(this.state.repository)}
              name={"name"}
              key1={"nloc"}
              key2={"complexity"}
            />
          </div>
        )}
      </ComplexityGrid>
    );
  }
}
