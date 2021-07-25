import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { Content, EntitiesDropdown } from "../../../../entitiesDropdown/EntitiesDropdown";
import { DropdownEntity } from "../../../../entitiesDropdown/_domain/dropdownEntity";
import { HierarchyUtils, SelectionModeEnum } from "../../../../../utils/hierarchyUtils";
import { ConfigurationStyles } from "../../../../configuration/_styles/configurationStyles";
import { DeploymentEntityWithChildren } from "../../../../../domain/qwiltDeployment/deploymentEntityWithChildren";
import { QnDropdownEntitiesFactory } from "../../../../entitiesDropdown/_util/qnDropdownEntitiesFactory";
import { SystemUpdatesUtils } from "../../_utils/systemUpdatesUtils";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const AffectedEntitiesDropdownView = styled.div`
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

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  networksHierarchy: DeploymentEntityWithChildren[];
  affectedIds: number[];
  disabled?: boolean;

  onSelectionChanged: (affectedIds: number[]) => void;

  className?: string;
}

//endregion [[ Props ]]

export const AffectedEntitiesDropdown = (props: Props) => {
  const affectedDropdownItems = useAffectedDropdownItems(props.networksHierarchy, props.affectedIds);

  const textParts = SystemUpdatesUtils.getAffectedEntitiesTexts(props.affectedIds, props.networksHierarchy);

  let dropdownText: string;
  if (textParts.length === 0) {
    dropdownText = "None";
  } else if (textParts.length < 3) {
    dropdownText = textParts.join(", ");
  } else {
    dropdownText = `${textParts[0]}, ...another ${textParts.length - 1} items`;
  }

  function onSelectionChanged(selectedQns: DropdownEntity[], allItems: DropdownEntity[]) {
    props.onSelectionChanged(HierarchyUtils.getTopSelectedEntities(allItems).map((item) => Number.parseInt(item.id)));
  }

  return (
    <AffectedEntitiesDropdownView className={props.className}>
      <EntitiesDropdown
        selectionMode={"multipleApplyOnClose"}
        isSearchable={true}
        shouldMatchMenuWidth={true}
        dropdownSelectorRenderer={
          <DropdownSelectorView>
            <Title>Affected QNs</Title>
            <div data-testid={"dropdown-selector"}>{dropdownText}</div>
          </DropdownSelectorView>
        }
        items={affectedDropdownItems}
        disabled={props.disabled}
        onSelectionChanged={onSelectionChanged}
        componentThemeType={"light"}
      />
    </AffectedEntitiesDropdownView>
  );
};

function useAffectedDropdownItems(networksHierarchy: DeploymentEntityWithChildren[], affectedIds: number[]) {
  return useMemo(() => {
    const { qnDropdownEntities } = QnDropdownEntitiesFactory.fromQnDeploymentHierarchy(networksHierarchy);

    HierarchyUtils.flatEntitiesHierarchy<DropdownEntity>(qnDropdownEntities).forEach(
      (item) => (item.selection = SelectionModeEnum.NOT_SELECTED)
    );

    affectedIds.forEach((id) => HierarchyUtils.toggleSelectionMutate(qnDropdownEntities, id.toString(), true));

    return qnDropdownEntities;
  }, [affectedIds, networksHierarchy]);
}
