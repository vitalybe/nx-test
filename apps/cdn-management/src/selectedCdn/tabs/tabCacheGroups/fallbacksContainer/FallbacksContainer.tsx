import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "common/styling/icons";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const FallbacksContainerView = styled.div`
  display: flex;
`;

const FallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FallbackButton = styled.button`
  flex: 1;
  margin: 4px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  cursor: pointer;
`;
const textTooltipCustomCss = css`
  font-size: 10px;
  font-weight: 600;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  fallbackDeliveryUnitGroups: CacheGroupEntity[];
  onClick: (dug: CacheGroupEntity | undefined) => void;

  className?: string;
}

//endregion [[ Props ]]

export const FallbacksContainer = ({ fallbackDeliveryUnitGroups, ...props }: Props) => {
  return (
    <FallbacksContainerView className={props.className}>
      {fallbackDeliveryUnitGroups.map((fallbackCacheGroup, i) => {
        return (
          <FallbackContainer key={i}>
            <TextTooltip
              content={fallbackCacheGroup.name}
              delay={[800, 400]}
              textCss={textTooltipCustomCss}
              arrow={false}
              followCursor={"initial"}
              animation={"fade"}
              interactive={true}
              livePlacement={true}>
              <FallbackButton onClick={() => props.onClick(fallbackCacheGroup)}>
                {fallbackCacheGroup.name}
              </FallbackButton>
            </TextTooltip>
            {i < fallbackDeliveryUnitGroups.length - 1 && <FontAwesomeIcon icon={Icons.CARET_RIGHT} />}
          </FallbackContainer>
        );
      })}
    </FallbacksContainerView>
  );
};
