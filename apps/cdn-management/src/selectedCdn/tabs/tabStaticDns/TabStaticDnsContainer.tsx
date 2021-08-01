import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { TabStaticDns } from "src/selectedCdn/tabs/tabStaticDns/TabStaticDns";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { DeliveryServicesProvider } from "src/_providers/deliveryServicesProvider";
import { StaticDnsProvider } from "src/selectedCdn/tabs/tabStaticDns/_providers/staticDnsProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  display: flex;
  flex: 1;
  min-height: 0;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabStaticDnsContainer = (props: Props) => {
  const tabStaticDnsQuery = new PrepareQueryResult({
    name: "TabStaticDnsContainer",
    provide: async (key) => {
      return {
        deliveryServices: await DeliveryServicesProvider.instance.prepareQuery().fetchQueryAsDependency(key),
        staticDnsRecords: await StaticDnsProvider.instance.prepareQuery().fetchQueryAsDependency(key),
      };
    },
  }).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={tabStaticDnsQuery}>
      {(result) => (
        <TabStaticDns deliveryServices={result.deliveryServices} staticDnsRecords={result.staticDnsRecords} />
      )}
    </QueryDataContainerStyled>
  );
};
