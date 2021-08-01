import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { VersionItem } from "common/components/experimentsToolbar/versionPicker/versionPickerDropdown/versionItem/VersionItem";
import { VersionEntity } from "common/components/experimentsToolbar/_domain/versionEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const VersionPickerDropdownView = styled.div`
  padding: 8px 0;
  background-color: white;
  max-height: 144px;
  overflow-y: auto;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  totalQnsCount: number;
  selectedVersion: string;
  versions: VersionEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const VersionPickerDropdown = ({ versions, ...props }: Props) => {
  return (
    <VersionPickerDropdownView className={props.className}>
      {versions.map((version, i) => {
        return (
          <VersionItem
            key={i}
            isLast={i === versions.length - 1}
            versionEntity={version}
            selectedVersion={props.selectedVersion}
            totalQnsCount={props.totalQnsCount}
          />
        );
      })}
    </VersionPickerDropdownView>
  );
};
