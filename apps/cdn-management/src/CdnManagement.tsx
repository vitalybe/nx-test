import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { GlobalFontProvider } from "@qwilt/common/components/GlobalFontProvider";
import { SelectedCdn } from "./selectedCdn/SelectedCdn";
import { lighten } from "polished";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { Fonts } from "@qwilt/common/styling/fonts";
import { ErrorBoundary } from "@qwilt/common/components/ErrorBoundary";
import { TopBar } from "./topBar/TopBar";
import { CdnsProvider } from "./_providers/cdnsProvider";
import { LoadingSpinnerGlobal } from "@qwilt/common/components/loadingSpinner/loadingSpinnerGlobal/LoadingSpinnerGlobal";
import { CdnEntity } from "./_domain/cdnEntity";
import { useUrlState } from "@qwilt/common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "./_stores/projectUrlParams";
import { SelectedCdnContextProvider } from "./_stores/selectedCdnStore";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CdnManagementView = styled(GlobalFontProvider)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  padding: 0 2em 2em;
  background-color: #edeff0;
  color: #15181a;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 5px 3px 3px 3px;
`;

const SelectedCdnStyled = styled(SelectedCdn)`
  flex: 1;
`;

const Title = styled.div`
  color: ${lighten(0.2, CommonColors.NEVADA)};
  height: inherit;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${Fonts.FONT_SIZE_22};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const CdnManagement = (props: Props) => {
  const cdnsQuery = CdnsProvider.instance.prepareQuery().useQuery();
  const [selectedCdnId] = useUrlState(ProjectUrlParams.selectedCdnId);

  let selectedCdn: CdnEntity | undefined;
  if (selectedCdnId) {
    selectedCdn = cdnsQuery.data?.find((cdn) => cdn.id === selectedCdnId);
  }

  return (
    <CdnManagementView className={props.className}>
      <ErrorBoundary>
        {!cdnsQuery.isLoading ? (
          <>
            <TopBar cdns={cdnsQuery.data ?? []} selectedCdn={selectedCdn} />
            <Content>
              {!selectedCdn ? (
                <Title>Please select CDN</Title>
              ) : cdnsQuery.isLoading ? (
                <Title>Loading...</Title>
              ) : (
                <SelectedCdnContextProvider value={selectedCdn}>
                  <SelectedCdnStyled />
                </SelectedCdnContextProvider>
              )}
            </Content>
          </>
        ) : (
          <LoadingSpinnerGlobal />
        )}
      </ErrorBoundary>
    </CdnManagementView>
  );
};
