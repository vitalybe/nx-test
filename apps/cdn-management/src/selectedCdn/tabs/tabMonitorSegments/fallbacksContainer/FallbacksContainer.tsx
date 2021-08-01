import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@qwilt/common/styling/icons";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const FallbacksContainerView = styled.div`
  display: flex;
`;

const FallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FallbackDiv = styled.div`
  flex: 1;
  height: 1.5em;
  padding: 0 7px 0 7px;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
  margin: 4px 5px;
  overflow: hidden;
  border-radius: 4px;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 1.3em;
  max-width: 250px;
  min-width: 75px;
`;

const textTooltipCustomCss = css`
  font-size: 10px;
  font-weight: 600;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  fallbackIds: string[];

  className?: string;
}

//endregion [[ Props ]]

export const FallbacksContainer = ({ fallbackIds, ...props }: Props) => {
  return (
    <FallbacksContainerView className={props.className}>
      {fallbackIds.map((fallbackGroupName, i) => {
        return (
          <FallbackContainer key={i}>
            <TextTooltip
              content={fallbackGroupName}
              delay={[800, 400]}
              arrow={false}
              textCss={textTooltipCustomCss}
              followCursor={"initial"}
              animation={"fade"}
              interactive={true}
              livePlacement={true}>
              <FallbackDiv>{fallbackGroupName}</FallbackDiv>
            </TextTooltip>
            {i < fallbackIds.length - 1 && <FontAwesomeIcon icon={Icons.CARET_RIGHT} />}
          </FallbackContainer>
        );
      })}
    </FallbacksContainerView>
  );
};
