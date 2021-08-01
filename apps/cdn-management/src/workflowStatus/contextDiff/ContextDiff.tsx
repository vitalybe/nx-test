import * as React from "react";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ItemsCard, ItemsCardContent } from "common/components/configuration/itemsCard/ItemsCard";
import { DiffFlowTitle } from "src/workflowStatus/_parts/diffFlowTitle/DiffFlowTitle";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { ContextDiffSegmentEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffSegmentEntity";
import { ContextDiffBaseEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffDomainShared";
import { ContextDiffPathUtils } from "src/workflowStatus/contextDiff/_utils/contextDiffPathUtils";
import { NavigationBar } from "src/workflowStatus/contextDiff/navigationBar/NavigationBar";
import { ContextDiffEntityTypeEnum } from "src/workflowStatus/contextDiff/_domain/contextEntityType";
import { ContextDiffListOfSegments } from "src/workflowStatus/contextDiff/contextDiffListOfSegments/ContextDiffListOfSegments";
import { ContextDiffListOfLists } from "src/workflowStatus/contextDiff/contextDiffListOfLists/ContextDiffListOfLists";
import { ContextDiffItemEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffItemEntity";
import { ContextDiffListEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffListEntity";
import { ContextDiffListOfItems } from "src/workflowStatus/contextDiff/contextDiffListOfItems/ContextDiffListOfItems";
import { ContextDiffJson } from "src/workflowStatus/contextDiff/contextDiffJson/ContextDiffJson";
import { Button } from "common/components/configuration/button/Button";
import { Colors } from "src/_styling/colors";
import { ContextDiffUtils } from "src/workflowStatus/contextDiff/_utils/contextDiffUtils";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ContextDiffView = styled(ItemsCard)`
  min-height: 10px;
  padding: 0;
  height: 100%;

  ${ItemsCardContent} {
    padding: 0;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 0.5rem;
  padding: 0.5rem 1rem;
  flex: 1;
  min-height: 0;
`;

const Summary = styled.div`
  text-align: right;
`;

const UnreviewedText = styled.span`
  font-weight: bold;
  color: ${Colors.RED_BERRY};
`;

const AllReviewedText = styled.span`
  font-weight: bold;
  color: ${Colors.GREEN};
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
  cdnName: string;
  left: WorkflowEntity | undefined;
  right: WorkflowEntity;
  segments: ContextDiffSegmentEntity[];

  onClose: () => void;

  isReviewEnabled: boolean;
  workflowControlEvents:
    | undefined
    | {
        onStopWorkflow: () => void;
        onContinueWorkflow: (segmentIds: string[]) => void;
      };

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiff = (props: Props) => {
  const { reviewedItemsIds, toggleReview } = useReviewItems();
  const [selectedSegmentsIds, setSelectedSegmentsIds] = useState<string[]>([]);
  const { selectedEntityPath, onChangeEntity, onNavigationBarClick, onZoom } = useNavigationHandling(
    props.segments.filter((segment) => segment.id),
    selectedSegmentsIds,
    toggleReview
  );

  const selectedEntity = selectedEntityPath[selectedEntityPath.length - 1];

  const selectedEntityChildren = selectedEntity.content?.children;
  const selectedEntityFirstChild = selectedEntityChildren?.[0];
  const itemsToReview = ContextDiffUtils.getEntityLeafItems(
    props.segments.filter((segment) => selectedSegmentsIds.includes(segment.id))
  ).filter((item) => item.hasModifications).length;

  const unreviewedCount = itemsToReview - reviewedItemsIds.size;
  return (
    <ContextDiffView title={`CDN - ${props.cdnName} - Step "Preview Changes"`} className={props.className}>
      <DiffFlowTitle left={props.left} right={props.right} />
      <Content>
        <NavigationBar
          buttons={selectedEntityPath}
          onNavigationButtonClick={onNavigationBarClick}
          toShowEntityNavigation={selectedEntity instanceof ContextDiffItemEntity}
          onChangeEntity={onChangeEntity}
        />
        {selectedEntityFirstChild instanceof ContextDiffSegmentEntity ? (
          <ContextDiffListOfSegments
            items={selectedEntityChildren as ContextDiffSegmentEntity[]}
            isReviewEnabled={props.isReviewEnabled}
            reviewedIds={reviewedItemsIds}
            onZoom={onZoom}
            selectedSegmentsIds={selectedSegmentsIds}
            onSelectedSegmentsChanged={
              props.workflowControlEvents
                ? (selectedSegmentsIds) => setSelectedSegmentsIds(selectedSegmentsIds)
                : undefined
            }
          />
        ) : null}
        {selectedEntityFirstChild instanceof ContextDiffListEntity ? (
          <ContextDiffListOfLists
            items={selectedEntityChildren as ContextDiffListEntity[]}
            isReviewEnabled={props.isReviewEnabled}
            reviewedIds={reviewedItemsIds}
            onZoom={onZoom}
          />
        ) : null}
        {selectedEntityFirstChild instanceof ContextDiffItemEntity ? (
          <ContextDiffListOfItems
            items={selectedEntityChildren as ContextDiffItemEntity[]}
            isReviewEnabled={props.isReviewEnabled}
            reviewedIds={reviewedItemsIds}
            onZoom={onZoom}
          />
        ) : null}
        {selectedEntity instanceof ContextDiffItemEntity ? (
          <ContextDiffJson
            item={selectedEntity}
            onReviewToggle={props.isReviewEnabled ? () => toggleReview(selectedEntity.id) : undefined}
            reviewedItemIds={reviewedItemsIds}
          />
        ) : null}
        {props.workflowControlEvents && (
          <Summary>
            {unreviewedCount > 0 ? (
              <div>
                <b>{unreviewedCount}</b> were <UnreviewedText>unreviewed</UnreviewedText>.
              </div>
            ) : selectedSegmentsIds.length > 0 ? (
              <div>
                <AllReviewedText>
                  All Items were <b>reviewed</b>
                </AllReviewedText>
              </div>
            ) : (
              <div>&nbsp;</div>
            )}
            {!!props.workflowControlEvents ? (
              <div>
                <b>{selectedSegmentsIds.length} change groups</b> selected.
              </div>
            ) : null}
          </Summary>
        )}
        <ButtonsFooter>
          <TextTooltip content={"Workflow will remain in pending state"}>
            <Button onClick={props.onClose}>Close Dialog</Button>
          </TextTooltip>
          {props.workflowControlEvents && (
            <>
              <Button
                onClick={() => {
                  props.workflowControlEvents?.onStopWorkflow();
                  props.onClose();
                }}>
                Stop Workflow
              </Button>
              <Button
                isDisabled={selectedSegmentsIds.length === 0}
                disabledTooltip={"At least one segment should be selected"}
                onClick={() => {
                  const areAllSegmentsSelected = props.segments.length === selectedSegmentsIds.length;
                  // When all segments are selected, backend wants none sent (AmirY)
                  props.workflowControlEvents?.onContinueWorkflow(areAllSegmentsSelected ? [] : selectedSegmentsIds);
                  props.onClose();
                }}>
                Continue Workflow
              </Button>
            </>
          )}
        </ButtonsFooter>
      </Content>
    </ContextDiffView>
  );
};

//region [[ Functions ]]

function useNavigationHandling(
  segments: ContextDiffSegmentEntity[],
  selectedSegmentsIds: string[],
  toggleReview: (itemId: string, forceIsReviewed?: boolean) => void
) {
  const rootItems: ContextDiffBaseEntity[] = [
    {
      id: "all-changes",
      name: "All Changes",
      type: ContextDiffEntityTypeEnum.ALL_CHANGES,
      content: { kind: "known", children: segments },
      // Doesn't really matter - It is used only for navigation bar
      hasModifications: true,
    },
  ];

  const [selectedEntityPath, setSelectedEntityPath] = useState<ContextDiffBaseEntity[]>(rootItems);

  function changeSelectedEntityPath(path: ContextDiffBaseEntity[]) {
    const selectedEntity = path[path.length - 1];

    if (selectedEntity instanceof ContextDiffItemEntity) {
      toggleReview(selectedEntity.id, true);
    }

    setSelectedEntityPath(path);
  }

  function onNavigationBarClick(entityId: string) {
    const partIndex = selectedEntityPath.findIndex((entity) => entity.id === entityId);
    if (partIndex >= 0) {
      changeSelectedEntityPath(selectedEntityPath.slice(0, partIndex + 1));
    }
  }

  function onZoom(item: ContextDiffBaseEntity) {
    changeSelectedEntityPath([...selectedEntityPath, item]);
  }

  function onChangeEntity(direction: "next" | "previous") {
    if (direction === "next") {
      changeSelectedEntityPath(ContextDiffPathUtils.getNextPath(selectedEntityPath, rootItems, selectedSegmentsIds));
    } else {
      changeSelectedEntityPath(ContextDiffPathUtils.getPrevPath(selectedEntityPath, rootItems, selectedSegmentsIds));
    }
  }

  return { selectedEntityPath, onZoom, onChangeEntity, onNavigationBarClick };
}

function useReviewItems() {
  const [reviewedItemsIds, setReviewedItemsIds] = useState<Set<string>>(new Set());

  const toggleReview = useCallback(
    (itemId: string, forceIsReviewed?: boolean) => {
      const reviewedItemsCopy = new Set(reviewedItemsIds);
      if (forceIsReviewed === true || !reviewedItemsCopy.has(itemId)) {
        reviewedItemsCopy.add(itemId);
      } else {
        reviewedItemsCopy.delete(itemId);
      }
      setReviewedItemsIds(reviewedItemsCopy);
    },
    [reviewedItemsIds]
  );

  return { reviewedItemsIds, toggleReview };
}

//endregion [[ Functions ]]
