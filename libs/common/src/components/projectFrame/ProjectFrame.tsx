import * as React from "react";
import { ReactChild, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { RootComponents } from "common/components/RootComponents";
import { UserStore } from "common/stores/userStore";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { observer } from "mobx-react-lite";
import { LoadingFailed } from "common/components/projectFrame/loadingFailed/LoadingFailed";
import { ProjectContent } from "common/components/projectFrame/projectContent/ProjectContent";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { getRedirectPathForEnv } from "common/components/projectFrame/_util/getRedirectPathForEnv";
import { RedirectToVersion } from "common/components/projectFrame/redirectToVersion/RedirectToVersion";
import { getQcServicesWindow } from "common/utils/qcServicesWindow";
import { ParamsMetadata } from "common/components/applicationParameters/_types/paramsMetadataTypes";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { CommonUrlParams, commonUrlParamsMetadata } from "common/urlParams/commonUrlParams";
import { QueryClientProvider } from "react-query";
import { GlobalStore } from "common/stores/globalStore";
import { ReactQueryDevtools } from "react-query/devtools";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ProjectFrameView = styled.div``;

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const OverlayContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//endregion

//region [[ Functions ]]
//endregion [[ Functions ]]

export interface Props {
  title: string;
  children: ReactElement;
  showSidebar?: boolean;
  showExperimentsBar?: boolean;
  showCopyright?: boolean;
  projectParamsMetadata: ParamsMetadata | undefined;

  className?: string;
}

const userStore = UserStore.instance;

export const ProjectFrame = observer(({ showSidebar = true, showExperimentsBar = false, ...props }: Props) => {
  useEffect(() => handlePersistentUrlParams(props.projectParamsMetadata ?? {}), [props.projectParamsMetadata]);
  useEffect(() => {
    document.title = `${props.title} - QC Services`;
  }, [props.title]);

  const { data: redirectVersionHref, metadata: redirectVersionMetadata } = useProvider(
    () => getRedirectPathForEnv(),
    false,
    []
  );

  // wait until cypress finishes configuring all the mocks
  const isWaitingForCypress = useIsWaitingForCypress();

  let content: ReactChild | undefined;
  if (userStore.isLoading || redirectVersionMetadata.isLoading || isWaitingForCypress) {
    content = (
      <OverlayContainer>
        <LoadingSpinner />
      </OverlayContainer>
    );
  } else {
    if (userStore.cqloudUserInfo) {
      if (!redirectVersionHref) {
        content = (
          <ProjectContent
            showSidebar={showSidebar}
            showExperimentsBar={showExperimentsBar}
            projectParamsMetadata={props.projectParamsMetadata}>
            {props.children}
          </ProjectContent>
        );
      } else {
        content = <RedirectToVersion versionHref={redirectVersionHref} />;
      }
    } else {
      content = <LoadingFailed errorStatus={userStore.errorStatus} />;
    }
  }

  return (
    <ProjectFrameView className={props.className}>
      <ErrorBoundary>
        <QueryClientProvider client={GlobalStore.instance.queryClient}>
          <RootComponents />
          <MainContainer>{content}</MainContainer>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </ProjectFrameView>
  );
});

function useIsWaitingForCypress() {
  const [isWaitingForCypress, setIsWaitingForCypress] = useState(!!getQcServicesWindow().Cypress);
  useEffect(() => {
    let checkInterval = 0;
    if (isWaitingForCypress) {
      checkInterval = window?.setInterval(() => {
        if (getQcServicesWindow().cypressMockFinished) {
          setIsWaitingForCypress(false);
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => clearInterval(checkInterval);
  }, [isWaitingForCypress]);

  return isWaitingForCypress;
}

const PROD_ENV = "prod";

function handlePersistentUrlParams(projectUrlParamsMetadata: ParamsMetadata) {
  const env = devToolsStore.environment || PROD_ENV;
  const urlStore = UrlStore.getInstance();
  if (!urlStore.getBooleanParam(CommonUrlParams.disablePersistentParams)) {
    Object.entries({ ...commonUrlParamsMetadata, ...projectUrlParamsMetadata }).forEach(([param, data]) => {
      if (data.persistentEnvs?.includes(env)) {
        urlStore.setBooleanParam(param, true);
      }
    });
  }
}
