import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";

interface ISelectOptions {
  value: string;
  label: string;
}

interface ISelectProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface ISelectOptionsProps extends ISelectProps {
  options: ISelectOptions[];
}

const SelectContainer: StyledComponent<{}, {}, {}> = styled.div`
  background: url(http://i62.tinypic.com/15xvbd5.png) no-repeat 96% 0;
  height: 29px;
  overflow: hidden;
  border-radius: 5px;
  background-color: hsl(217, 77%, 78%);
  width: 240px;
  margin: 10px;
`;

const SelectDropDown: StyledComponent<ISelectProps, {}, {}> = styled.select`
  background: transparent;
  border: none;
  font-size: 14px;
  height: 29px;
  padding: 5px;
  width: 100%;
  color: #fff;
`;

export const Select: React.SFC<ISelectOptionsProps> = (
  props: ISelectOptionsProps
) => {
  return (
    <SelectContainer>
      <SelectDropDown onChange={props.onChange}>
        {props.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectDropDown>
    </SelectContainer>
  );
};
