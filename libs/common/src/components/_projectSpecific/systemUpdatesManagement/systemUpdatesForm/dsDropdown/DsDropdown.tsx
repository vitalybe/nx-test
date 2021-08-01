import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { Content, EntitiesDropdown } from "../../../../entitiesDropdown/EntitiesDropdown";
import { DropdownEntity } from "../../../../entitiesDropdown/_domain/dropdownEntity";
import { ConfigurationStyles } from "../../../../configuration/_styles/configurationStyles";
import { NameWithId } from "../../../../../domain/nameWithId";
import { SelectionModeEnum } from "../../../../../utils/hierarchyUtils";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DsDropdownView = styled.div`
  ${Content} {
    border: 1px solid #cad5d9;
    background-color: white;
    color: black;
  }
`;

const DropdownSelectorView = styled.div`
  flex: 1;
`;

const Title = styled.div`
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const SelectedNames = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  disabled?: boolean;
  deliveryServices: NameWithId[];
  selectedIds: string[];
  onSelectionChanged: (dsIds: string[]) => void;

  className?: string;
}

//endregion [[ Props ]]

export const DsDropdown = (props: Props) => {
  const dsDropdownItems = getDsDropdownItems(props.deliveryServices, props.selectedIds);
  const selectedNames = props.selectedIds.map((id) => props.deliveryServices.find((ds) => ds.id === id)?.name ?? "N/A");
  const dropdownText: string = selectedNames.length > 0 ? selectedNames.join(", ") : "None";

  function onSelectionChanged(selectedDs: DropdownEntity[]) {
    props.onSelectionChanged(selectedDs.flatMap((ds) => ds.id));
  }

  return (
    <DsDropdownView className={props.className}>
      <EntitiesDropdown
        selectionMode={"multipleApplyOnClose"}
        isSearchable={true}
        shouldMatchMenuWidth={true}
        dropdownSelectorRenderer={
          <DropdownSelectorView>
            <Title>Affected Delivery Services</Title>
            <SelectedNames>{dropdownText}</SelectedNames>
          </DropdownSelectorView>
        }
        items={dsDropdownItems}
        disabled={props.disabled}
        onSelectionChanged={onSelectionChanged}
        componentThemeType={"light"}
      />
    </DsDropdownView>
  );
};

function getDsDropdownItems(deliveryServices: NameWithId[], selectedIds: string[]): DropdownEntity[] {
  return deliveryServices.map(
    (ds) =>
      new DropdownEntity({
        id: ds.id,
        label: ds.name ?? ds.id,
        selection: selectedIds.includes(ds.id) ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
      })
  );
}
