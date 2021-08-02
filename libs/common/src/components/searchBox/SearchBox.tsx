import * as React from "react";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonColors } from "../../styling/commonColors";
import { darken } from "polished";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { SearchIconStyled as SearchIcon } from "../searchInput/SearchInput";
import _ from "lodash";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  max-width: 25rem;
  min-width: fit-content;
  height: 40px;
  border: solid 1px rgba(159, 182, 191, 0.36);
  transition: 0.2s ease;

  background-color: ${CommonColors.WILD_SAND};
  &:focus-within {
    background-color: white;
  }
`;

const SearchIconStyled = styled(SearchIcon)`
  margin: 0 8px;
`;

const ClearIconContainer = styled.div``;

const ClearIcon = styled(FontAwesomeIcon)`
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
  color: ${CommonColors.HEATHER};
  transition: 0.2s ease;

  &:hover {
    color: ${darken(0.2, CommonColors.HEATHER)};
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  initialValue?: string;
  onValueChanged: (value: string | undefined) => void;
  debounceMillis?: number;
  placeholder?: string;
  className?: string;
}

//endregion [[ Props ]]

export const SearchBox = ({ debounceMillis = 0, placeholder = "Search for events", ...props }: Props) => {
  const [value, setValue] = useState<string>(props.initialValue ?? "");

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debounce(event.target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((value: string) => {
      props.onValueChanged(value);
    }, debounceMillis),
    []
  );

  const clearInputValue = () => {
    setValue("");
    props.onValueChanged(undefined);
  };

  return (
    <SearchBoxContainer className={props.className}>
      <SearchIconStyled color={CommonColors.BLUE_LAGOON} size={"1.5rem"} />
      <SearchInput value={value} placeholder={placeholder} onChange={onInputChangeHandler} />
      {!!value && (
        <ClearIconContainer onClick={clearInputValue}>
          <ClearIcon icon={faTimesCircle} />
        </ClearIconContainer>
      )}
    </SearchBoxContainer>
  );
};
