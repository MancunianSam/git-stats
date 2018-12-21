import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IButtonInputProps {
  onClick: () => void;
}

const StyledButton: StyledComponent<IButtonProps, {}, {}> = styled.button`
  width: 240px;
  border-radius: 5px;
  font-family: Open Sans;
  font-size: 16px;
  color: white;
  background-color: hsl(217, 94%, 31%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 4px;
`;

export const Button: React.SFC<IButtonInputProps> = props => {
  return (
    <StyledButton onClick={() => props.onClick()}>
      {props.children}
    </StyledButton>
  );
};
