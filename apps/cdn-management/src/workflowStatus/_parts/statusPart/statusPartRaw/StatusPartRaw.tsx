import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { StepEntity, StepStateEnum } from "src/workflowStatus/_domain/stepEntity";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faTasks } from "@fortawesome/free-solid-svg-icons/faTasks";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import { faStopCircle } from "@fortawesome/free-solid-svg-icons/faStopCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { Utils } from "src/workflowStatus/_util/utils";
import { Constants } from "src/workflowStatus/_util/constants";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const StatusPartRawView = styled.div`
  display: flex;
  align-items: center;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  font-size: ${Constants.ICON_SIZE};
`;

const Label = styled.div`
  display: flex;
  margin-left: 5px;
`;

const LabelText = styled.div`
  margin-right: 5px;
`;
const LabelDate = styled.div`
  font-weight: bold;
`;

const TextTooltipStyled = styled(TextTooltip)`
  max-height: 500px;
`;

const textTooltipCustomCss = css`
  text-align: left;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  step: StepEntity;
  showTextLabel: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const StatusPartRaw = (props: Props) => {
  const details = getStatusDetails(props.step);

  const timestamp = props.step.timestamp;
  const labelDate = timestamp?.toFormat(Utils.formatDateTime(timestamp)) ?? "N/A";
  return (
    <TextTooltipStyled
      content={details.tooltipData ?? ""}
      textCss={textTooltipCustomCss}
      delay={[0, 500]}
      maxWidth={800}>
      <StatusPartRawView className={props.className}>
        {details.icon}
        {props.showTextLabel && (
          <Label>
            <LabelText>{details.label}</LabelText>
            {details.showDate && <LabelDate>{labelDate}</LabelDate>}
          </Label>
        )}
      </StatusPartRawView>
    </TextTooltipStyled>
  );
};

//region [[ Functions  ]]

interface StatusDetails {
  icon: React.ReactElement;
  label: string;
  tooltipData?: string;
  showDate?: boolean;
}

function getStatusDetails(status: StepEntity): StatusDetails {
  switch (status.state) {
    case StepStateEnum.IN_PROGRESS:
      return {
        icon: <FontAwesomeIconStyled icon={faSpinner} spin={true} />,
        label: "In Progress",
        tooltipData: "Current step: " + (status.stepId || "N/A"),
      };
    case StepStateEnum.PAUSED:
      return {
        icon: <FontAwesomeIconStyled icon={faTasks} />,
        label: "Review and Continue",
      };
    case StepStateEnum.SUCCESS:
      return {
        icon: <FontAwesomeIconStyled color={"#039500"} icon={faCheckCircle} />,
        label: "Completed",
        showDate: true,
      };
    case StepStateEnum.ERROR:
      return {
        icon: <FontAwesomeIconStyled color={"#bf0000"} icon={faTimesCircle} />,
        label: "Error",
        tooltipData: "Error details: \n\n" + (status.error || "N/A"),
        showDate: true,
      };
    case StepStateEnum.STOPPED:
      return {
        icon: <FontAwesomeIconStyled icon={faStopCircle} />,
        label: "Stopped",
        showDate: true,
      };
  }
}

//endregion [[ Functions  ]]
