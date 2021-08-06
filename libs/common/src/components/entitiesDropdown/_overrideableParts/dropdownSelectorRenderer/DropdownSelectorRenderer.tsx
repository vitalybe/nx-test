import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ImageWithFallback } from "../../../imageWithFallback/ImageWithFallback";
import { HierarchyUtils } from "../../../../utils/hierarchyUtils";
import { ComponentTheme, useEntitiesDropdownContext } from "../../EntitiesDropdown";
import { DropdownEntity } from "../../_domain/dropdownEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SelectedItemDiv = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5em;
`;
const SelectedItemsContainer = styled.div`
  flex: 1;
  display: flex;
  min-width: 0;
  overflow: hidden;
  margin-right: 1em;
`;

const Icons = styled.div`
  display: flex;
`;

const OverflowCountDiv = styled.div<{ componentTheme: ComponentTheme }>`
  border-radius: 3px;
  background-color: ${(props) => props.componentTheme.iconBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: normal;
  flex: 0 0 auto;
  margin-right: 0.25rem;
`;

const IconDiv = styled(OverflowCountDiv)<{ componentTheme: ComponentTheme }>`
  height: 32px;
  max-width: 32px;
`;

const ImageIcon = styled(ImageWithFallback)`
  height: 1rem;
  width: auto;
`;

const Label = styled.div<{ isDim?: boolean; fontSize?: string }>`
  font-size: ${(props) => props.fontSize ?? "1.25rem"};
  opacity: ${(props) => (props.isDim ? 0.4 : 1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 18.75rem;
  font-weight: 600;
`;
const ShortLabel = styled(Label)`
  max-width: 12.5rem;
  margin-right: 4px;
`;

const Counter = styled.div<{ fontSize?: string }>`
  span {
    font-size: ${(props) => props.fontSize ?? "1rem"};
  }
`;
const CounterValue = styled.span``;
const CounterText = styled.span`
  margin-left: 0.2em;
`;

const DropdownSelectorRendererView = styled.div<{ isUpperCaseLabels: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  margin-right: 0.5rem;
  ${Label} {
    text-transform: ${(props) => (props.isUpperCaseLabels ? "uppercase" : "none")};
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  allItemsSelectedText?: string;
  partialSelectionText?: ((selectedItems: DropdownEntity[]) => string) | string;
  titleAddition?: string;
  fontSize?: string;
  noSelectionPlaceholder?: string;
  suppressUppercaseTransform?: boolean;
  suppressCounter?: boolean;
  selectedItemsOverride?: DropdownEntity[];
  className?: string;
}

//endregion [[ Props ]]

export const MAXIMUM_SHOWN_ICONS = 1;

export const DropdownSelectorRenderer = (props: Props) => {
  const {
    items,
    selectedItems: contextSelectItems,
    componentTheme,
    isSingleSelection,
    itemType,
    itemTypePlural,
  } = useEntitiesDropdownContext();

  const selectedItems = props.selectedItemsOverride ?? contextSelectItems;

  const isAllSelected: boolean = useMemo(() => {
    return selectedItems.length === HierarchyUtils.countLeafEntities(items);
  }, [selectedItems, items]);

  let contentLabel = "";
  let overflowingIconsCounter = 0;
  if (selectedItems.length === 0) {
    contentLabel = props.noSelectionPlaceholder ?? "no selection";
  } else if (isAllSelected) {
    contentLabel = props.allItemsSelectedText ?? (isSingleSelection ? selectedItems[0].label : "All Selected");
  } else if (props.partialSelectionText) {
    contentLabel =
      typeof props.partialSelectionText === "string"
        ? props.partialSelectionText
        : props.partialSelectionText(selectedItems);
  } else if (selectedItems.length > MAXIMUM_SHOWN_ICONS) {
    overflowingIconsCounter = selectedItems.length - MAXIMUM_SHOWN_ICONS;
  }

  return (
    <DropdownSelectorRendererView className={props.className} isUpperCaseLabels={!props.suppressUppercaseTransform}>
      <SelectedItemsContainer>
        {!isAllSelected && !props.partialSelectionText && (
          <Icons>
            {selectedItems.slice(0, MAXIMUM_SHOWN_ICONS).map((item, index) => (
              <SelectedItemDiv key={item.id}>
                {item.icon() && (
                  <IconDiv componentTheme={componentTheme}>
                    <ImageIcon imagePath={item.icon() ?? ""} />
                  </IconDiv>
                )}
                {!item.icon() || index === 0 ? (
                  <Label fontSize={props.fontSize}>{index === 0 ? item.label : item.label[0].toUpperCase()}</Label>
                ) : null}
              </SelectedItemDiv>
            ))}
            {overflowingIconsCounter ? (
              <OverflowCountDiv componentTheme={componentTheme}>+{overflowingIconsCounter}</OverflowCountDiv>
            ) : null}
          </Icons>
        )}
        {contentLabel &&
          (props.titleAddition ? (
            <ShortLabel isDim={selectedItems.length === 0}>{contentLabel}</ShortLabel>
          ) : (
            <Label fontSize={props.fontSize}>{contentLabel}</Label>
          ))}
        {props.titleAddition && <Label>{props.titleAddition}</Label>}
      </SelectedItemsContainer>
      {!isAllSelected && !isSingleSelection && !props.suppressCounter && (
        <Counter fontSize={props.fontSize}>
          <CounterValue>{selectedItems.length}</CounterValue>
          <CounterText>{selectedItems.length > 1 ? itemTypePlural : itemType}</CounterText>
        </Counter>
      )}
    </DropdownSelectorRendererView>
  );
};
