import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HttpRoutersTab } from "./HttpRoutersTab";
import { HttpRoutersProvider } from "./_providers/httpRoutersProvider";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { useSelectedCdn } from "../../../../../_stores/selectedCdnStore";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const HttpRoutersTabContainerView = styled(QueryDataContainer)`
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

export const HttpRoutersTabContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = HttpRoutersProvider.instance.prepareQuery(cdn.name).useQuery();

  return (
    <HttpRoutersTabContainerView queryMetadata={query} className={props.className}>
      {(entities) => <HttpRoutersTab cdnName={props.cdnName} entities={entities} />}
    </HttpRoutersTabContainerView>
  );
};
