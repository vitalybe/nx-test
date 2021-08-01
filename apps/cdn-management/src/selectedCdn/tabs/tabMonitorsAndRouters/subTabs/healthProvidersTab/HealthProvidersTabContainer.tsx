import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HealthProvidersTab } from "./HealthProvidersTab";
import { HealthProvidersProvider } from "./_providers/healthProvidersProvider";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "../../../../../_stores/selectedCdnStore";

const moduleLogger = loggerCreator("__filename");

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
