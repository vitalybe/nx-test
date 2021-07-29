import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { MonitorsTab } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/MonitorsTab";
import { MonitorsProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_providers/monitorsProvider";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const MonitorsTabContainerView = styled(QueryDataContainer)`
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

export const MonitorsTabContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = MonitorsProvider.instance.prepareQuery(cdn.name).useQuery();

  return (
    <MonitorsTabContainerView queryMetadata={query} className={props.className}>
      {(entities) => <MonitorsTab cdnName={props.cdnName} entities={entities} />}
    </MonitorsTabContainerView>
  );
};
