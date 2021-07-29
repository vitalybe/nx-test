import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HealthCollectorsTab } from "./HealthCollectorsTab";
import { HealthCollectorsProvider } from "./_providers/healthCollectorsProvider";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "../../../../../_stores/selectedCdnStore";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const HealthCollectorsTabContainerView = styled(QueryDataContainer)`
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

export const HealthCollectorsTabContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = HealthCollectorsProvider.instance.prepareQuery(cdn.name).useQuery();

  return (
    <HealthCollectorsTabContainerView queryMetadata={query} className={props.className}>
      {(entities) => <HealthCollectorsTab cdnName={props.cdnName} entities={entities} />}
    </HealthCollectorsTabContainerView>
  );
};
