import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DiffSection } from "../_domain/diffSection";
// @ts-ignore
import { Checkbox } from "@qwilt/common/components/checkbox/Checkbox";
import { Clickable } from "@qwilt/common/components/configuration/clickable/Clickable";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "jsondiffpatch/dist/formatters-styles/html.css";
import "jsondiffpatch/dist/formatters-styles/annotated.css";
import { JsonDiff } from "../../_parts/jsonDiff/JsonDiff";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DiffSectionViewView = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  column-gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const JsonDiffViewStyled = styled(JsonDiff)`
  flex: 1;
  max-width: 80vw;
`;

const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 0.5rem;
  justify-content: left;
  align-items: center;
  margin-top: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  section: DiffSection;

  onBack: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const DiffSectionView = (props: Props) => {
  const [isOnlyShowDifferences, setIsOnlyShowDifferences] = useState(true);
  const [highlightedChangeIndex, setHighlightedChangeIndex] = useState<number | undefined>(undefined);

  function moveHighlighted(byHowMuch: number) {
    setHighlightedChangeIndex((prevValue) => (prevValue === undefined ? 0 : prevValue + byHowMuch));
  }

  return (
    <DiffSectionViewView className={props.className}>
      <Title>
        <Clickable onClick={props.onBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Clickable>
        <span>{props.section.name}</span>
      </Title>
      <JsonDiffViewStyled
        diff={props.section.diff}
        highlightedChangeIndex={highlightedChangeIndex}
        isOnlyShowDifferences={isOnlyShowDifferences}
      />
      <CheckboxContainer>
        <Checkbox isChecked={isOnlyShowDifferences} onClick={() => setIsOnlyShowDifferences((value) => !value)}>
          <div>Only show differences</div>
        </Checkbox>
        <Clickable onClick={() => moveHighlighted(1)}>⬇ Next Difference</Clickable>
        <Clickable onClick={() => moveHighlighted(-1)}>⬆ Previous Difference</Clickable>
      </CheckboxContainer>
    </DiffSectionViewView>
  );
};
