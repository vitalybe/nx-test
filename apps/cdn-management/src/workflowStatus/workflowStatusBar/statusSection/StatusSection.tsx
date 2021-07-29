import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { Utils } from "../../_util/utils";
import { StatusPart } from "../../_parts/statusPart/StatusPart";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import * as _ from "lodash";
import { IconWithLabel } from "../../_parts/iconWithLabel/IconWithLabel";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const StatusSectionView = styled.div`
  display: flex;
  align-self: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  workflow: WorkflowEntity;
  className?: string;
}

//endregion [[ Props ]]

export const StatusSection = (props: Props) => {
  const startTime = props.workflow.startTime;
  const lastStep = _.last(props.workflow.steps);

  return (
    <StatusSectionView className={props.className}>
      <IconWithLabel icon={faUser}>{props.workflow.user}</IconWithLabel>
      <IconWithLabel icon={faCalendarAlt}>{Utils.formatDateTime(startTime)}</IconWithLabel>
      {lastStep && <StatusPart workflow={props.workflow} step={lastStep} showTextLabel={true} />}
    </StatusSectionView>
  );
};
