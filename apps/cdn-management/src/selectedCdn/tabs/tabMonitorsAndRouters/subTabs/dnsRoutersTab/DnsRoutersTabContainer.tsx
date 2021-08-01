import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DnsRoutersTab } from "./DnsRoutersTab";
import { DnsRoutersProvider } from "./_providers/dnsRoutersProvider";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "../../../../../_stores/selectedCdnStore";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DnsRoutersTabContainerView = styled(QueryDataContainer)`
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

export const DnsRoutersTabContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = DnsRoutersProvider.instance.prepareQuery(cdn.name).useQuery();

  return (
    <DnsRoutersTabContainerView queryMetadata={query} className={props.className}>
      {(entities) => <DnsRoutersTab cdnName={props.cdnName} entities={entities} />}
    </DnsRoutersTabContainerView>
  );
};
