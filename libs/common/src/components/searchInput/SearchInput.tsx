import * as React from "react";
import styled from "styled-components";
import { useEventCallback } from "../../utils/hooks/useEventCallback";
import { SearchIcon } from "../svg/searchIcon/SearchIcon";
import { CommonColors } from "../../styling/commonColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";

//region [[ Styles ]]
export const SearchIconStyled = styled(SearchIcon)<{ size?: string }>`
  margin-right: 0.25rem;
  flex: 0 0 auto;
  width: ${(props) => props.size ?? "1rem"};
  height: ${(props) => props.size ?? "1rem"};
`;

const Input = styled.input`
  padding: 0.25rem;
  border: none;
  flex: 1 1 auto;
  min-width: 3.75rem;
  background-color: transparent;
  &:focus {
    outline: none;
  }
`;

const ClearBtn = styled.button`
  border: none;
  padding: 0;
  position: absolute;
  opacity: 0.5;
  transition: opacity 200ms ease-out;
  cursor: pointer;
  right: 0.625rem;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 1;
  }
  .clear-icon {
    height: 0.625rem;
    width: 0.625rem;
  }
`;

const SearchInputView = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
  font-size: 0.75rem;
  color: ${CommonColors.TANGAROA};
  flex: 1 0 auto;

  input::placeholder {
    color: inherit;
    user-select: none;
    opacity: 1;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  clearFn?: () => void;
  iconColor?: string;
  iconSize?: string;
  className?: string;
}

//endregion [[ Props ]]

export const SearchInput = (props: Props) => {
  const onChangeCallback = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  });

  const onClearCallback = useEventCallback(() => {
    props.onChange("");
    props.clearFn?.();
  });
  return (
    <SearchInputView className={props.className}>
      <SearchIconStyled color={props.iconColor} size={props.iconSize} />
      <Input value={props.value} onChange={onChangeCallback} placeholder={props.placeholder} />
      {props.value && (
        <ClearBtn onClick={onClearCallback}>
          <FontAwesomeIcon icon={faTimesCircle} className={"icon"} />
        </ClearBtn>
      )}
    </SearchInputView>
  );
};
