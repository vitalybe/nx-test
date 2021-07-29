import * as React from "react";
import { Fragment } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ContextDiffEntityTypeEnum } from "../_domain/contextEntityType";
import { NavigationBarButton } from "./navigationBarButton/NavigationBarButton";
import { Clickable } from "@qwilt/common/components/configuration/clickable/Clickable";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons/faCaretLeft";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const NavigationBarView = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavigationBarButtonStyled = styled(NavigationBarButton)`
  margin-left: -3px;
`;

const NavigationButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const EntityNavigationButtons = styled.div`
  margin-left: 0.5rem;
  display: grid;
  grid-auto-flow: column;
  column-gap: 0.5rem;
`;

const ChangeEntityButton = styled(Clickable)``;

//endregion [[ Styles ]]

//region [[ Props ]]

interface NavigationBarButtonEntity {
  id: string;
  name: string;
  type: ContextDiffEntityTypeEnum | undefined;
}

export interface Props {
  toShowEntityNavigation: boolean;
  buttons: NavigationBarButtonEntity[];

  onNavigationButtonClick: (id: string) => void;
  onChangeEntity: (direction: "next" | "previous") => void;

  className?: string;
}

//endregion [[ Props ]]

export const NavigationBar = (props: Props) => {
  return (
    <NavigationBarView className={props.className}>
      <NavigationButtonContainer>
        {props.buttons
          .slice()
          .reverse()
          .map((buttonData, i) => {
            return (
              <Fragment key={`${i}_${buttonData.type}_${buttonData.name}`}>
                <NavigationBarButtonStyled
                  title={buttonData.name}
                  type={buttonData.type}
                  isSelected={i === 0}
                  hasArrow={i === 0}
                  onClick={() => props.onNavigationButtonClick(buttonData.id)}
                />
              </Fragment>
            );
          })}
      </NavigationButtonContainer>
      {props.toShowEntityNavigation ? (
        <EntityNavigationButtons>
          <TextTooltip content={"Previous Entity"}>
            <ChangeEntityButton onClick={() => props.onChangeEntity("previous")}>
              <FontAwesomeIcon size={"2x"} icon={faCaretLeft} />
            </ChangeEntityButton>
          </TextTooltip>
          <TextTooltip content={"Next Entity"}>
            <ChangeEntityButton onClick={() => props.onChangeEntity("next")}>
              <FontAwesomeIcon size={"2x"} icon={faCaretRight} />
            </ChangeEntityButton>
          </TextTooltip>
        </EntityNavigationButtons>
      ) : null}
    </NavigationBarView>
  );
};
