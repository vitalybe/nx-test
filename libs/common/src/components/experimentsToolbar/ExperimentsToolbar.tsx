import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExperimentsBarStyles } from "common/components/experimentsToolbar/_styling/experimentsBarStyles";
import { Icons } from "common/styling/icons";
import { darken } from "polished";
import { CloseButton } from "common/components/closeButton/CloseButton";
import { VersionPicker } from "common/components/experimentsToolbar/versionPicker/VersionPicker";
import { MainStore, MainStoreContext } from "common/components/experimentsToolbar/_stores/mainStore";
import { observer } from "mobx-react-lite";
import { DescriptionPanel } from "./descriptionPanel/DescriptionPanel";
import { VersionEntity } from "common/components/experimentsToolbar/_domain/versionEntity";

const moduleLogger = loggerCreator(__filename);

const EXPANDED_HEIGHT = "32px";

//region [[ Styles ]]

const ExperimentsBarView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: visible;
  position: relative;
`;

const VersionBarContainer = styled.div<{ isExpanded: boolean; isBoxShadow: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  background-color: #2693be;
  width: 100%;
  transition: 0.2s ease;
  height: ${({ isExpanded }) => (isExpanded ? EXPANDED_HEIGHT : "4px")};
  box-shadow: ${({ isBoxShadow }) => (isBoxShadow ? "0 2px 6px 0 rgba(0, 0, 0, 0.5)" : "none")};
  overflow: ${({ isExpanded }) => (isExpanded ? "visible" : "hidden")};
`;

const VersionBar = styled.div`
  height: ${EXPANDED_HEIGHT};
  display: flex;
  align-items: center;
  width: 100%;
`;

const DescriptionToggle = styled.div`
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  font-size: 12px;
  margin-left: 16px;
  display: flex;
`;

const Toggle = styled.div`
  cursor: pointer;
  margin-right: 8px;
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${ExperimentsBarStyles.TEXT_COLOR};

  &:hover {
    color: ${darken(0.1, ExperimentsBarStyles.TEXT_COLOR)};
  }

  &:active {
    color: ${darken(0.2, ExperimentsBarStyles.TEXT_COLOR)};
  }
`;

const SupportedQns = styled.div`
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  margin-left: 24px;
  font-size: 12px;
`;

const CloseButtonStyled = styled(CloseButton)`
  margin-left: auto;
  margin-right: 10px;
  height: 15px;
  width: 15px;
`;

const VersionTab = styled.div<{ isVisible: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: ${({ isVisible }) => (isVisible ? "0" : "-20px")};
  height: 18px;
  background-color: #2fadde;
  min-width: 64px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  text-align: center;
  font-size: 12px;
  line-height: 1.5em;
  cursor: pointer;
  transition: 0.2s ease;
  overflow: hidden;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    opacity: 0.9;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  versions: VersionEntity[];
  className?: string;
}

//endregion [[ Props ]]

export const ExperimentsToolbar = observer(({ versions, ...props }: Props) => {
  const [isBarExpanded, setIsBarExpended] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const mainStore = useRef(new MainStore()).current;

  if (!!versions && versions.length > 0) {
    let selectedVersion = versions[versions.length - 1].id;
    if (mainStore.selectedVersion && versions.some((version) => version.id === mainStore.selectedVersion)) {
      selectedVersion = mainStore.selectedVersion;
    } else {
      mainStore.selectedVersion = undefined;
    }
    const totalQnsCount: number = versions?.flatMap((versionEntity) => versionEntity.versionQnNames).length ?? 0;

    const supportedQnsNames: string[] =
      versions?.find((versionEntity) => versionEntity.id === selectedVersion)?.supportedQnNames ?? [];

    const versionTabContent = selectedVersion ? `V ${selectedVersion}+` : "";

    const summary = "No information.";

    const onClose = () => {
      if (isDescriptionExpanded) {
        setIsDescriptionExpanded(false);
        //animation delay using timeout
        setTimeout(() => setIsBarExpended(false), 500);
      } else {
        setIsBarExpended(false);
      }
    };

    return (
      <MainStoreContext.Provider value={mainStore}>
        <ExperimentsBarView className={props.className}>
          <VersionBarContainer isExpanded={isBarExpanded} isBoxShadow={isBarExpanded && !isDescriptionExpanded}>
            <VersionBar>
              <DescriptionToggle>
                <Toggle onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                  <Icon icon={isDescriptionExpanded ? Icons.CARET_UP : Icons.CARET_DOWN} />
                </Toggle>
                Display QwOS
              </DescriptionToggle>
              <VersionPicker
                totalQnsCount={totalQnsCount}
                versions={versions ?? []}
                selectedVersion={selectedVersion}
              />
              <SupportedQns>
                {supportedQnsNames.length}/{totalQnsCount} QNs
              </SupportedQns>
              <CloseButtonStyled onClick={onClose} color={ExperimentsBarStyles.TEXT_COLOR} />
            </VersionBar>
            <DescriptionPanel
              selectedVersion={selectedVersion}
              isExpanded={isDescriptionExpanded}
              summary={summary}
              totalQnsCount={totalQnsCount}
              supportedQnsNames={supportedQnsNames}
            />
          </VersionBarContainer>
          <VersionTab
            isVisible={!!versions && !!selectedVersion && !isBarExpanded}
            onClick={() => setIsBarExpended(true)}>
            {versionTabContent}
          </VersionTab>
        </ExperimentsBarView>
      </MainStoreContext.Provider>
    );
  } else {
    return null;
  }
});
