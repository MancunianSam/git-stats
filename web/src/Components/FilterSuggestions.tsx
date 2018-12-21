import * as React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { Query } from "react-apollo";

import { SEARCH_FILE_NAMES } from "../queries/queries";

interface IFilterSuggestionsProps {
  selected: number;
  onclick: (index: number) => void;
  results: string[];
}

interface ISuggestionsList {
  selected: number;
}

const SuggestionsList: StyledComponent<{}, ISuggestionsList, {}> = styled.ul`
  background-color: hsl(217, 69%, 90%);
  li:nth-of-type(${props => props.selected}) {
    background-color: hsl(217, 94%, 61%);
  }
  list-style: none;
  padding-left: 10px;
  max-height: 100px;
  overflow-x: auto;
`;

export const FilterSuggestions: React.SFC<IFilterSuggestionsProps> = props => {
  return (
    <SuggestionsList selected={props.selected}>
      <div>
        {props.results.map((r, idx) => {
          return (
            <li key={idx} onClick={() => props.onclick(idx + 1)}>
              {r}
            </li>
          );
        })}
      </div>
    </SuggestionsList>
  );
};
