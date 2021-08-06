import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { Tooltip } from "../../Tooltip";
import { Icons } from "../../../styling/icons";
import { ExperimentsBarStyles } from "../_styling/experimentsBarStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { darken } from "polished";
import { useState } from "react";
import { VersionPickerDropdown } from "./versionPickerDropdown/VersionPickerDropdown";
import { VersionEntity } from "../_domain/versionEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const VersionPickerDropdownView = styled.div``;

//endregion [[ Styles ]]

const Content = styled.div`
  margin-left: 16px;
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  font-weight: 600;
  font-size: 12px;
  display: flex;
  cursor: pointer;
  outline: none;

  &:hover {
    color: ${darken(0.1, ExperimentsBarStyles.TEXT_COLOR)};
  }

  &:active {
    color: ${darken(0.2, ExperimentsBarStyles.TEXT_COLOR)};
  }
`;

const IconContianer = styled.div`
  margin-left: 5px;
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${ExperimentsBarStyles.TEXT_COLOR};

  ${Content}:hover & {
    color: ${darken(0.1, ExperimentsBarStyles.TEXT_COLOR)};
  }

  ${Content}:active & {
    color: ${darken(0.2, ExperimentsBarStyles.TEXT_COLOR)};
  }
`;

//region [[ Props ]]

export interface Props {
  totalQnsCount: number;
  selectedVersion: string;
  versions: VersionEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const VersionPicker = ({ selectedVersion, ...props }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <VersionPickerDropdownView className={props.className}>
      <Tooltip
        content={
          <VersionPickerDropdown
            selectedVersion={selectedVersion}
            versions={props.versions}
            totalQnsCount={props.totalQnsCount}
          />
        }
        distance={16}
        placement={"bottom-start"}
        hideOnClick={true}
        interactive={true}
        trigger={"click"}
        arrow={false}
        onShow={() => setIsOpen(true)}
        onHide={() => setIsOpen(false)}>
        <Content>
          Version {selectedVersion}+
          <IconContianer>
            <Icon icon={isOpen ? Icons.ANGLE_UP : Icons.ANGLE_DOWN} />
          </IconContianer>
        </Content>
      </Tooltip>
    </VersionPickerDropdownView>
  );
};
