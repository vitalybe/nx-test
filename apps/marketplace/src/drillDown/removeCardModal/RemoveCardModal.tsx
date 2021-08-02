import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { Tooltip } from "@qwilt/common/components/Tooltip";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RemoveCardModalView = styled.div`
  height: auto;
  display: flex;
  border-radius: 3px;
  background-color: #ffffff;
  min-height: auto;
  padding: 7px;
  width: 285px;
  border-radius: 3px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 -2px 4px 0 rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
`;

const Header = styled.div`
  font-family: Avenir;
  padding-top: 3px;
  padding-right: 22px;
  padding-left: 8px;
  font-size: 10px;
  width: 184px;
  font-weight: 900;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #01222f;
`;

const UndoButton = styled.button`
  width: 37px;
  height: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: Avenir-Roman;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #0e4960;
  margin-top: 1px;
  opacity: 1;

  &:hover {
    font-weight: bold;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  align-items: center;
`;

const CloseCardImg = styled.img`
  width: 16px;
  position: absolute;

  right: 20px;
  top: 25px;
  flex: 0 1 auto;
  cursor: pointer;

  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onUndo: any;
  itemName: string;
  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]
//endregion [[ Functions ]]

const closeCardIcon = require("@qwilt/common/images/close-card-large.svg");

export const RemoveCardCloseButton = ({ closeToast }: { closeToast?: any }) => (
  <CloseCardImg alt={"qwilt logo"} src={closeCardIcon} onClick={closeToast} />
);

export const RemoveCardModal = React.memo(({ ...props }: Props) => {
  return (
    <RemoveCardModalView className={props.className}>
      <Header>{props.itemName} WAS REMOVED</Header>
      <ButtonSection>
        <UndoButton onClick={props.onUndo}>UNDO</UndoButton>
      </ButtonSection>
    </RemoveCardModalView>
  );
});
