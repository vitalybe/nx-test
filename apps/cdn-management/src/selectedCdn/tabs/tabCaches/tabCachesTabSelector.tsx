import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CacheIcon, UnassignedQnIcon } from "common/components/configuration/configurationIcons";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { TabSelector } from "common/components/configuration/tabSelector/TabSelector";
import { DateTime } from "luxon";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { TabCachesProvider } from "src/selectedCdn/tabs/tabCaches/_providers/tabCachesProvider";

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

const CacheIconStyled = styled(CacheIcon)`
  margin-right: 3px;
  height: 1rem;
  width: 1rem;
`;
const UnassignedQnIconStyled = styled(UnassignedQnIcon)`
  margin-right: 3px;
  height: 1rem;
  width: 1rem;
`;

const TextTooltipStyled = styled(TextTooltip).attrs({ placement: "bottom", delay: 500 })``;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabCachesTabSelector = (props: Props) => {
  const cdn = useSelectedCdn();
  const prepareQueryResult = TabCachesProvider.instance.prepareQuery(cdn.id);
  const query = prepareQueryResult.useQuery();

  const hasUnmonitoredCaches = !!query.data?.caches.filter((cache) => cache.monitoringSegmentId === "").length;

  return (
    <TabSelector
      title={"Caches"}
      isLoading={query.isFetching}
      onRefresh={() => prepareQueryResult.invalidateWithChildrenAndParents()}
      lastLoadDate={DateTime.fromMillis(query.dataUpdatedAt)}
      subtitle={
        <InfoRow>
          <TextTooltipStyled content={"Caches"}>
            <InfoGroup>
              <CacheIconStyled />
              {query.data?.caches.length}
            </InfoGroup>
          </TextTooltipStyled>
          <TextTooltipStyled content={"Unassigned QNs"}>
            <InfoGroup>
              <UnassignedQnIconStyled />
              {query.data?.availableQns.length}
            </InfoGroup>
          </TextTooltipStyled>
          {hasUnmonitoredCaches ? (
            <TextTooltip content={"Unmonitored caches"}>
              <span>⚠️</span>
            </TextTooltip>
          ) : null}
        </InfoRow>
      }
      className={props.className}
    />
  );
};
