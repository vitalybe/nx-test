import * as React from "react";
import { loggerCreator } from "@qwilt/common";
import { AjaxMetadata } from "@qwilt/common";
import { useProvider } from "@qwilt/common";
import { ReportsScreen } from "./ReportsScreen";
import { UrlParameterTypeEnum } from "@qwilt/common";
import { DeploymentEntity } from "@qwilt/common";
import { QnDeploymentEntity } from "@qwilt/common";
import { DeploymentEntitiesProvider } from "@qwilt/common";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

//endregion

export interface Props {
  className?: string;
}

interface ProvidedData {
  qns: QnDeploymentEntity[];
  network: DeploymentEntity | undefined;
}

export const ReportsScreenContainer = React.memo((props: Props) => {
  const { data, metadata } = useProvider(
    async () => {
      const qns = await DeploymentEntitiesProvider.instance.provideQns(new AjaxMetadata());

      const currentUrl = new URLSearchParams(location.search);
      const isRestrictNetwork = currentUrl.has(UrlParameterTypeEnum.restrictNetwork);
      let restrictedNetwork: DeploymentEntity[] = [];
      if (isRestrictNetwork) {
        restrictedNetwork = await DeploymentEntitiesProvider.instance.provideNetworks(new AjaxMetadata());
      }

      return {
        qns,
        network: restrictedNetwork[0],
      };
    },
    false,
    []
  );

  const providedData = data as ProvidedData;

  const qnList = providedData?.qns;
  const restrictedNetworkName = providedData?.network?.name;

  if (!metadata.isLoading && providedData) {
    return <ReportsScreen qnList={qnList} restrictedNetworkName={restrictedNetworkName} />;
  } else {
    return null;
  }
});
