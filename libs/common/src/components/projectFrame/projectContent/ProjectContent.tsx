import * as React from "react";
import { ReactElement } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { SideBar } from "common/components/sideBar/SideBar";
import { UserStore } from "common/stores/userStore";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { RecordingBar } from "common/components/supportRecording/recordingBar/RecordingBar";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { RecordingStyles } from "common/components/supportRecording/_styles/recordingStyles";
import { ExperimentsToolbar } from "common/components/experimentsToolbar/ExperimentsToolbar";
import { observer } from "mobx-react-lite";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { GlobalStore } from "common/stores/globalStore";
import { useUrlState } from "common/utils/hooks/useUrlState";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { VersionsProvider } from "common/components/experimentsToolbar/_providers/versionsProvider";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { Notifier } from "common/utils/notifications/notifier";
import { AjaxMetadata } from "common/utils/ajax";
import { LoadingSpinnerGlobal } from "common/components/loadingSpinner/loadingSpinnerGlobal/LoadingSpinnerGlobal";
import { ParamsMetadata } from "common/components/applicationParameters/_types/paramsMetadataTypes";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ProjectContentView = styled.div<{ showRecordingBorder: boolean }>`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  width: 100%;
  ${(props) =>
    props.showRecordingBorder &&
    css`
      border-color: ${RecordingStyles.COLOR_RECORDING};
      border-width: 0 5px 5px 5px;
      border-style: solid;
    `}
`;

const RecordingBarStyled = styled(RecordingBar)`
  grid-column: 1 / span 2;
  z-index: 1001;
`;

const ExperimentsToolbarStyled = styled(ExperimentsToolbar)`
  grid-column: 1 / span 2;
  z-index: 1000;
`;

const Content = styled(ProviderDataContainer)`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  showSidebar: boolean;
  showExperimentsBar: boolean;
  projectParamsMetadata: ParamsMetadata | undefined;

  children: ReactElement;
  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]
//endregion [[ Functions ]]

export const ProjectContent = observer((props: Props) => {
  const userStore = UserStore.instance;

  const isQwiltUser = userStore.isQwiltUser;
  const isForcedRecording = !!UrlStore.getInstance().getBooleanParam(CommonUrlParams.recordSession);

  const showSidebar = props.showSidebar && userStore.cqloudUserInfo;
  const showRecordingUi = isForcedRecording && !isQwiltUser;

  const [qnVersion] = useUrlState(CommonUrlParams.qnVersion);
  const [restrictQn] = useUrlState(CommonUrlParams.restrictQn);
  const [restrictNetwork] = useUrlState(CommonUrlParams.restrictNetwork);

  const { data: versions, metadata } = useProvider(
    async (metadata) => {
      if (props.showExperimentsBar) {
        return await getVersions(qnVersion, metadata);
      } else {
        return [];
      }
    },
    false,
    [restrictQn, restrictNetwork, qnVersion]
  );

  return (
    <ProjectContentView showRecordingBorder={showRecordingUi}>
      {showRecordingUi && (
        <ErrorBoundary hidden={true}>
          <RecordingBarStyled />
        </ErrorBoundary>
      )}
      {props.showExperimentsBar && <ExperimentsToolbarStyled versions={versions ?? []} />}
      {showSidebar && userStore.cqloudUserInfo && (
        <SideBar
          userName={userStore.cqloudUserInfo.fullName}
          routes={userStore.routesMetadata}
          projectParamsMetadata={props.projectParamsMetadata}
        />
      )}
      <ErrorBoundary>
        {!metadata.isLoading ? (
          <Content providerMetadata={metadata}>{props.children}</Content>
        ) : (
          <LoadingSpinnerGlobal />
        )}
      </ErrorBoundary>
    </ProjectContentView>
  );
});

async function getVersions(qnVersion: string | undefined, metadata: AjaxMetadata) {
  try {
    const versions = await VersionsProvider.instance.provide(metadata);

    if (qnVersion) {
      const selectedVersion = versions.find((version) => version.id === qnVersion);
      if (selectedVersion) {
        GlobalStore.instance.supportedQnsNames = selectedVersion.supportedQnNames;
      }
    }

    return versions;
  } catch (e) {
    Notifier.error("Couldn't fetch QN versions", e);
    return [];
  }
}
