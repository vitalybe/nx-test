import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { Clickable } from "../../../configuration/clickable/Clickable";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RecordingDialogView = styled.div`
  width: 643px;
  border-radius: 8px;
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  color: #21506e;

  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const TitleSection = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e9e9e9;
  text-align: center;
  position: relative;
`;
const Title = styled.span`
  font-weight: bold;
`;
const CloseIcon = styled(Clickable)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
`;
export const Content = styled.div`
  flex: 1;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title: string;
  children: React.ReactNode;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const RecordingDialog = (props: Props) => {
  return (
    <RecordingDialogView className={props.className}>
      <TitleSection>
        <Title>{props.title}</Title>
        <CloseIcon onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseIcon>
      </TitleSection>
      <Content>{props.children}</Content>
    </RecordingDialogView>
  );
};
