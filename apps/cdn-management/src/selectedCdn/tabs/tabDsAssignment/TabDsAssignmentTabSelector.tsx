import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { TabSelector } from "common/components/configuration/tabSelector/TabSelector";
import { DateTime } from "luxon";
import { DsAssignmentsProvider } from "src/selectedCdn/tabs/tabDsAssignment/_providers/dsAssignmentsProvider";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

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

export const TabDsAssignmentTabSelector = (props: Props) => {
  const cdn = useSelectedCdn();
  const prepareQueryResult = DsAssignmentsProvider.instance.prepareQuery(cdn.id, cdn.name);
  const queryResult = prepareQueryResult.useQuery();

  return (
    <TabSelector
      title={"Delivery Services Assignments"}
      isLoading={queryResult.isFetching}
      onRefresh={() => prepareQueryResult.invalidateWithChildrenAndParents()}
      lastLoadDate={DateTime.fromMillis(queryResult.dataUpdatedAt)}
      subtitle={
        <QueryDataContainer queryMetadata={queryResult}>
          {(data) => {
            const isOrphanHasLength = data.orphanContainingServicesIds.length > 0;

            return (
              <InfoRow>
                <TextTooltip content={"Orphan assignment indicated"} disabled={!isOrphanHasLength}>
                  <InfoGroup>
                    {data.assignedDsCount}/{data.deliveryServices.length} assigned DSes {isOrphanHasLength ? "⚠️" : ""}
                  </InfoGroup>
                </TextTooltip>
              </InfoRow>
            );
          }}
        </QueryDataContainer>
      }
      className={props.className}
    />
  );
};
