import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { toast } from "react-toastify";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { lighten } from "polished";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const FilterWarnView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #feffaa;
  box-shadow: ${ConfigurationStyles.SHADOW};
  padding: 1.5em;
  position: relative;
  flex: 1;
`;

const Title = styled.div`
  color: black;
  font-size: 14px;
  margin-bottom: 10px;
`;

const FilterWarnButtonsContainer = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
  border-radius: 5px;
  background: ${CommonColors.MATISSE};
  border: 0;
  color: ${CommonColors.MYSTIC_2};
  outline: 0;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${lighten(0.1, CommonColors.MATISSE)};
  }

  &:active {
    background: ${lighten(0.2, CommonColors.MATISSE)};
  }

  &:disabled {
    background-color: ${CommonColors.SILVER_SAND};
    cursor: initial;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onOk: () => void;
  onCancel: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const FilterWarn = (props: Props) => {
  return (
    <FilterWarnView className={props.className}>
      <Title>Filter will unselect all rules</Title>
      <FilterWarnButtonsContainer>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={props.onOk}>Ok</Button>
      </FilterWarnButtonsContainer>
    </FilterWarnView>
  );
};

export const FilterWarnToast = (props: Props) => {
  toast(<FilterWarn {...props} />, {
    position: "bottom-center",
    autoClose: false,
    draggable: false,
    draggablePercent: 0,
    closeOnClick: false,
    closeButton: false,
    hideProgressBar: true,
  });
};
