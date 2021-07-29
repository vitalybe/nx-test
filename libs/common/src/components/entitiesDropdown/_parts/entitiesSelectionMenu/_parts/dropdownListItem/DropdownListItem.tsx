import React, { MouseEvent, useEffect, useState, CSSProperties } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CommonColors as Colors, CommonColors } from "common/styling/commonColors";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import { ExpandCaret } from "common/components/svg/expandCaret/ExpandCaret";
import { SelectionModeEnum } from "common/utils/hierarchyUtils";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const ExpandContainer = styled.div`
  padding: 2px;
`;
const CheckboxStyled = styled(Checkbox)`
  margin-right: 0.5em;
`;

export const StatusText = styled.span`
  margin-left: auto;
`;

const DropdownListItemView = styled.div<{}>`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  cursor: pointer;
  width: 100%;
  transition: 200ms ease-out;
  height: fit-content;
`;

const Row = styled.div<{ indent: number; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  width: 100%;
  padding: 10px 10px 10px ${(props) => props.indent + "px"};
  background-color: ${(props) => (props.isSelected ? Colors.LILY_WHITE : "initial")};
  font-weight: ${(props) => (props.isSelected ? 600 : 500)};
  &:hover {
    background-color: ${(props) => (props.isSelected ? Colors.LILY_WHITE : Colors.ALICE_BLUE)};
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onSelect: (item: DropdownEntity) => void;
  isSingleSelection?: boolean;
  entity: DropdownEntity;
  indent?: number;
  style?: CSSProperties;
  className?: string;
}

//endregion [[ Props ]]
type ClickEvent = MouseEvent<SVGElement | HTMLDivElement>;
// recursive rendering component
export const DropdownListItem = ({ entity, isSingleSelection, indent = 10, ...props }: Props) => {
  const [isExpanded, setIsExpanded] = useState(entity.isExpanded);

  const selectionCallback = useEventCallback((event: ClickEvent) => {
    event.stopPropagation();
    props.onSelect(entity);
  });

  const treeExpandToggle = useEventCallback((event: ClickEvent) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  });

  useEffect(() => {
    if (entity.isExpanded !== isExpanded) {
      entity.isExpanded = isExpanded;
    }
  }, [isExpanded, entity.isExpanded, entity]);

  return (
    <DropdownListItemView
      style={props.style}
      className={props.className}
      onClick={entity.children && entity.children.length > 0 ? treeExpandToggle : selectionCallback}>
      <Row indent={indent} isSelected={entity.selection === SelectionModeEnum.SELECTED}>
        {entity.children && entity.children.length > 0 && (
          <ExpandContainer>
            <ExpandCaret isExpanded={isExpanded} onClick={treeExpandToggle} />
          </ExpandContainer>
        )}
        {!isSingleSelection && (
          <CheckboxStyled
            isPartialCheck={entity.selection === SelectionModeEnum.PARTIAL}
            isChecked={entity.selection === SelectionModeEnum.SELECTED}
            onClick={selectionCallback}
            borderColor={CommonColors.HALF_BAKED}
            checkColor={CommonColors.NAVY_8}
          />
        )}
        {entity.rowRenderer?.(entity)}
      </Row>
      {isExpanded &&
        entity.children?.map((child) => (
          <DropdownListItem
            key={child.id}
            onSelect={props.onSelect}
            entity={child}
            indent={child.children && child.children.length > 0 ? indent + 20 : indent + 40}
            isSingleSelection={child.isSingleSelection}
          />
        ))}
    </DropdownListItemView>
  );
};
