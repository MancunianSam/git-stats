import * as React from "react";

import { FilterSuggestions } from "./FilterSuggestions";
import { ApolloClient } from "apollo-boost";
import { SEARCH_FILE_NAMES } from "../queries/queries";
import styled, { StyledComponent } from "@emotion/styled";

interface IChartFilterState {
  filterValue: string;
  selectedIndex?: number;
  selectedValue?: string;
  suggestions: string[];
}

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
  const [state, setState]: [
    IChartFilterState,
    React.Dispatch<IChartFilterState>
  ] = React.useState({ suggestions: [], filterValue: "" });

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
        setState({
          suggestions: data.data["searchFileName"],
          filterValue,
          selectedIndex: 0
        });
      });
  };

  const handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void = event => {
    const suggestions: string[] = state.suggestions;
    const selectedIndex: number = state.selectedIndex ? state.selectedIndex : 0;
    if (event.keyCode === 13) {
      const selectedValue: string = suggestions[state.selectedIndex - 1];
      setState({
        filterValue: "",
        selectedIndex: state.selectedIndex,
        suggestions,
        selectedValue
      });
      props.onSelectedChange(selectedValue);
    } else if (event.keyCode === 40) {
      if (
        state.selectedIndex < 0 ||
        state.selectedIndex >= state.suggestions.length
      ) {
        return;
      }
      setState({
        selectedIndex: selectedIndex + 1,
        filterValue: state.filterValue,
        suggestions
      });
    } else if (event.keyCode === 38) {
      if (
        state.selectedIndex <= 1 ||
        state.selectedIndex > suggestions.length
      ) {
        return;
      }
      setState({
        selectedIndex: selectedIndex - 1,
        filterValue: state.filterValue,
        suggestions
      });
    }
  };

  const onClick: (index: number) => void = index => {
    const selectedValue: string = state.suggestions[index - 1];
    setState({
      selectedIndex: index,
      filterValue: "",
      suggestions: state.suggestions,
      selectedValue
    });
    props.onSelectedChange(selectedValue);
  };

  return (
    <FilterWrapper>
      <div>Filter by folder</div>
      <FilterInputBorder>
        <FilterInput
          value={state.filterValue ? state.filterValue : ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </FilterInputBorder>
      <div>{state.selectedValue}</div>
      <FilterSuggestionsWrapper>
        {state.filterValue.length > 2 && (
          <FilterSuggestions
            onclick={onClick}
            selected={state.selectedIndex}
            results={state.suggestions}
          />
        )}
      </FilterSuggestionsWrapper>
    </FilterWrapper>
  );
};
