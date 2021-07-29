import * as React from "react";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { useProvider } from "@qwilt/common/components/providerDataContainer/_providers/useProvider";
import { ReportsScreen } from "./ReportsScreen";
import { UrlParameterTypeEnum } from "@qwilt/common/stores/urlParameterTypeEnum";
import { DeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/deploymentEntity";
import { QnDeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/qnDeploymentEntity";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";

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
