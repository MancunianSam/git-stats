import * as React from "react";

import { FilterSuggestions } from "./FilterSuggestions";
import { ApolloClient } from "apollo-boost";
import { SEARCH_FILE_NAMES } from "../queries/queries";
import styled, { StyledComponent } from "@emotion/styled";

interface IChartFilterProps {
  repositoryId: number;
  client: ApolloClient<{}>;
  onSelectedChange: (selectedValue: string) => void;
}

interface IFilterInputProps {
  value: string | number | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const FilterWrapper: StyledComponent<{}, {}, {}> = styled.div`
  align-self: center;
  grid-row-start: 1;
  grid-column-start: 2;
  width: 95%;
`;

const FilterInputBorder: StyledComponent<{}, {}, {}> = styled.div`
  border: 2px solid hsl(217, 77%, 78%);
`;

const FilterInput: StyledComponent<IFilterInputProps, {}, {}> = styled.input`
  height: 20px;
  width: 90%;
  border: none;
`;

const FilterSuggestionsWrapper: StyledComponent<{}, {}, {}> = styled.div`
  position: absolute;
  width: 500px;
  height: 200px;
  z-index: 1;
`;

export const ChartFilter: React.FunctionComponent<IChartFilterProps> = (
  props: IChartFilterProps
) => {
  const [suggestions, setSuggestions]: [
    string[],
    React.Dispatch<string[]>
  ] = React.useState<string[]>([]);

  const [filterValue, setFilterValue]: [
    string,
    React.Dispatch<string>
  ] = React.useState<string>("");

  const [selectedIndex, setSelectedIndex]: [
    number,
    React.Dispatch<number>
  ] = React.useState<number>(0);

  const [selectedValue, setSelectedValue]: [
    string,
    React.Dispatch<string>
  ] = React.useState<string>("");

  const handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = event => {
    const filterValue: string = event.target.value;
    props.client
      .query({
        query: SEARCH_FILE_NAMES,
        variables: { repositoryId: props.repositoryId, name: filterValue }
      })
      .then(data => {
        setSuggestions(data.data["searchFileName"]);
        setFilterValue(filterValue);
        setSelectedIndex(0);
      });
  };

  const handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void = event => {
    if (event.keyCode === 13) {
      setFilterValue("");
      setSelectedValue(suggestions[selectedIndex - 1]);
      props.onSelectedChange(selectedValue);
    } else if (event.keyCode === 40) {
      if (selectedIndex < 0 || selectedIndex >= suggestions.length) {
        return;
      }
      setSelectedIndex(selectedIndex + 1);
    } else if (event.keyCode === 38) {
      if (selectedIndex <= 1 || selectedIndex > suggestions.length) {
        return;
      }
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const onClick: (index: number) => void = index => {
    const selectedValue: string = suggestions[index - 1];
    setSelectedIndex(index);
    setFilterValue("");
    setSelectedValue(suggestions[index - 1]);

    props.onSelectedChange(selectedValue);
  };

  return (
    <FilterWrapper>
      <div>Filter by folder</div>
      <FilterInputBorder>
        <FilterInput
          value={filterValue ? filterValue : ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </FilterInputBorder>
      <div>{selectedValue}</div>
      <FilterSuggestionsWrapper>
        {filterValue.length > 2 && (
          <FilterSuggestions
            onclick={onClick}
            selected={selectedIndex}
            results={suggestions}
          />
        )}
      </FilterSuggestionsWrapper>
    </FilterWrapper>
  );
};
