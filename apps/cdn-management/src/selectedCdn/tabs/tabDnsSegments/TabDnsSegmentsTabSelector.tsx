import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { TabSelector } from "common/components/configuration/tabSelector/TabSelector";
import { DateTime } from "luxon";
import pluralize from "pluralize";
import { DnsSegmentProvider } from "src/selectedCdn/tabs/tabDnsSegments/_providers/DnsSegmentProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
`;

const InfoGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabDnsSegmentsTabSelector = (props: Props) => {
  const cdn = useSelectedCdn();
  const prepareQueryResult = DnsSegmentProvider.instance.prepareQuery(cdn.id);
  const queryResult = prepareQueryResult.useQuery();

  const itemsCount = queryResult.data?.length;
  return (
    <TabSelector
      title={"DNS Routing Segments"}
      isLoading={queryResult.isFetching}
      onRefresh={() => prepareQueryResult.invalidateWithChildrenAndParents()}
      lastLoadDate={DateTime.fromMillis(queryResult.dataUpdatedAt)}
      subtitle={
        <InfoRow>
          <InfoGroup>
            {itemsCount} {pluralize("item", itemsCount ?? 0)}
          </InfoGroup>
        </InfoRow>
      }
      className={props.className}
    />
  );
};
