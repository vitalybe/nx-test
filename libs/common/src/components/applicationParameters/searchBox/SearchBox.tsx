import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonColors } from "common/styling/commonColors";
import { darken } from "polished";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { SearchIconStyled as SearchIcon } from "common/components/searchInput/SearchInput";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: fit-content;
`;

const SearchIconStyled = styled(SearchIcon)`
  margin-right: 8px;
`;

const ClearIconContainer = styled.div`
  margin-left: 0.3em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClearIcon = styled(FontAwesomeIcon)`
  margin-left: auto;
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
  border-bottom: 1px solid #565656;
  outline: none;
  width: 10rem;
  transition: 0.2s ease;
  font-size: 1rem;
  color: #565656;
  ${SearchBoxContainer}:focus-within & {
    color: ${CommonColors.DAINTREE};
    border-bottom: 1px solid ${CommonColors.DAINTREE};
  }
`;

const PlaceHolder = styled.div`
  width: 14px;
  height: 14px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  initialValue: string | undefined;
  onChange: (filter: string) => void;
  className?: string;
}

//endregion [[ Props ]]

export const SearchBox = (props: Props) => {
  const [value, setValue] = useState<string>(props.initialValue ?? "");

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  const clearInputValue = () => {
    setValue("");
    props.onChange("");
  };

  return (
    <SearchBoxContainer className={props.className}>
      <SearchIconStyled color={CommonColors.BLUE_LAGOON} size={"1.5em"} />
      <SearchInput value={value} placeholder={"Search"} onChange={onInputChangeHandler} />
      <ClearIconContainer onClick={!!value ? clearInputValue : undefined}>
        {!!value ? <ClearIcon icon={faTimesCircle} /> : <PlaceHolder />}
      </ClearIconContainer>
    </SearchBoxContainer>
  );
};
