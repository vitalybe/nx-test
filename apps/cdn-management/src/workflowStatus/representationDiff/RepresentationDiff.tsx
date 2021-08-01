import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ItemsCard, ItemsCardContent } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { Button } from "@qwilt/common/components/configuration/button/Button";
import { DiffMetadataEntity } from "./_domain/diffMetadataEntity";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { Constants } from "../_util/constants";
import { useWorkflowStore } from "../_stores/workflowStore";
import { DiffSection } from "./_domain/diffSection";
import { DiffSectionButton } from "./diffSectionButton/DiffSectionButton";
import { DiffSectionView } from "./diffSectionView/DiffSectionView";
import { DiffFlowTitle } from "../_parts/diffFlowTitle/DiffFlowTitle";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RepresentationDiffView = styled(ItemsCard)`
  display: flex;
  flex-direction: column;
  min-height: 10px;
  padding: 0;

  ${ItemsCardContent} {
    padding: 0;
  }
`;

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 1fr auto;
  row-gap: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 0;
`;

const SectionButtons = styled.div`
  height: 100%;
  display: grid;
  grid-auto-flow: row;
  row-gap: 0.5rem;
  align-content: flex-start;
  min-height: 0;
  overflow-y: scroll;
`;

const ButtonsFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  justify-items: left;
  column-gap: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  diffMetadata: DiffMetadataEntity;

  onClose: () => void;
  workflowControlEvents:
    | undefined
    | {
        onContinueWorkflow: () => void;
        onStopWorkflow: () => void;
      };

  className?: string;
}

//endregion [[ Props ]]

export const RepresentationDiff = (props: Props) => {
  const store = useWorkflowStore();
  const [section, setSection] = useState<DiffSection | undefined>(undefined);

  const mainTitle = `Step Diff - "${props.diffMetadata.stepId}" (${store.cdn.name})`;
  const left = props.diffMetadata.left;
  const right = props.diffMetadata.right;

  const orderedSections = _.orderBy(props.diffMetadata.sections, (section) => section.name);
  const sections = [
    ...orderedSections.filter((section) => section.diff.changesAmount !== 0),
    ...orderedSections.filter((section) => section.diff.changesAmount === 0),
  ];

  return (
    <RepresentationDiffView className={props.className} title={mainTitle}>
      <DiffFlowTitle left={left} right={right} />
      <Content>
        {section ? (
          <DiffSectionView section={section} onBack={() => setSection(undefined)} />
        ) : (
          <SectionButtons>
            {sections.map((section) => {
              return (
                <DiffSectionButton
                  key={section.name}
                  name={section.name}
                  changesAmount={section.diff.changesAmount}
                  onClick={() => setSection(section)}
                />
              );
            })}
          </SectionButtons>
        )}
        <ButtonsFooter>
          <TextTooltip content={"Workflow will remain in pending state"}>
            <Button onClick={props.onClose}>Close Dialog</Button>
          </TextTooltip>
          {props.workflowControlEvents && (
            <>
              <Button onClick={props.workflowControlEvents?.onStopWorkflow}>Stop Workflow</Button>
              <Button
                isDisabled={store.isCdnLocked}
                disabledTooltip={Constants.TEXT_REASON_LOCKED}
                onClick={props.workflowControlEvents?.onContinueWorkflow}>
                Next {">"}
              </Button>
            </>
          )}
        </ButtonsFooter>
      </Content>
    </RepresentationDiffView>
  );
};
