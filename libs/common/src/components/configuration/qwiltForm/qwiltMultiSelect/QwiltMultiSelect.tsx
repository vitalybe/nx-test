import * as _ from "lodash";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import Downshift, { DownshiftState, StateChangeOptions } from "downshift";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { CommonColors } from "common/styling/commonColors";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { Virtuoso } from "react-virtuoso";
import { darken } from "polished";
import { QwiltMultiSelectItem } from "common/components/configuration/qwiltForm/qwiltMultiSelect/_domain/QwiltMultiSelectItem";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import { Clickable } from "common/components/configuration/clickable/Clickable";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QwiltMultiSelectView = styled.div<{}>`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div<{}>`
  position: relative;
`;

const Headers = styled.div`
  display: flex;
  align-items: center;
`;

const SelectButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SelectButton = styled(Clickable)<{ isLast?: boolean }>`
  margin-right: ${(props) => (props.isLast ? "none" : "10px")};
`;

const Label = styled.label<{ floatLabel: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};

  ${(props) => props.floatLabel && ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const SearchInput = styled.input`
  ${ConfigurationStyles.STYLE_EDITOR_CONTROL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${ConfigurationStyles.COLOR_GREY_1};
    `}

  &:focus + ${Label} {
    ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
  }
`;

const HORIZONTAL_PADDING = "0.5em";
const VERTICAL_PADDING = "0.5em";

const SelectedCount = styled.div<{}>`
  margin-top: ${VERTICAL_PADDING};
  margin-bottom: 0.5em;
  font-style: italic;
`;

const ItemsContainer = styled.div<{}>`
  flex: 1;
  overflow-y: auto;
`;

const Row = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  padding: ${VERTICAL_PADDING} ${HORIZONTAL_PADDING};
  margin-bottom: 1px;
  background-color: ${(props) => (props.isHighlighted ? darken(0.1, CommonColors.MYSTIC_2) : "initial")};
  cursor: pointer;

  &:last-child {
    margin-bottom: ${VERTICAL_PADDING};
  }
`;

const CheckboxStyled = styled(Checkbox).attrs({ borderColor: CommonColors.NAVY_8, checkColor: CommonColors.NAVY_8 })`
  margin-right: 0.5em;
`;

const NoteRow = styled.div<{}>`
  font-style: italic;
  margin-left: ${HORIZONTAL_PADDING};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends QwiltMultiSelectItem> {
  initialItems: T[];

  itemRenderer: (item: T, onRenderedItemChanged: (changedItem: T) => void) => React.ReactChild;
  itemFilterPredicate: (item: T, filter: string) => boolean;

  onItemsChanged: (items: T[]) => void;
  selectAll?: boolean;

  className?: string;
}

//endregion [[ Props ]]

export const QwiltMultiSelect = <T extends QwiltMultiSelectItem>(props: Props<T>) => {
  const [itemsState, setItemsState] = useState<T[]>(
    _.orderBy(
      props.initialItems.map((item) => _.cloneDeep(item)),
      (item) => (item.isSelected ? -1 : 0)
    )
  );

  const onItemsChanged = useEventCallback(props.onItemsChanged);

  useEffect(() => {
    onItemsChanged([...itemsState]);
  }, [onItemsChanged, itemsState]);

  // @ts-ignore
  const virtuosoRef = useRef<Virtuoso | null>(null);
  const highlightedIndexRef = useRef(0);

  const selectedCount = itemsState.filter((item) => item.isSelected).length;

  function changeItem(changedItem: T) {
    const changedItemIndex = itemsState.findIndex((item) => item.id === changedItem.id);
    if (changedItemIndex === -1) {
      throw new Error(`item not found`);
    }

    const newItemsState = [...itemsState];
    newItemsState[changedItemIndex] = changedItem;

    setItemsState(newItemsState);

    return newItemsState;
  }

  function onItemToggle(item: T) {
    changeItem({ ...item, isSelected: !item.isSelected });
  }

  function onItemChanged(changedItem: T) {
    changeItem(changedItem);
  }

  function onSelectAll(filteredItems: T[]) {
    setItemsState(
      itemsState.map((item) => {
        if (filteredItems.length === 0) {
          return { ...item, isSelected: false };
        } else if (filteredItems.some((filteredItem) => filteredItem.id === item.id)) {
          return { ...item, isSelected: true };
        } else {
          return item;
        }
      })
    );
  }

  return (
    <Downshift
      // NOTE: itemToString not used - just to prevent Downshift from complaining
      itemToString={(item) => item?.id ?? ""}
      itemCount={itemsState.length}
      scrollIntoView={() => {
        if (virtuosoRef.current) {
          virtuosoRef.current.scrollToIndex({ index: highlightedIndexRef.current, align: "center" });
        }
      }}
      initialInputValue={""}
      stateReducer={downshiftStateReducer}
      onSelect={(item) => item && onItemToggle(item)}>
      {({ getRootProps, getInputProps, inputValue, getItemProps, highlightedIndex }) => {
        let filteredItems = itemsState;
        if (inputValue) {
          filteredItems = itemsState.filter((item) => props.itemFilterPredicate(item, inputValue));
        }

        if (highlightedIndex !== null) {
          highlightedIndexRef.current = highlightedIndex;
        }

        return (
          <QwiltMultiSelectView {...getRootProps()} className={props.className}>
            <InputContainer>
              <SearchInput {...getInputProps()} />
              <Label floatLabel={true}>Filter</Label>
            </InputContainer>
            <Headers>
              <SelectedCount>
                <b>{selectedCount}</b> out of <b>{itemsState.length}</b> items selected
              </SelectedCount>
              {filteredItems.length === 0 && <NoteRow>No items</NoteRow>}
              {!!props.selectAll && (
                <SelectButtonsContainer>
                  <SelectButton onClick={() => onSelectAll(filteredItems)}>Select All</SelectButton>
                  <SelectButton isLast onClick={() => onSelectAll([])}>
                    Select None
                  </SelectButton>
                </SelectButtonsContainer>
              )}
            </Headers>
            <ItemsContainer>
              <Virtuoso
                ref={virtuosoRef}
                style={{ height: "100%" }}
                totalCount={filteredItems.length}
                overscan={10}
                item={(index) => {
                  const item = filteredItems[index];
                  return (
                    <Row
                      key={item.id}
                      isHighlighted={highlightedIndex === index}
                      {...getItemProps({ item: item, index: index })}>
                      <CheckboxStyled isChecked={item.isSelected} />
                      {props.itemRenderer(item, (changedItem) => {
                        onItemChanged(changedItem);
                      })}
                    </Row>
                  );
                }}
              />
            </ItemsContainer>
          </QwiltMultiSelectView>
        );
      }}
    </Downshift>
  );
};

function downshiftStateReducer<T>(state: DownshiftState<T>, changes: StateChangeOptions<T>) {
  // don't modify the input on selection
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
    case Downshift.stateChangeTypes.blurInput:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
        inputValue: state.inputValue,
      };
    default:
      return changes;
  }
}
