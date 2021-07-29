import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { Colors } from "../../../_styling/colors";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { IconWithLabel } from "../iconWithLabel/IconWithLabel";
import { faHashtag } from "@fortawesome/free-solid-svg-icons/faHashtag";
import { Utils } from "../../_util/utils";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DiffFlowTitleView = styled.div`
  display: flex;
  background-color: ${Colors.JUNGLE_MIST};
  padding: 0.5rem 1rem;
  justify-content: space-around;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  background-color: white;
  border-radius: 5px;
  padding: 0.5rem;
  flex: 1;
  justify-content: center;
`;

const Arrow = styled.div`
  font-size: 3rem;
  margin: 0 2rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  left: WorkflowEntity | undefined;
  right: WorkflowEntity;

  className?: string;
}

//endregion [[ Props ]]

export const DiffFlowTitle = (props: Props) => {
  return (
    <DiffFlowTitleView className={props.className}>
      {props.left ? getTitle(props.left) : <Title>No Current Active Version</Title>}
      <Arrow>➡</Arrow>
      {getTitle(props.right)}
    </DiffFlowTitleView>
  );
};

//region [[ Functions ]]
function getTitle(workflow: WorkflowEntity) {
  return (
    <Title>
      <TextTooltip content={workflow.id} delay={300}>
        <IconWithLabel icon={faHashtag}>{Utils.shortenId(workflow.id)}</IconWithLabel>
      </TextTooltip>
      <IconWithLabel icon={faCalendarAlt}>{Utils.formatDateTime(workflow.startTime)}</IconWithLabel>
      <IconWithLabel icon={faUser}>{workflow.user}</IconWithLabel>
    </Title>
  );
}
//endregion [[ Functions ]]
