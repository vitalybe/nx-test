import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { Colors } from "src/_styling/colors";
import { CommonStyles } from "common/styling/commonStyles";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DiffSectionButtonView = styled.div<{ hasChanges: boolean }>`
  padding: 0.5rem;

  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 0.5rem;

  display: grid;
  grid-auto-flow: column;

  background-color: white;
  border-radius: 5px;

  border: 2px solid ${Colors.LOBLOLLY};

  opacity: ${(props) => (props.hasChanges ? 1 : 0.2)};

  ${CommonStyles.clickableStyle("background-color", "#ffffff", { colorFunction: "darken" })}
`;

const Title = styled.div`
  font-weight: bold;
`;

const ChangesContainer = styled.div`
  text-align: center;
`;

const ChangesCount = styled.div``;
const ChangesLabel = styled.div`
  font-size: 0.8rem;
  margin-top: -10px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  name: string;
  changesAmount: number;

  onClick: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const DiffSectionButton = (props: Props) => {
  return (
    <DiffSectionButtonView hasChanges={props.changesAmount > 0} onClick={props.onClick} className={props.className}>
      <FontAwesomeIcon icon={faSearchPlus} />

      <Title>{props.name}</Title>
      <ChangesContainer>
        <ChangesCount>{props.changesAmount}</ChangesCount>
        <ChangesLabel>changes</ChangesLabel>
      </ChangesContainer>
    </DiffSectionButtonView>
  );
};
