import * as React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Icons } from "common/styling/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonColors } from "common/styling/commonColors";
import { VersionEntity } from "common/components/experimentsToolbar/_domain/versionEntity";
import { MainStoreContext } from "common/components/experimentsToolbar/_stores/mainStore";
import { observer } from "mobx-react-lite";
import { lighten } from "polished";
import { GlobalStore } from "common/stores/globalStore";

const moduleLogger = loggerCreator(__filename);

const TEXT_COLOR = "#07394c";

//region [[ Styles ]]

const VersionItemView = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 32px;
  padding-left: 9px;
  padding-right: 9px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? CommonColors.ICE_BLUE : "white")};
  transition: 0.1s ease-out;

  &:hover {
    background-color: ${lighten(0.02, CommonColors.ICE_BLUE)};
  }
`;

const Icon = styled(FontAwesomeIcon)`
  transition: 0.3s ease;
`;

const Version = styled.div<{ isSelected: boolean }>`
  margin-left: 9px;
  width: 100px;
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 0)};
  text-align: left;
  color: ${TEXT_COLOR};
`;

const SupportedQns = styled.div<{ isSelected: boolean }>`
  margin-left: 10px;
  width: 81px;
  text-align: right;
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 0)};
  color: ${TEXT_COLOR};
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isLast: boolean;
  versionEntity: VersionEntity;
  selectedVersion: string;
  totalQnsCount: number;

  className?: string;
}

//endregion [[ Props ]]

export const VersionItem = observer(({ selectedVersion, versionEntity, ...props }: Props) => {
  const mainStore = useContext(MainStoreContext);

  const onVersionChange = GlobalStore.instance.experimentsToolbarOnSelectionChange;

  if (!mainStore) {
    throw new Error("store not defined");
  }

  const isSelected = selectedVersion === versionEntity.id;

  const setSelectedVersion = () => {
    mainStore.selectedVersion = props.isLast ? undefined : versionEntity.id;

    if (onVersionChange) {
      onVersionChange();
    }
  };

  return (
    <VersionItemView className={props.className} isSelected={isSelected} onClick={setSelectedVersion}>
      <Icon icon={Icons.CHECK} color={isSelected ? TEXT_COLOR : "transparent"} />
      <Version isSelected={isSelected}>Version {versionEntity.id}+</Version>
      <SupportedQns isSelected={isSelected}>
        {versionEntity.supportedQnNames.length}/{props.totalQnsCount} QNs
      </SupportedQns>
    </VersionItemView>
  );
});
