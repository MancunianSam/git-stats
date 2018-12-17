import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

interface IProgressBarProps {
  width: number;
}

const ProgressBarContainer: StyledComponent<{}, {}, {}> = styled.div`
  background-color: lightgrey;
  height: 30px;
  width: 100%;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const ProgressBarProgress: StyledComponent<
  {},
  IProgressBarProps,
  {}
> = styled.div(props => ({
  height: "30px",
  borderRadius: "5px",
  boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  width: `${props.width}%`,
  backgroundImage:
    "linear-gradient(to top,hsl(217, 77%, 78%),hsl(217, 94%, 31%))"
}));

const ProgressBarPercentage: StyledComponent<{}, {}, {}> = styled.span`
  position: absolute;
  margin-top: 3px;
  font-family: "Open Sans";
  margin-left: 5px;
`;

export const ProgressBar: React.SFC<IProgressBarProps> = (
  props: IProgressBarProps
) => {
  return (
    <ProgressBarContainer>
      <ProgressBarPercentage>
        {`${Math.round(props.width)}%`}
      </ProgressBarPercentage>
      <ProgressBarProgress width={props.width} />
    </ProgressBarContainer>
  );
};
