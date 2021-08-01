import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { JsonDiff } from "src/workflowStatus/_parts/jsonDiff/JsonDiff";
import { ContextDiffItemEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffItemEntity";
import { Button } from "common/components/configuration/button/Button";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ContextDiffJsonView = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
`;

const JsonDiffContainer = styled.div`
  position: relative;
  flex: 1;

  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
`;

const ChangeDiffFocusButton = styled(Button).attrs({
  backgroundColor: "#ffffff",
  textColor: ConfigurationStyles.COLOR_CLICKABLE,
  colorFunction: "darken",
})`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  min-width: 0;
`;

const JsonDiffViewStyled = styled(JsonDiff)`
  flex: 1;
  min-height: 0;
  max-width: 80vw;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  justify-content: left;
  align-items: center;
  margin-top: 0.5rem;
`;

const ShowDiffCheckbox = styled(Checkbox)`
  grid-area: 1/5;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  item: ContextDiffItemEntity;
  reviewedItemIds: Set<string>;

  onReviewToggle?: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiffJson = (props: Props) => {
  const [isOnlyShowDifferences, setIsOnlyShowDifferences] = useState(true);
  const [highlightedChangeIndex, setHighlightedChangeIndex] = useState<number | undefined>(undefined);

  function moveHighlighted(byHowMuch: number) {
    setHighlightedChangeIndex((prevValue) => (prevValue === undefined ? 0 : prevValue + byHowMuch));
  }

  const isReviewed = props.reviewedItemIds.has(props.item.id);
  return (
    <ContextDiffJsonView className={props.className}>
      <JsonDiffContainer>
        <JsonDiffViewStyled
          diff={props.item.diff}
          highlightedChangeIndex={highlightedChangeIndex}
          isOnlyShowDifferences={isOnlyShowDifferences}
        />
        {props.item.diff.changesAmount > 1 ? (
          <ButtonsContainer>
            <TextTooltip content={`Jump to next JSON difference`}>
              <ChangeDiffFocusButton onClick={() => moveHighlighted(1)}>
                <FontAwesomeIcon icon={faChevronDown} />
              </ChangeDiffFocusButton>
            </TextTooltip>
            <TextTooltip content={`Jump to previous JSON difference`}>
              <ChangeDiffFocusButton onClick={() => moveHighlighted(-1)}>
                <FontAwesomeIcon icon={faChevronUp} />
              </ChangeDiffFocusButton>
            </TextTooltip>
          </ButtonsContainer>
        ) : null}
      </JsonDiffContainer>
      <ActionsContainer>
        <ShowDiffCheckbox isChecked={isOnlyShowDifferences} onClick={() => setIsOnlyShowDifferences((value) => !value)}>
          <div>Only show differences</div>
        </ShowDiffCheckbox>
        {props.onReviewToggle && (
          <Button onClick={props.onReviewToggle}>Mark as {isReviewed ? "not " : ""}Reviewed</Button>
        )}
      </ActionsContainer>
    </ContextDiffJsonView>
  );
};
