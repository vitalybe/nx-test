import * as React from "react";
import { useMemo } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import {
  EntitiesDropdown,
  EntitiesDropdownSelectionMode,
  ToggleIcon,
} from "../../../../entitiesDropdown/EntitiesDropdown";
import { DropdownSelectorRenderer } from "../../../../entitiesDropdown/_overrideableParts/dropdownSelectorRenderer/DropdownSelectorRenderer";
import { DropdownEntity } from "../../../../entitiesDropdown/_domain/dropdownEntity";
import { SelectionModeEnum } from "../../../../../utils/hierarchyUtils";
import { FormInputContainer } from "../../_parts/formInputContainer/FormInputContainer";
import { useEventCallback } from "../../../../../utils/hooks/useEventCallback";
import { ErrorIndicationIconAbsolute } from "../../_parts/inputErrorIndication/InputErrorIndication";
import { CommonColors } from "../../../../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const dropdownMenuStyles = css`
  min-width: 13rem;
`;
const dropdownContentStyles = (props: { isError?: boolean }) => css`
  padding: 0 1rem;
  border-radius: 0.2rem;
  border: 1px solid ${props.isError ? CommonColors.RADICAL_RED : CommonColors.SILVER};
  font-size: 0.75rem;
  color: ${CommonColors.BLACK_PEARL};
  font-weight: 500;
  max-width: 100%;
  height: 100%;
  width: 100%;
  &:focus {
    border: 1px solid ${props.isError ? CommonColors.RADICAL_RED : CommonColors.SILVER};
  }
`;
const EntitiesDropdownStyled = styled(EntitiesDropdown)`
  min-width: 13rem;
`;
const FormEntitiesDropdownRawView = styled(FormInputContainer)`
  ${ErrorIndicationIconAbsolute} {
    right: 0.5rem;
  }
  ${ToggleIcon} {
    opacity: ${(props) => (!!props.errorMessage ? 0 : 1)};
    transition: 300ms ease-out;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export type DropdownEntityIdType = DropdownEntity["id"];
export type FormEntitiesDropdownValueType = Array<DropdownEntityIdType> | DropdownEntityIdType | number;
export interface Props {
  label?: string;
  selectionMode: EntitiesDropdownSelectionMode;
  errorMessage?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  allItemsSelectedText?: string;
  itemType?: string;
  itemTypePlural?: string;
  placeholder?: string;
  items: DropdownEntity[];
  controlledValue?: FormEntitiesDropdownValueType;
  onChange: (id: FormEntitiesDropdownValueType) => void;
  onBlur?: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const FormEntitiesDropdownRaw = ({ errorMessage, items, controlledValue, ...props }: Props) => {
  const isSingleSelection = props.selectionMode === "single";
  const onSelectionChanged = useEventCallback((selectedItems: DropdownEntity[]) => {
    props.onChange(isSingleSelection ? selectedItems[0].id : selectedItems.map(({ id }) => id));
  });

  const controlledItemsList = useMemo(() => {
    return items.map((item) => ({
      ...item,
      selection:
        (!controlledValue && item.selection === SelectionModeEnum.SELECTED) ||
        (typeof controlledValue === "string" || typeof controlledValue === "number"
          ? controlledValue === item.id
          : controlledValue?.includes?.(item.id))
          ? SelectionModeEnum.SELECTED
          : SelectionModeEnum.NOT_SELECTED,
    })) as DropdownEntity[];
  }, [items, controlledValue]);

  return (
    <FormEntitiesDropdownRawView
      className={props.className}
      errorMessage={errorMessage}
      label={props.label}
      isDisabled={props.isDisabled}
      onBlur={props.onBlur}>
      <EntitiesDropdownStyled
        isSearchable
        shouldMatchMenuWidth
        selectionMode={props.selectionMode}
        isLoading={props.isLoading}
        items={controlledItemsList}
        onSelectionChanged={onSelectionChanged}
        componentThemeType={"light"}
        itemType={props.itemType}
        itemTypePlural={props.itemTypePlural}
        tooltipStyles={dropdownMenuStyles}
        contentStyles={dropdownContentStyles({ isError: !!errorMessage })}
        dropdownSelectorRenderer={
          <DropdownSelectorRenderer
            suppressUppercaseTransform
            noSelectionPlaceholder={props.placeholder}
            allItemsSelectedText={props.allItemsSelectedText}
            fontSize={"0.75rem"}
          />
        }
      />
    </FormEntitiesDropdownRawView>
  );
};
