import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { HealthProvidersTab } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/HealthProvidersTab";
import { HealthProvidersProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_providers/healthProvidersProvider";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const HealthProvidersTabContainerView = styled(QueryDataContainer)`
  min-height: 0;
  display: grid;
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdnName: string;
  className?: string;
}

//endregion [[ Props ]]

export const HealthProvidersTabContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = HealthProvidersProvider.instance.prepareQuery(cdn.name).useQuery();

  return (
    <HealthProvidersTabContainerView queryMetadata={query} className={props.className}>
      {(entities) => <HealthProvidersTab cdnName={props.cdnName} entities={entities} />}
    </HealthProvidersTabContainerView>
  );
};
